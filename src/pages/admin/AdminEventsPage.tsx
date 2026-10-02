import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Clock,
  Check,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';
import { SEO } from '../../components/SEO';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { SearchFilterBar } from '../../components/admin/SearchFilterBar';
import { EmptyState } from '../../components/admin/EmptyState';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { ConfirmModal } from '../../components/admin/ConfirmModal';
import { Toast, ToastMessage } from '../../components/admin/Toast';
import { eventService } from '../../services/eventService';
import { activityService } from '../../services/activityService';
import { AdminEvent, ContentStatus } from '../../types/admin';

export const AdminEventsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<AdminEvent | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    eventDate: '',
    eventTime: '',
    location: '',
    coverImageUrl: '',
    registrationUrl: '',
    status: 'Published' as ContentStatus,
  });
  const [formErrors, setFormErrors] = useState<{ title?: string; eventDate?: string }>({});

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      const data = await eventService.getEvents();
      setEvents(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      handleOpenCreate();
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: !editingEvent ? slugify(val) : prev.slug,
    }));
  };

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      slug: '',
      description: '',
      eventDate: new Date().toISOString().split('T')[0],
      eventTime: '10:00 AM - 01:00 PM',
      location: 'Khyber Pakhtunkhwa',
      coverImageUrl: '',
      registrationUrl: '',
      status: 'Published',
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEdit = (event: AdminEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      slug: event.slug,
      description: event.description,
      eventDate: event.eventDate,
      eventTime: event.eventTime || '',
      location: event.location,
      coverImageUrl: event.coverImageUrl || '',
      registrationUrl: event.registrationUrl || '',
      status: event.status,
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const validateForm = () => {
    const errors: { title?: string; eventDate?: string } = {};
    if (!formData.title.trim()) errors.title = 'Event title is required.';
    if (!formData.eventDate) errors.eventDate = 'Event date is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      if (editingEvent) {
        await eventService.updateEvent(editingEvent.id, formData);
        await activityService.logActivity('updated', 'Event', formData.title);
        setToast({ id: String(Date.now()), type: 'success', text: `Updated "${formData.title}".` });
      } else {
        await eventService.createEvent(formData);
        await activityService.logActivity('created', 'Event', formData.title);
        setToast({ id: String(Date.now()), type: 'success', text: `Created "${formData.title}".` });
      }
      setIsFormOpen(false);
      loadEvents();
    } catch {
      setToast({ id: String(Date.now()), type: 'error', text: 'Failed to save event.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async (event: AdminEvent) => {
    const nextStatus: ContentStatus = event.status === 'Published' ? 'Draft' : 'Published';
    try {
      await eventService.updateEvent(event.id, { status: nextStatus });
      await activityService.logActivity(nextStatus === 'Published' ? 'published' : 'unpublished', 'Event', event.title);
      setToast({
        id: String(Date.now()),
        type: 'info',
        text: `Marked "${event.title}" as ${nextStatus}.`,
      });
      loadEvents();
    } catch {
      setToast({ id: String(Date.now()), type: 'error', text: 'Status update failed.' });
    }
  };

  const handleDelete = async () => {
    if (!deletingEvent) return;
    setIsSaving(true);
    try {
      await eventService.deleteEvent(deletingEvent.id);
      await activityService.logActivity('deleted', 'Event', deletingEvent.title);
      setToast({ id: String(Date.now()), type: 'success', text: `Deleted "${deletingEvent.title}".` });
      setDeletingEvent(null);
      loadEvents();
    } catch {
      setToast({ id: String(Date.now()), type: 'error', text: 'Failed to delete event.' });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <SEO title="Events Management | Hope Together Admin" />
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      <AdminPageHeader
        title="Community Events"
        description="Schedule and coordinate community workshops, seminars, and volunteer gatherings."
        primaryAction={{
          label: 'Create Event',
          onClick: handleOpenCreate,
          icon: Plus,
        }}
      />

      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search event title or location..."
        filterOptions={[
          { label: 'All Statuses', value: 'All' },
          { label: 'Published', value: 'Published' },
          { label: 'Draft', value: 'Draft' },
          { label: 'Completed', value: 'Completed' },
          { label: 'Archived', value: 'Archived' },
        ]}
        selectedFilter={statusFilter}
        onFilterChange={setStatusFilter}
        totalResults={filteredEvents.length}
        itemLabel="events"
      />

      {isLoading ? (
        <div className="py-20 text-center text-slate-400 font-mono text-xs">
          Loading events...
        </div>
      ) : filteredEvents.length === 0 ? (
        <EmptyState
          title="No events found"
          description={
            searchQuery || statusFilter !== 'All'
              ? 'Try modifying your search or status filter.'
              : 'Create your first community event or workshop.'
          }
          icon={Calendar}
          action={{
            label: 'Create Event',
            onClick: handleOpenCreate,
          }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Event</th>
                  <th className="py-3.5 px-4">Schedule</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Location</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Cover & Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-xl bg-slate-100 border border-slate-200/70 overflow-hidden flex items-center justify-center flex-shrink-0">
                          {evt.coverImageUrl ? (
                            <img src={evt.coverImageUrl} alt={evt.title} className="w-full h-full object-cover" />
                          ) : (
                            <Calendar className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <span className="font-medium text-slate-900 block">{evt.title}</span>
                          <span className="text-[11px] text-slate-400 font-mono block">/{evt.slug}</span>
                        </div>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="text-slate-800 font-medium font-mono text-xs">{evt.eventDate}</span>
                        {evt.eventTime && (
                          <span className="text-slate-400 text-[11px] flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {evt.eventTime}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <span className="text-slate-600 text-xs flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        {evt.location}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={evt.status} />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(evt)}
                          title={evt.status === 'Published' ? 'Unpublish to Draft' : 'Publish'}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        >
                          {evt.status === 'Published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(evt)}
                          className="p-1.5 text-slate-500 hover:text-[#1D70B8] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingEvent(evt)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-slate-900 tracking-tight">
                  {editingEvent ? 'Edit Event' : 'Create Event'}
                </h3>
                <p className="text-xs text-slate-400 font-light">
                  Specify event agenda, scheduling, and registration link.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Event Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Community Dialogue Workshop"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#1D70B8] ${
                    formErrors.title ? 'border-red-400 bg-red-50/20' : 'border-slate-200 bg-slate-50/40'
                  }`}
                />
                {formErrors.title && (
                  <span className="text-xs text-red-500 mt-1 block">{formErrors.title}</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                    placeholder="event-slug-name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/40 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Publication Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ContentStatus })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/40 text-sm"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                    <option value="Completed">Completed</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                      formErrors.eventDate ? 'border-red-400 bg-red-50/20' : 'border-slate-200 bg-slate-50/40'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Time / Duration
                  </label>
                  <input
                    type="text"
                    value={formData.eventTime}
                    onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                    placeholder="e.g. 10:00 AM - 02:00 PM"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/40 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Location / Venue
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Regional Community Hall, Peshawar, KP"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/40 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Description / Agenda
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of objectives, speakers, and schedule..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D70B8] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Registration URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.registrationUrl}
                  onChange={(e) => setFormData({ ...formData, registrationUrl: e.target.value })}
                  placeholder="https://example.org/register"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/40 text-sm"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  disabled={isSaving}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all shadow-xs cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : editingEvent ? 'Update Event' : 'Save Event'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deletingEvent !== null}
        title="Delete Event?"
        message={`Are you sure you want to delete "${deletingEvent?.title}"? This action will remove the event record.`}
        confirmLabel="Delete Event"
        isLoading={isSaving}
        onConfirm={handleDelete}
        onCancel={() => setDeletingEvent(null)}
      />
    </div>
  );
};
