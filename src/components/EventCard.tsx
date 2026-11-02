import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Eye, EyeOff, Edit2, Trash2, Images } from 'lucide-react';
import { AdminEvent } from '../types/admin';
import { StatusBadge } from './admin/StatusBadge';

interface EventCardProps {
  event: AdminEvent;
  onViewDetails: (event: AdminEvent) => void;
  isAdmin?: boolean;
  onEdit?: (event: AdminEvent) => void;
  onToggleStatus?: (event: AdminEvent) => void;
  onDelete?: (event: AdminEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onViewDetails,
  isAdmin = false,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  const photos = Array.isArray(event.images) && event.images.length > 0
    ? event.images
    : event.coverImageUrl
    ? [event.coverImageUrl]
    : [];

  const initialCover = photos[0] || '';
  const [imgSrc, setImgSrc] = useState(initialCover);
  const [imgError, setImgError] = useState(false);

  React.useEffect(() => {
    setImgSrc(photos[0] || '');
    setImgError(false);
  }, [photos[0]]);

  // Format date readable (e.g. Nov 15, 2026)
  const formatDateBadge = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        const month = d.toLocaleDateString('en-US', { month: 'short' });
        const day = d.getDate();
        return { month, day };
      }
    } catch {}
    return { month: 'Event', day: '' };
  };

  const { month, day } = formatDateBadge(event.eventDate);

  return (
    <div
      onClick={() => onViewDetails(event)}
      className="group relative bg-white rounded-3xl border border-slate-200/80 hover:border-slate-300 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      <div>
        {/* Cover Image Container */}
        <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
          {imgSrc && !imgError ? (
            <img
              src={imgSrc}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => {
                if (imgSrc.endsWith('.jpg')) {
                  setImgSrc(imgSrc.replace(/\.jpg$/, '.png'));
                } else if (imgSrc.endsWith('.png')) {
                  setImgSrc(imgSrc.replace(/\.png$/, '.jpg'));
                } else {
                  setImgError(true);
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-gradient-to-br from-slate-100 to-slate-200">
              <Calendar className="w-10 h-10 mb-1 opacity-40 text-slate-500" />
              <span className="text-[11px] font-mono text-slate-400">[Event Cover]</span>
            </div>
          )}

          {/* Date Badge Top-Left */}
          <div className="absolute top-3 left-3 px-2.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/70 shadow-sm flex flex-col items-center justify-center text-center min-w-[42px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D70B8] leading-none">
              {month}
            </span>
            {day && (
              <span className="text-sm font-extrabold text-slate-900 leading-none mt-0.5 font-mono">
                {day}
              </span>
            )}
          </div>

          {/* Photo Count Indicator (if multiple photos) */}
          {photos.length > 1 && (
            <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/65 backdrop-blur-sm text-white text-[10px] font-medium flex items-center gap-1 shadow-sm">
              <Images className="w-3 h-3" />
              <span>{photos.length} photos</span>
            </div>
          )}

          {/* Status Badge Top-Right (admin or preview) */}
          {isAdmin && (
            <div className="absolute top-3 right-3 shadow-xs">
              <StatusBadge status={event.status} />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 pb-3">
          {/* Schedule Info */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-2">
            <span className="flex items-center gap-1 font-mono text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-[#1D70B8]" />
              {event.eventDate}
            </span>
            {event.eventTime && (
              <span className="flex items-center gap-1 text-slate-500">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                {event.eventTime}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-medium text-slate-900 tracking-tight leading-snug group-hover:text-[#1D70B8] transition-colors mb-2">
            {event.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>

          {/* Agenda Excerpt */}
          {event.description && (
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-light">
              {event.description}
            </p>
          )}
        </div>
      </div>

      {/* Card Footer / Actions */}
      <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-semibold text-[#1D70B8] group-hover:underline flex items-center gap-1">
          <span>View Details & Photos</span>
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </span>

        {/* Admin Quick Buttons */}
        {isAdmin && (
          <div
            className="flex items-center gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {onToggleStatus && (
              <button
                type="button"
                onClick={() => onToggleStatus(event)}
                title={event.status === 'Published' ? 'Unpublish to Draft' : 'Publish'}
                className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
              >
                {event.status === 'Published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(event)}
                title="Edit Event"
                className="p-1.5 text-slate-500 hover:text-[#1D70B8] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(event)}
                title="Delete Event"
                className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
