import { ShieldAlert, HeartPulse, Flame, PhoneCall, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const QuickActions = () => {
  const { t } = useLanguage();

  const helplines = [
    { key: 'police', title: t('police', 'Police'), number: '100', icon: ShieldAlert, color: 'text-blue-600', bg: 'bg-blue-100', hover: 'hover:bg-blue-50 hover:border-blue-200' },
    { key: 'ambulance', title: t('ambulance', 'Ambulance'), number: '108', icon: HeartPulse, color: 'text-emerald-600', bg: 'bg-emerald-100', hover: 'hover:bg-emerald-50 hover:border-emerald-200' },
    { key: 'fire_rescue', title: t('fire_rescue', 'Fire & Rescue'), number: '101', icon: Flame, color: 'text-red-600', bg: 'bg-red-100', hover: 'hover:bg-red-50 hover:border-red-200' },
    { key: 'women_helpline', title: t('women_helpline', 'Women Helpline'), number: '1091', icon: PhoneCall, color: 'text-purple-600', bg: 'bg-purple-100', hover: 'hover:bg-purple-50 hover:border-purple-200' },
  ];

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-[2rem] p-6 md:p-10 lg:p-12 border border-red-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-10">
          
          {/* Left: Call to Action Text */}
          <div className="text-center lg:text-left lg:max-w-sm">
            <div className="inline-flex items-center space-x-2 bg-red-100 text-red-600 px-4 py-1.5 rounded-full mb-5">
               <AlertCircle size={16} strokeWidth={2.5} /> 
               <span className="text-xs font-extrabold uppercase tracking-widest">{t('emergency_only', 'Emergency Only')}</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mb-3 leading-tight">
              {t('need_immediate_assistance', 'Need Immediate Assistance?')}
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              {t('helpline_desc', 'Direct helplines for the citizens of Kallakurichi. Available 24/7.')}
            </p>
          </div>

          {/* Right: Helpline Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 w-full lg:w-auto flex-1 max-w-2xl">
            {helplines.map((item, index) => {
              const Icon = item.icon;
              return (
                <a 
                  href={`tel:${item.number}`}
                  key={index} 
                  className={`bg-white border border-gray-100 rounded-2xl p-4 flex items-center space-x-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer ${item.hover} group`}
                >
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full ${item.bg} ${item.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={24} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs text-gray-500 font-extrabold uppercase tracking-wider mb-0.5">
                      {item.title}
                    </p>
                    <h3 className="text-xl md:text-2xl font-black text-gray-800 group-hover:text-red-600 transition-colors">
                      {item.number}
                    </h3>
                  </div>
                </a>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};

export default QuickActions;
