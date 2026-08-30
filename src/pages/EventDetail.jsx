import { useEffect, useState } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Clock3, MapPin, Share2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { blogPosts } from '../data/blogPosts';
import { communityEvents } from '../data/events';
import { useLanguage } from '../context/LanguageContext';

const EventDetail = ({ type: propType }) => {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const { language, t } = useLanguage();

  const type = propType || (location.pathname.startsWith('/blog') ? 'blog' : 'events');

  const item = type === 'blog'
    ? blogPosts.find((p) => p.slug === slug)
    : communityEvents.find((e) => e.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug, type]);

  if (!item) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <Navbar />
        <main className="mx-auto flex-grow max-w-2xl px-6 py-24 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">404</p>
          <h1 className="mt-3 text-4xl font-bold text-[#1a1a1a]">
            {type === 'blog' ? t('article_not_found', 'Article not found') : t('programme_not_found', 'Programme not found')}
          </h1>
          <Link to="/" className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
            <ArrowLeft size={16} /> {t('return_home', 'Return home')}
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const title = language === 'ta' && (item.title_ta || item.name_ta)
    ? (item.title_ta || item.name_ta)
    : (item.title || item.name);

  const excerpt = language === 'ta' && item.excerpt_ta ? item.excerpt_ta : item.excerpt;
  const content = language === 'ta' && item.content_ta ? item.content_ta : item.content;
  const eventLocation = language === 'ta' && item.location_ta ? item.location_ta : item.location;

  const blogParagraphs = type === 'blog' ? (
    language === 'ta' ? [
      content,
      'பொதுமக்கள் தங்கள் புகாரில் தெளிவான தகவல்களைப் பகிரும்போது, கள அதிகாரிகள் பிரச்சனையைப் புரிந்து கொண்டு விரைவாக செயல்பட முடியும். துல்லியமான இடம், விளக்கம் மற்றும் புகைப்படம் ஆகியவை புகாரை விரைவில் தீர்க்க உதவுகின்றன.',
      'நாம் அனைவரும் இணைந்து மேற்கொள்ளும் சிறிய முயற்சிகள் நமது பகுதியின் பாதுகாப்பையும் வசதியையும் மேம்படுத்தும். பொதுமக்களின் ஒத்துழைப்பு அன்றாட நிர்வாகச் செயல்பாடுகளுக்கு மிக முக்கியமாகும்.',
      'பொது உள்கட்டமைப்பைப் பாதுகாப்பது நம் அனைவரின் கூட்டுப் பொறுப்பாகும். உடனுக்குடன் தகவல் தெரிவிப்பது பிரச்சனைகளை ஆரம்பத்திலேயே தீர்க்க வழிவகுக்கும்.',
    ] : [
      item.content,
      'When residents share clear details, local teams can better understand an issue and plan the right response. A precise location, a short description and a photo, when safe to take one, make every report more useful.',
      'Small actions taken consistently improve the safety, comfort and quality of shared neighbourhood spaces. Community participation helps services focus on what matters most each day.',
      'Looking after public infrastructure is a shared responsibility. Timely feedback helps identify concerns early and supports better planning for future maintenance.',
    ]
  ) : [];

  const handleShare = async () => {
    const shareData = { title, text: excerpt, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      // Native share cancel silent handle
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-grow bg-[#fafafa]">
        <article className="mx-auto w-full max-w-[1400px] px-2.5 sm:px-6 lg:px-8 pt-3 pb-8 sm:pt-4 sm:pb-12 lg:pt-5 lg:pb-14">
          {/* Header */}
          <header className="w-full">
            {/* Top Left Back Button */}
            <button
              type="button"
              onClick={() => (window.history.length > 2 ? navigate(-1) : navigate('/'))}
              className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#e5e5e5] bg-white px-3 py-1 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-[#555] shadow-sm transition hover:border-primary hover:bg-primary hover:text-white group cursor-pointer"
            >
              <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-1" />
              <span>{t('back', 'Back')}</span>
            </button>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.15em] sm:tracking-[0.18em] text-[#8a8a8a]">
              <span>{type === 'blog' ? t('urbanism', 'Urbanism') : t('daily_mla_programme', 'Daily MLA Programme')}</span>
              <span className="font-normal normal-case tracking-normal text-[#9a9a9a]">{item.date}</span>
            </div>

            <h1 className="mt-2 text-2xl sm:text-3xl lg:text-[2.75rem] font-bold leading-tight sm:leading-[1.15] tracking-[-0.03em] text-[#111] break-words">
              {title}
            </h1>

            {type === 'events' && (
              <div className="mt-3 flex flex-wrap gap-2.5 sm:gap-4 text-xs sm:text-sm text-[#555]">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={15} className="text-primary shrink-0" />
                  {item.date}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 size={15} className="text-primary shrink-0" />
                  {item.time}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={15} className="text-primary shrink-0" />
                  {eventLocation}
                </span>
              </div>
            )}
          </header>

          {/* Featured image */}
          <figure className="relative mt-4 sm:mt-5 mx-auto max-w-4xl overflow-hidden rounded-xl shadow-sm group">
            <img
              src={item.image}
              alt=""
              className="h-[180px] sm:h-[290px] lg:h-[350px] w-full object-cover"
            />
            {/* Top Right Share Button Icon */}
            <button
              type="button"
              onClick={handleShare}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-black/50 hover:bg-black/75 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-white shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
              title={t('share', 'Share')}
              aria-label={t('share', 'Share')}
            >
              <Share2 size={14} className="text-white" />
              <span>{copied ? t('copied', 'Copied!') : t('share', 'Share')}</span>
            </button>

            {type === 'blog' && (
              <figcaption className="absolute bottom-3 right-4 text-[10px] font-medium uppercase tracking-[0.12em] text-white/90 drop-shadow">
                Photo by E. Andrews
              </figcaption>
            )}
          </figure>

          {/* Body + sidebar */}
          <section className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
            <div className="min-w-0">
              {type === 'blog' ? (
                <div className="space-y-6 text-[1.05rem] leading-8 text-[#333]">
                  <p>{blogParagraphs[0]}</p>
                  <p>{blogParagraphs[1]}</p>

                  <h2 className="pt-2 text-2xl font-bold tracking-[-0.02em] text-[#111]">
                    {t('why_it_matters', 'Why It Matters')}
                  </h2>
                  <p>{blogParagraphs[2]}</p>

                  <blockquote className="border-l-2 border-[#c8c8c8] py-1 pl-5 text-[1.05rem] italic leading-8 text-[#555]">
                    {language === 'ta'
                      ? '“பொது இடங்களின் மேன்மை என்பது விழிப்புணர்வுடன் கூடிய மக்களின் கவனிப்பிலும் உடனடி செயல்பாட்டிலும் தொடங்குகிறது.”'
                      : '“Better public spaces begin with people who notice, care, and take action. The smallest intervention often sparks the largest shift in collective behavior.”'}
                  </blockquote>

                  <p>{blogParagraphs[3]}</p>

                  <h2 className="pt-2 text-2xl font-bold tracking-[-0.02em] text-[#111]">
                    {t('actionable_steps', 'Actionable Steps')}
                  </h2>
                  <p>
                    {language === 'ta'
                      ? 'நமது பகுதியை மாற்றியமைப்பது என்பது பெரிய திட்டங்களில் மட்டுமல்ல, எளிய தொடர்ச்சியான செயல்பாடுகளில்தான் உள்ளது. பொதுமக்கள் மேற்கொள்ளக்கூடிய அடிப்படை வழிகள்:'
                      : 'Transforming a neighbourhood doesn\'t require a master degree in urban planning. It requires consistent, small-scale interventions. Here are foundational steps any resident can take:'}
                  </p>

                  <ul className="list-disc space-y-3 pl-5 text-[1.05rem] leading-8 text-[#333]">
                    {language === 'ta' ? (
                      <>
                        <li>
                          <span className="font-semibold">தூய்மைப் பொறுப்பு:</span> உங்கள் வீட்டின் முன்புள்ள 50 மீட்டர் பகுதியை குப்பையின்றி பராமரிப்போம்.
                        </li>
                        <li>
                          <span className="font-semibold">உடனடி புகார்:</span> பழுதடைந்த தெருவிளக்குகள், அடைபட்ட வடிகால்களை இணையதளம் மூலம் உடனடியாக தெரிவிப்போம்.
                        </li>
                        <li>
                          <span className="font-semibold">மரக்கன்றுகள் நடுதல்:</span> உள்ளூர் சூழலுக்கு ஏற்ற மரக்கன்றுகளை நட்டு வளர்ப்போம்.
                        </li>
                        <li>
                          <span className="font-semibold">சமூக தூய்மை பணி:</span> அண்டை வீட்டாருடன் இணைந்து சிறிய அளவிலான தூய்மை பணிகளை முன்னெடுப்போம்.
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <span className="font-semibold">Adopt a block:</span> Commit to keeping a specific 50-metre stretch of sidewalk free of debris.
                        </li>
                        <li>
                          <span className="font-semibold">Report promptly:</span> Utilize city apps or hotlines to report broken streetlights, overflowing bins, or graffiti immediately.
                        </li>
                        <li>
                          <span className="font-semibold">Plant native species:</span> If you have a front garden or balcony, focus on plants that support local pollinators rather than resource-heavy lawns.
                        </li>
                        <li>
                          <span className="font-semibold">Organize micro-cleanups:</span> Gather two or three neighbours for a 30-minute targeted effort in a local park or alleyway.
                        </li>
                      </>
                    )}
                  </ul>

                  <p>
                    {language === 'ta'
                      ? 'முடிவாக, தூய்மையான மற்றும் பாதுகாப்பான பகுதியை உருவாக்குவது நம் அனைவரின் கூட்டு முயற்சியாகும்.'
                      : 'Ultimately, the transition toward cleaner, more resilient communities is a collaborative endeavour. It is built on the premise that every resident is an active participant in shaping the urban landscape, rather than a passive consumer of it.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6 text-base sm:text-[1.05rem] leading-7 sm:leading-8 text-[#333]">
                  <p className="text-base sm:text-lg leading-7 sm:leading-8 text-[#555]">{excerpt}</p>
                  <p>{content}</p>
                  <p>
                    {t('events_welcome_notice')}
                  </p>
                  <p>
                    {t('events_update_notice')}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:pt-1">
              <div className="border-y border-[#e5e5e5] py-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#666]">{t('events_sidebar_title', 'Events')}</p>
                <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[#9a9a9a]">
                  {t('daily_mla_programme', 'Daily MLA Programme')}
                </p>
              </div>

              <div className="divide-y divide-[#e8e8e8]">
                {communityEvents.map((ev) => {
                  const evName = language === 'ta' && ev.name_ta ? ev.name_ta : ev.name;
                  const evLoc = language === 'ta' && ev.location_ta ? ev.location_ta : ev.location;

                  return (
                    <Link
                      key={ev.id}
                      to={`/events/${ev.slug}`}
                      className={`block py-2.5 transition hover:opacity-80 ${ev.slug === slug ? 'opacity-60' : ''
                        }`}
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9a9a9a]">
                        {ev.date}
                      </p>
                      <h3 className="mt-0.5 text-[15px] font-bold leading-snug text-[#111]">
                        {evName}
                      </h3>
                      <p className="mt-0.5 text-sm leading-snug text-[#777]">{evLoc}</p>
                    </Link>
                  );
                })}
              </div>
            </aside>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default EventDetail;
