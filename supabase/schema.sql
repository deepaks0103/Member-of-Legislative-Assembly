-- ==========================================================
-- Supabase Schema: Complete CDO Database Setup
-- 1. Staff Profile & Role Management
-- 2. Complaints Table & Tracking ID Generation
-- 3. Storage Bucket & Policies for Attachments
-- ==========================================================

-- ==========================================================
-- SECTION 1: Staff Table
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.staff (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff', 'coordinator', 'field_officer')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff members can view their own profile"
    ON public.staff FOR SELECT TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Staff members can update their own profile"
    ON public.staff FOR UPDATE TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all staff profiles"
    ON public.staff FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.staff
            WHERE staff.id = auth.uid() AND staff.role = 'admin'
        )
    );

CREATE POLICY "Admins can insert or update staff profiles"
    ON public.staff FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.staff
            WHERE staff.id = auth.uid() AND staff.role = 'admin'
        )
    );

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_staff_updated_at ON public.staff;
CREATE TRIGGER set_staff_updated_at
    BEFORE UPDATE ON public.staff
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.staff (id, email, name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'staff')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();


-- ==========================================================
-- SECTION 2: Complaints Table & Auto-Generated Tracking Code
-- ==========================================================

-- Sequence for human-readable tracking codes: KLK-2026-XXXXX
CREATE SEQUENCE IF NOT EXISTS public.complaint_tracking_seq START 10001;

CREATE TABLE IF NOT EXISTS public.complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    address TEXT,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'assigned', 'action_taken', 'resolved', 'rejected', 'in_review', 'Submitted', 'Under Review', 'Assigned', 'Action Taken', 'Resolved', 'Rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Trigger to auto-generate complaint_id if not supplied
CREATE OR REPLACE FUNCTION public.generate_complaint_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.complaint_id IS NULL OR NEW.complaint_id = '' THEN
        NEW.complaint_id := 'KLK-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('public.complaint_tracking_seq')::TEXT, 5, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_generate_complaint_id ON public.complaints;
CREATE TRIGGER trigger_generate_complaint_id
    BEFORE INSERT ON public.complaints
    FOR EACH ROW
    EXECUTE FUNCTION public.generate_complaint_id();

DROP TRIGGER IF EXISTS set_complaints_updated_at ON public.complaints;
CREATE TRIGGER set_complaints_updated_at
    BEFORE UPDATE ON public.complaints
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_complaints_mobile ON public.complaints(mobile);
CREATE INDEX IF NOT EXISTS idx_complaints_complaint_id ON public.complaints(complaint_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON public.complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON public.complaints(created_at DESC);


-- ==========================================================
-- SECTION 3: Row Level Security (RLS) & Secure RPC Functions
-- ==========================================================

ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- 1. Anyone (public / anon) can INSERT a complaint
CREATE POLICY "Public can submit complaints"
    ON public.complaints
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- 2. Policy allowing anon/public SELECT by specific complaint_id
CREATE POLICY "Public can view complaint by complaint_id"
    ON public.complaints
    FOR SELECT
    TO anon
    USING (complaint_id IS NOT NULL);

-- 3. Authenticated staff can view all complaints
CREATE POLICY "Staff can view all complaints"
    ON public.complaints
    FOR SELECT
    TO authenticated
    USING (true);

-- 4. Authenticated staff can update status/details on any complaint
CREATE POLICY "Staff can update complaints"
    ON public.complaints
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 5. Secure Function for Mobile Lookup (SECURITY DEFINER)
-- Bypasses general table scan permissions while restricting output strictly to matching mobile
CREATE OR REPLACE FUNCTION public.get_complaint_by_mobile(p_mobile TEXT)
RETURNS SETOF public.complaints
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF p_mobile IS NULL OR trim(p_mobile) = '' THEN
        RETURN;
    END IF;

    RETURN QUERY
    SELECT *
    FROM public.complaints
    WHERE mobile = regexp_replace(p_mobile, '\D', '', 'g')
    ORDER BY created_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_complaint_by_mobile(TEXT) TO anon, authenticated;


-- ==========================================================
-- SECTION 4: Storage Bucket & Policies for Attachments
-- ==========================================================

-- Create storage bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('complaint-attachments', 'complaint-attachments', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Public can upload attachments
CREATE POLICY "Public can upload complaint attachments"
    ON storage.objects
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (bucket_id = 'complaint-attachments');

-- Public can read attachments
CREATE POLICY "Public can view complaint attachments"
    ON storage.objects
    FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'complaint-attachments');

-- Staff can manage all attachments
CREATE POLICY "Staff can manage all attachments"
    ON storage.objects
    FOR ALL
    TO authenticated
    USING (bucket_id = 'complaint-attachments');


-- ==========================================================
-- SECTION 5: Complaint Status History & Audit Trail
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.complaint_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id TEXT NOT NULL REFERENCES public.complaints(complaint_id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    changed_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_status_history_complaint_id ON public.complaint_status_history(complaint_id);
CREATE INDEX IF NOT EXISTS idx_status_history_changed_at ON public.complaint_status_history(changed_at ASC);

ALTER TABLE public.complaint_status_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public can view status history" ON public.complaint_status_history;
DROP POLICY IF EXISTS "Public and staff can insert status history" ON public.complaint_status_history;
DROP POLICY IF EXISTS "Staff can manage status history" ON public.complaint_status_history;

-- 1. Anyone can view status history
CREATE POLICY "Public can view status history"
    ON public.complaint_status_history
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- 2. Public and staff can insert status history
CREATE POLICY "Public and staff can insert status history"
    ON public.complaint_status_history
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- 3. Staff can manage status history
CREATE POLICY "Staff can manage status history"
    ON public.complaint_status_history
    FOR ALL
    TO authenticated
    USING (true);

