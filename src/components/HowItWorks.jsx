import { FileSignature, MapPin, Users, BellRing, ArrowDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    {
      step: '01',
      title: t('step_1_title', 'Register Complaint'),
      desc: t('step_1_desc', 'Tell us about the issue by filling out a simple form online.'),
      icon: FileSignature,
      bg: 'bg-primary text-white',
    },
    {
      step: '02',
      title: t('step_2_title', 'We Receive It'),
      desc: t('step_2_desc', 'Your request is instantly sent to the correct department.'),
      icon: MapPin,
      bg: 'bg-secondary text-primary',
    },
    {
      step: '03',
      title: t('step_3_title', 'We Take Action'),
      desc: t('step_3_desc', 'Our ground staff verifies and resolves the problem.'),
      icon: Users,
      bg: 'bg-primary text-white',
    },
    {
      step: '04',
      title: t('step_4_title', 'You Get Updates'),
      desc: t('step_4_desc', 'Track progress live until your issue is fully solved.'),
      icon: BellRing,
      bg: 'bg-secondary text-primary',
    },
  ];

  return (
    <div className="py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex justify-center mb-16">
          <h2 className="text-primary font-extrabold tracking-wide px-4 text-sm md:text-lg text-center uppercase">
            {t('how_it_works_title', 'How It Works')}
          </h2>
        </div>

        {/* Steps Container */}
        <div className="flex flex-col lg:flex-row relative">

          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[48px] left-[12%] right-[12%] h-1 bg-gray-100 rounded-full z-0">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 opacity-30 rounded-full w-full"></div>
          </div>

          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex-1 px-2 md:px-4 text-center relative z-10 flex flex-col items-center mb-12 lg:mb-0 group">

                {/* Icon Container */}
                <div className="w-24 h-24 bg-white rounded-full p-2 shadow-lg mb-6 relative cursor-pointer group-hover:-translate-y-3 transition-transform duration-300">
                  <div className={`w-full h-full rounded-full ${item.bg} flex items-center justify-center text-white relative overflow-hidden`}>
                    <Icon size={32} strokeWidth={1.5} className="relative z-10" />

                    {/* Faint Watermark Number inside circle */}
                    <span className="absolute -bottom-2 -right-1 text-[65px] font-black text-white/20 leading-none z-0 select-none">
                      {item.step}
                    </span>
                  </div>

                  {/* Step Badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center border-[3px] border-white text-xs shadow-md">
                    {index + 1}
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-bold text-gray-800 text-base md:text-lg mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed max-w-[220px] mx-auto">
                  {item.desc}
                </p>

                {/* Mobile Connector Arrow */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden mt-8 text-gray-300">
                    <ArrowDown size={24} className="text-gray-300" />
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default HowItWorks;
