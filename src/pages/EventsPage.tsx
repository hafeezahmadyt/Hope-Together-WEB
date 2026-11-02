import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Sparkles } from 'lucide-react';
import { SEO } from '../components/SEO';
import { PageHero } from '../components/PageHero';
import { EventCard } from '../components/EventCard';
import { EventDetailModal } from '../components/EventDetailModal';
import { eventService } from '../services/eventService';
import { AdminEvent } from '../types/admin';
import { Link } from 'react-router-dom';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Upcoming' | 'Past'>('All');
  const [selectedEvent, setSelectedEvent] = useState<AdminEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadEvents = async () => {
      try {
        const all = await eventService.getEvents();
        if (isMounted) {
          // Public page displays Published and Completed events
          setEvents(all.filter((e) => e.status === 'Published' || e.status === 'Completed'));
        }
      } catch {
        // Fallback
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadEvents();

    const handleUpdate = () => {
      loadEvents();
    };

    window.addEventListener('hope_together_events_changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('hope_together_events_changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredEvents = events.filter((e) => {
    if (selectedFilter === 'Upcoming') {
      return e.eventDate >= todayStr;
    }
    if (selectedFilter === 'Past') {
      return e.eventDate < todayStr;
    }
    return true;
  });

  return (
    <>
      <SEO
        title="Community Events & Initiatives | Hope Together Organization"
        description="Explore upcoming workshops, civic dialogues, youth seminars, and community initiatives organized by Hope Together Organization in Khyber Pakhtunkhwa, Pakistan."
      />

      {/* Page Hero */}
      <PageHero
        badge="Community Action"
        title="Workshops & Gatherings"
        highlightedWord="Together"
        description="Connecting grassroots youth, women, and community leaders through interactive workshops, dialogues, and environmental actions across Khyber Pakhtunkhwa."
        accentColor="blue"
      />

      {/* Context Narrative */}
      <section className="py-14 bg-[#FAF9F6] border-b border-slate-200/60">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed">
            Our community sessions are designed to foster peer dialogue, practical skill building,
            and shared ownership of localized developmental solutions.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="py-16 sm:py-24 bg-white/60">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          {/* Header & Filter Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-4 border-b border-slate-200/70">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Calendar className="w-4 h-4 text-[#1D70B8]" />
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">
                  Schedule
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight">
                Scheduled Events
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl self-start sm:self-auto">
              {[
                { label: `All (${events.length})`, val: 'All' as const },
                {
                  label: `Upcoming (${events.filter((e) => e.eventDate >= todayStr).length})`,
                  val: 'Upcoming' as const,
                },
                {
                  label: `Past (${events.filter((e) => e.eventDate < todayStr).length})`,
                  val: 'Past' as const,
                },
              ].map((tab) => (
                <button
                  key={tab.val}
                  type="button"
                  onClick={() => setSelectedFilter(tab.val)}
                  className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedFilter === tab.val
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          {isLoading ? (
            <div className="py-24 text-center text-slate-400 font-mono text-xs">
              Loading community events...
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="py-20 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 p-8">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-800 mb-1">
                No {selectedFilter.toLowerCase()} events found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-light mb-6">
                {selectedFilter === 'Upcoming' && events.length > 0
                  ? 'There are currently no upcoming events scheduled. View all our past community achievements below!'
                  : 'Check back shortly or get in touch with our team to suggest or collaborate on an upcoming initiative.'}
              </p>
              <div className="flex items-center justify-center gap-3">
                {selectedFilter !== 'All' && (
                  <button
                    type="button"
                    onClick={() => setSelectedFilter('All')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1D70B8] text-white text-xs font-semibold hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
                  >
                    <span>View All Events ({events.length})</span>
                  </button>
                )}
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  <span>Contact Event Organizers</span>
                </Link>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredEvents.map((evt) => (
                <EventCard
                  key={evt.id}
                  event={evt}
                  isAdmin={false}
                  onViewDetails={(e) => setSelectedEvent(e)}
                />
              ))}
            </motion.div>
          )}

          {/* Bottom Community Collaboration Banner */}
          <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Partner with Us</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-medium tracking-tight">
                Want to Host a Community Workshop with Hope Together?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                We regularly co-organize educational sessions, legal awareness clinics, and youth dialogues with local universities, civil societies, and community elders.
              </p>
            </div>
            <Link
              to="/contact"
              className="px-6 py-3 rounded-2xl bg-white text-slate-900 text-xs sm:text-sm font-semibold hover:bg-slate-100 transition-colors shadow-md flex-shrink-0"
            >
              Propose an Event
            </Link>
          </div>
        </div>
      </div>

      {/* Public Event Detail Modal (Gallery + Full Agenda) */}
      <EventDetailModal
        event={selectedEvent}
        isOpen={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
        isAdmin={false}
      />
    </>
  );
};
