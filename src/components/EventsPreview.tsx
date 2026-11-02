import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { eventService } from '../services/eventService';
import { AdminEvent } from '../types/admin';
import { EventDetailModal } from './EventDetailModal';

export const EventsPreview: React.FC = () => {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<AdminEvent | null>(null);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const all = await eventService.getEvents();
        if (isMounted) {
          setEvents(all.filter((e) => e.status === 'Published' || e.status === 'Completed').slice(0, 3));
        }
      } catch {}
    };
    load();

    const handleUpdate = () => load();
    window.addEventListener('hope_together_events_changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('hope_together_events_changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  if (events.length === 0) return null;

  return (
    <section className="py-20 bg-white border-t border-slate-200/60">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-200/70">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-[#1D70B8]" />
              <span className="text-xs uppercase tracking-[0.25em] text-slate-400 font-semibold">
                Community Action
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight">
              Latest Events & Workshops
            </h2>
          </div>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#1D70B8] hover:text-blue-700 transition-colors group"
          >
            <span>Explore All Events</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => {
            const cover = evt.coverImageUrl || (evt.images && evt.images[0]) || '';
            const photosCount = evt.images ? evt.images.length : 1;

            return (
              <motion.div
                key={evt.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                onClick={() => setSelectedEvent(evt)}
                className="group bg-white rounded-3xl border border-slate-200/80 hover:border-slate-300 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    {cover ? (
                      <img
                        src={cover}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Calendar className="w-10 h-10 opacity-40" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 px-2.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/70 shadow-sm flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D70B8] leading-none">
                        Event
                      </span>
                      <span className="text-xs font-bold text-slate-900 leading-none mt-0.5 font-mono">
                        {evt.eventDate}
                      </span>
                    </div>
                    {photosCount > 1 && (
                      <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium">
                        📷 {photosCount} photos
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-medium text-slate-900 group-hover:text-[#1D70B8] transition-colors mb-2 line-clamp-1">
                      {evt.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{evt.location}</span>
                    </div>
                    {evt.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-light">
                        {evt.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#1D70B8]">
                  <span>View Details & Photos</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <EventDetailModal
        event={selectedEvent}
        isOpen={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
        isAdmin={false}
      />
    </section>
  );
};
