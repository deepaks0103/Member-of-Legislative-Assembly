import { Link } from 'react-router-dom';
import { communityEvents } from '../data/events';
import { useLanguage } from '../context/LanguageContext';

const Categories = () => {
  const { language, t } = useLanguage();

  return (
    <section className="py-6 sm:py-10 md:py-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="text-center mb-5 sm:mb-8">
          <p className="text-primary font-bold uppercase tracking-widest text-[10px] sm:text-xs">
            {t('daily_mla_programme', 'Daily MLA programme')}
          </p>
          <h2 className="mt-1 font-sans text-xl sm:text-2xl md:text-3xl font-extrabold text-primary">
            {t('latest_events', 'Latest events')}
          </h2>
        </div>

        <div className="blog-carousel overflow-x-auto scrollbar-none py-2 touch-pan-x">
          <div className="blog-marquee flex w-max gap-3 sm:gap-5">
            {[...communityEvents, ...communityEvents].map((event, index) => {
              const eventName = language === 'ta' && event.name_ta ? event.name_ta : event.name;
              const eventLocation = language === 'ta' && event.location_ta ? event.location_ta : event.location;

              return (
                <Link
                  key={`${event.slug}-${index}`}
                  to={`/events/${event.slug}`}
                  className="group flex w-[210px] sm:w-56 md:w-60 shrink-0 flex-col overflow-hidden rounded-2xl border border-yellow-200 bg-[#fffbea] shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  aria-label={`${t('view_event', 'View')} ${eventName}`}
                >
                  <img
                    src={event.image}
                    alt=""
                    className="w-[calc(100%-0.75rem)] h-24 sm:h-28 md:h-32 mx-1.5 mt-1.5 rounded-xl object-cover"
                  />
                  <div className="p-2 sm:p-3">
                    <p className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide text-primary/70">
                      {event.date}
                    </p>
                    <h3 className="mt-0.5 font-sans text-xs sm:text-sm md:text-base font-bold text-primary leading-snug line-clamp-2">
                      {eventName}
                    </h3>
                    <p className="mt-1 text-[11px] sm:text-xs text-primary/70 line-clamp-1">
                      {eventLocation}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
