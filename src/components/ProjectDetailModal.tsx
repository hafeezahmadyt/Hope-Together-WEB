import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  DollarSign,
  Users,
  Target,
  Handshake,
} from 'lucide-react';
import { AdminProject } from '../types/admin';
import { StatusBadge } from './admin/StatusBadge';

interface ProjectDetailModalProps {
  project: AdminProject | null;
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
  onEdit?: (project: AdminProject) => void;
  onToggleStatus?: (project: AdminProject) => void;
  onDelete?: (project: AdminProject) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  isAdmin = false,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  if (!isOpen || !project) return null;

  // Collect all photos (up to 5)
  const photos: string[] = Array.isArray(project.images) && project.images.length > 0
    ? project.images.slice(0, 5)
    : project.coverImageUrl
    ? [project.coverImageUrl]
    : [];

  const currentPhoto = photos[activePhotoIdx] || photos[0];

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActivePhotoIdx((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 text-[#1D70B8] border border-blue-200/60 uppercase tracking-wider">
              {project.objective}
            </span>
            <StatusBadge status={project.status} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Gallery Showcase (Up to 5 pictures) */}
          {photos.length > 0 ? (
            <div className="space-y-3">
              {/* Main Active Photo */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-200/80 shadow-inner group">
                <img
                  src={currentPhoto}
                  alt={`${project.title} - photo ${activePhotoIdx + 1}`}
                  className="w-full h-full object-cover transition-all duration-300"
                />

                {/* Photo Counter Pill */}
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-medium tracking-wide">
                  {activePhotoIdx + 1} / {photos.length}
                </div>

                {/* Left/Right Arrows if more than 1 photo */}
                {photos.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={handlePrevPhoto}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
                      aria-label="Previous photo"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextPhoto}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
                      aria-label="Next photo"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails Strip (Up to 5) */}
              {photos.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {photos.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActivePhotoIdx(i)}
                      className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                        activePhotoIdx === i
                          ? 'border-[#1D70B8] ring-2 ring-[#1D70B8]/20 scale-102'
                          : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                      {i === 0 && (
                        <span className="absolute bottom-0 inset-x-0 bg-slate-900/80 text-white text-[9px] font-semibold text-center py-0.5">
                          Cover
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-[16/9] w-full rounded-2xl bg-slate-100 border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
              <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
              <span className="text-xs font-mono">No photos uploaded for this project</span>
            </div>
          )}

          {/* Project Title */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-medium text-slate-900 tracking-tight leading-snug">
              {project.title}
            </h2>
            <span className="text-xs text-slate-400 font-mono mt-1 block">/{project.slug}</span>
          </div>

          {/* Core Impact & Funding Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Funding Received Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-emerald-100/40 border border-emerald-200/70 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-emerald-800 font-bold block">
                  Full Funding Received
                </span>
                <span className="text-base sm:text-lg font-bold text-emerald-950 font-mono">
                  {project.fundingReceived || 'Community Funded / Grants'}
                </span>
              </div>
            </div>

            {/* Direct Beneficiaries Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/80 to-blue-100/40 border border-blue-200/70 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#1D70B8] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-blue-800 font-bold block">
                  People Benefited
                </span>
                <span className="text-base sm:text-lg font-bold text-slate-900 font-mono">
                  {project.beneficiariesCount || 'Communities Across KP'}
                </span>
              </div>
            </div>
          </div>

          {/* Secondary Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3 text-slate-700">
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-500">
                <MapPin className="w-4 h-4 text-slate-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Location / District</span>
                <span className="text-xs sm:text-sm font-medium text-slate-900">{project.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-700">
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-500">
                <Calendar className="w-4 h-4 text-slate-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Timeline / Duration</span>
                <span className="text-xs sm:text-sm font-medium text-slate-900 font-mono">
                  {project.startDate} {project.endDate ? `to ${project.endDate}` : '(Ongoing)'}
                </span>
              </div>
            </div>

            {project.donorOrPartner && (
              <div className="flex items-center gap-3 text-slate-700 sm:col-span-2 pt-2 border-t border-slate-200/60">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
                  <Handshake className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Partner / Supporting Donor</span>
                  <span className="text-xs sm:text-sm font-medium text-slate-900">{project.donorOrPartner}</span>
                </div>
              </div>
            )}
          </div>

          {/* Project Description & Scope */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#1D70B8]" />
              <h4 className="text-xs uppercase tracking-wider text-slate-600 font-bold">
                Project Overview & Community Scope
              </h4>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap font-light shadow-2xs">
              {project.description || 'No detailed overview provided for this project.'}
            </div>
          </div>
        </div>

        {/* Footer Actions (Admin Actions or Close) */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          {isAdmin ? (
            <div className="flex items-center gap-2">
              {onToggleStatus && (
                <button
                  type="button"
                  onClick={() => onToggleStatus(project)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-white transition-colors cursor-pointer"
                >
                  {project.status === 'Published' ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-amber-600" />
                      <span>Unpublish to Draft</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Publish Project</span>
                    </>
                  )}
                </button>
              )}
              {onEdit && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEdit(project);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-[#1D70B8] border border-blue-200/60 text-xs font-semibold hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Project</span>
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onDelete(project);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200/60 text-xs font-semibold hover:bg-red-100 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
