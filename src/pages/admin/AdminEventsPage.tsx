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
  Images,
  LayoutGrid,
  Table as TableIcon,
  Star,
  Upload,
} from 'lucide-react';
import { SEO } from '../../components/SEO';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { SearchFilterBar } from '../../components/admin/SearchFilterBar';
import { EmptyState } from '../../components/admin/EmptyState';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { ConfirmModal } from '../../components/admin/ConfirmModal';
import { Toast, ToastMessage } from '../../components/admin/Toast';
import { GitHubSyncBar } from '../../components/admin/GitHubSyncBar';
import { GitHubSyncModal } from '../../components/admin/GitHubSyncModal';
import { EventCard } from '../../components/EventCard';
import { EventDetailModal } from '../../components/EventDetailModal';
import { eventService } from '../../services/eventService';
import { activityService } from '../../services/activityService';
import { githubSyncService } from '../../services/githubSyncService';
import { AdminEvent, ContentStatus } from '../../types/admin';

export const AdminEventsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Modals & Selection
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AdminEvent | null>(null);
  const [viewingEvent, setViewingEvent] = useState<AdminEvent | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<AdminEvent | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isReadingPhotos, setIsReadingPhotos] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // GitHub Auto-Deploy / Sync State
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Form State (supporting up to 5 pictures)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    eventDate: '',
    eventTime: '',
    location: '',
    coverImageUrl: '',
    images: [] as string[],
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
      images: [],
      registrationUrl: '',
      status: 'Published',
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEdit = (event: AdminEvent) => {
    setEditingEvent(event);
    const eventPhotos = Array.isArray(event.images) && event.images.length > 0
      ? event.images
      : (event.coverImageUrl ? [event.coverImageUrl] : []);

    setFormData({
      title: event.title,
      slug: event.slug,
      description: event.description,
      eventDate: event.eventDate,
      eventTime: event.eventTime || '',
      location: event.location,
      coverImageUrl: event.coverImageUrl || eventPhotos[0] || '',
      images: [...eventPhotos],
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

  // Handle multiple pictures upload (up to 5 photos)
  const handleMultipleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const availableSlots = 5 - formData.images.length;
    if (availableSlots <= 0) {
      setToast({
        id: String(Date.now()),
        type: 'error',
        text: 'A maximum of 5 pictures can be uploaded per event.',
      });
      return;
    }

    const filesToRead = files.slice(0, availableSlots);
    setIsReadingPhotos(true);

    const readers = filesToRead.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers)
      .then((newBase64Images) => {
        setFormData((prev) => {
          const updated = [...prev.images, ...newBase64Images].slice(0, 5);
          return {
            ...prev,
            images: updated,
            coverImageUrl: updated[0] || '',
          };
        });
        setToast({
          id: String(Date.now()),
          type: 'info',
          text: `Added ${newBase64Images.length} photo(s). Total: ${
            formData.images.length + newBase64Images.length
          } / 5`,
        });
      })
      .catch(() => {
        setToast({
          id: String(Date.now()),
          type: 'error',
          text: 'Failed to read image file(s).',
        });
      })
      .finally(() => {
        setIsReadingPhotos(false);
      });
  };

  const handleRemovePhoto = (indexToRemove: number) => {
    setFormData((prev) => {
      const filtered = prev.images.filter((_, i) => i !== indexToRemove);
      return {
        ...prev,
        images: filtered,
        coverImageUrl: filtered[0] || '',
      };
    });
  };

  const handleMakeCoverPhoto = (index: number) => {
    if (index === 0) return;
    setFormData((prev) => {
      const selected = prev.images[index];
      const rest = prev.images.filter((_, i) => i !== index);
      const reordered = [selected, ...rest];
      return {
        ...prev,
        images: reordered,
        coverImageUrl: selected,
      };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    const isGithubConnected = githubSyncService.isConfigured();
    const photoCount = formData.images.length;

    try {
      if (editingEvent) {
        await eventService.updateEvent(editingEvent.id, formData);
        await activityService.logActivity('updated', 'Event', formData.title);
        setToast({
          id: String(Date.now()),
          type: 'success',
          text: isGithubConnected
            ? `Updated "${formData.title}" & synced ${photoCount} picture(s) to GitHub! Cloudflare Pages will rebuild.`
            : `Updated "${formData.title}". Connect GitHub in the bar above to auto-deploy to live site.`,
        });
      } else {
        await eventService.createEvent(formData);
        await activityService.logActivity('created', 'Event', formData.title);
        setToast({
          id: String(Date.now()),
          type: 'success',
          text: isGithubConnected
            ? `Created "${formData.title}" & synced ${photoCount} picture(s) to GitHub! Cloudflare Pages will rebuild.`
            : `Created "${formData.title}". Connect GitHub in the bar above to auto-deploy to live site.`,
        });
      }
      setIsFormOpen(false);
      loadEvents();
    } catch {
      setToast({ id: String(Date.now()), type: 'error', text: 'Failed to save event.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleManualSync = async () => {
    if (!githubSyncService.isConfigured()) {
      setIsSyncModalOpen(true);
      return;
    }
    setIsSyncing(true);
    try {
      const res = await eventService.syncToGithub();
      if (res.success) {
        setToast({
          id: String(Date.now()),
          type: 'success',
          text: `Successfully synced ${res.deployedCount} events and all photos to GitHub! Cloudflare Pages build triggered.`,
        });
        loadEvents();
      } else {
        setToast({
          id: String(Date.now()),
          type: 'error',
          text: `GitHub sync error: ${res.error}`,
        });
      }
    } catch (err: any) {
      setToast({
        id: String(Date.now()),
        type: 'error',
        text: err?.message || 'Failed to sync with GitHub.',
      });
    } finally {
      setIsSyncing(false);
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
        text: `Marked "${event.title}" as ${nextStatus}. Changes synced to GitHub!`,
      });
      loadEvents();
      // If modal is open for this event, update viewingEvent
      if (viewingEvent && viewingEvent.id === event.id) {
        setViewingEvent({ ...viewingEvent, status: nextStatus });
      }
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
      setToast({ id: String(Date.now()), type: 'success', text: `Deleted "${deletingEvent.title}". Synced to GitHub!` });
      setDeletingEvent(null);
      if (viewingEvent && viewingEvent.id === deletingEvent.id) {
        setViewingEvent(null);
      }
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
        description="Schedule and coordinate community workshops, seminars, and volunteer gatherings with up to 5 photos per event."
        primaryAction={{
          label: 'Create Event',
          onClick: handleOpenCreate,
          icon: Plus,
        }}
      />

      {/* GitHub Auto-Deploy / Cloudflare Sync Bar */}
      <GitHubSyncBar
        resourceName="Events"
        folderPath="public/assets/events/"
        isSyncing={isSyncing}
        onSync={handleManualSync}
        onOpenSettings={() => setIsSyncModalOpen(true)}
      />

      {/* Search, Filter & View Toggle Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex-1">
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
        </div>

        {/* View Switcher: Cards vs Table */}
        <div className="flex items-center gap-1 p-1 bg-white border border-slate-200/80 rounded-2xl shadow-2xs self-start md:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-[#1D70B8] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-[#1D70B8] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>

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
      ) : viewMode === 'cards' ? (
        /* Visual Card Grid (Matches Team Page Style) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              isAdmin={true}
              onViewDetails={(e) => setViewingEvent(e)}
              onEdit={(e) => handleOpenEdit(e)}
              onToggleStatus={(e) => handleTogglePublish(e)}
              onDelete={(e) => setDeletingEvent(e)}
            />
          ))}
        </div>
      ) : (
        /* Structured Table View */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Event</th>
                  <th className="py-3.5 px-4">Schedule</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Location</th>
                  <th className="py-3.5 px-4 text-center">Photos</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEvents.map((evt) => {
                  const photosCount = Array.isArray(evt.images) && evt.images.length > 0
                    ? evt.images.length
                    : evt.coverImageUrl
                    ? 1
                    : 0;

                  return (
                    <tr
                      key={evt.id}
                      onClick={() => setViewingEvent(evt)}
                      className="hover:bg-slate-50/60 transition-colors cursor-pointer"
                    >
                      {/* Cover & Title */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-11 rounded-xl bg-slate-100 border border-slate-200/70 overflow-hidden flex items-center justify-center flex-shrink-0">
                            {evt.coverImageUrl ? (
                              <img src={evt.coverImageUrl} alt={evt.title} className="w-full h-full object-cover" />
                            ) : (
                              <Calendar className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <span className="font-medium text-slate-900 block hover:text-[#1D70B8] transition-colors">
                              {evt.title}
                            </span>
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

                      {/* Photos Count */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium font-mono">
                          <Images className="w-3 h-3" />
                          <span>{photosCount} / 5</span>
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <StatusBadge status={evt.status} />
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setViewingEvent(evt)}
                            title="View Full Details & Photos"
                            className="p-1.5 text-slate-500 hover:text-[#1D70B8] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleTogglePublish(evt)}
                            title={evt.status === 'Published' ? 'Unpublish to Draft' : 'Publish'}
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                          >
                            {evt.status === 'Published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-emerald-600" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(evt)}
                            title="Edit Event"
                            className="p-1.5 text-slate-500 hover:text-[#1D70B8] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingEvent(evt)}
                            title="Delete Event"
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Full Event Details Modal (Shows all details and up to 5 photos gallery) */}
      <EventDetailModal
        event={viewingEvent}
        isOpen={viewingEvent !== null}
        onClose={() => setViewingEvent(null)}
        isAdmin={true}
        onEdit={(e) => handleOpenEdit(e)}
        onToggleStatus={(e) => handleTogglePublish(e)}
        onDelete={(e) => setDeletingEvent(e)}
      />

      {/* Add / Edit Form Modal (Supports up to 5 pictures) */}
      {isFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-lg font-medium text-slate-900 tracking-tight">
                  {editingEvent ? 'Edit Event' : 'Create Event'}
                </h3>
                <p className="text-xs text-slate-400 font-light">
                  Specify event agenda, scheduling, and upload up to 5 gallery pictures.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* Event Title */}
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

              {/* Slug & Publication Status */}
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

              {/* Date & Time */}
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

              {/* Location */}
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

              {/* Description / Agenda */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Description / Agenda
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of objectives, keynote topics, speakers, and schedule..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D70B8] resize-none"
                />
              </div>

              {/* Registration URL */}
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

              {/* Multi-Photo Gallery Upload (Up to 5 pictures) */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Event Photos (Up to 5 Pictures)
                  </label>
                  <span className="text-xs font-mono text-slate-500">
                    {formData.images.length} / 5 selected
                  </span>
                </div>

                {/* Upload Button & Selector */}
                {formData.images.length < 5 && (
                  <div className="p-4 mb-3 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#1D70B8] bg-slate-50/50 hover:bg-blue-50/30 transition-colors text-center cursor-pointer relative">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleMultipleFilesChange}
                      disabled={isReadingPhotos}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center gap-1.5 pointer-events-none">
                      <Upload className="w-6 h-6 text-[#1D70B8]" />
                      <span className="text-xs font-semibold text-slate-700">
                        {isReadingPhotos ? 'Processing images...' : 'Click or Drag images to upload'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Supports PNG, JPG, WebP. First image is used as primary cover.
                      </span>
                    </div>
                  </div>
                )}

                {/* Photo Previews Strip */}
                {formData.images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {formData.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-square shadow-2xs"
                      >
                        <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />

                        {/* Cover Badge for First Image */}
                        {idx === 0 ? (
                          <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold tracking-wider uppercase shadow-xs flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-current" />
                            Cover
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleMakeCoverPhoto(idx)}
                            title="Make this the Cover image"
                            className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-black/60 hover:bg-[#1D70B8] text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            Set Cover
                          </button>
                        )}

                        {/* Remove Photo Button */}
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          title="Remove this photo"
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 shadow-xs cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        <div className="absolute bottom-1 right-1.5 text-[10px] font-mono text-white/90 bg-black/50 px-1.5 py-0.2 rounded">
                          #{idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-3 text-xs text-slate-400 font-mono">
                    No pictures uploaded yet.
                  </div>
                )}
              </div>

              {/* Modal Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  disabled={isSaving}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isReadingPhotos}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all shadow-xs cursor-pointer disabled:opacity-60"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {isSaving
                      ? 'Saving & Syncing...'
                      : isReadingPhotos
                      ? 'Reading photos...'
                      : editingEvent
                      ? 'Update Event'
                      : 'Save Event'}
                  </span>
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
        message={`Are you sure you want to delete "${deletingEvent?.title}"? This will remove the event record and sync with GitHub.`}
        confirmLabel="Delete Event"
        isLoading={isSaving}
        onConfirm={handleDelete}
        onCancel={() => setDeletingEvent(null)}
      />

      {/* GitHub Sync Modal */}
      <GitHubSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onSaved={() => {
          setToast({
            id: String(Date.now()),
            type: 'success',
            text: 'GitHub Auto-Deploy settings saved successfully!',
          });
        }}
      />
    </div>
  );
};
