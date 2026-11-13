import React, { useState } from 'react';
import { Calendar, MapPin, Eye, EyeOff, Edit2, Trash2, Images, DollarSign, Users, FolderKanban } from 'lucide-react';
import { AdminProject } from '../types/admin';
import { StatusBadge } from './admin/StatusBadge';

interface ProjectCardProps {
  project: AdminProject;
  onViewDetails: (project: AdminProject) => void;
  isAdmin?: boolean;
  onEdit?: (project: AdminProject) => void;
  onToggleStatus?: (project: AdminProject) => void;
  onDelete?: (project: AdminProject) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onViewDetails,
  isAdmin = false,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  const photos = Array.isArray(project.images) && project.images.length > 0
    ? project.images
    : project.coverImageUrl
    ? [project.coverImageUrl]
    : [];

  const initialCover = photos[0] || '';
  const [imgSrc, setImgSrc] = useState(initialCover);
  const [imgError, setImgError] = useState(false);

  React.useEffect(() => {
    setImgSrc(photos[0] || '');
    setImgError(false);
  }, [photos[0]]);

  // Objective color mapping
  const getObjectiveColor = (objective: string) => {
    switch (objective) {
      case 'Youth Empowerment':
        return 'bg-blue-50 text-[#1D70B8] border-blue-200/60';
      case 'Women Empowerment & Protection':
        return 'bg-purple-50 text-purple-700 border-purple-200/60';
      case 'Child Rights & Protection':
        return 'bg-amber-50 text-amber-700 border-amber-200/60';
      case 'Climate Change & Environmental Action':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200/60';
    }
  };

  return (
    <div
      onClick={() => onViewDetails(project)}
      className="group relative bg-white rounded-3xl border border-slate-200/80 hover:border-slate-300 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      <div>
        {/* Cover Image Container */}
        <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
          {imgSrc && !imgError ? (
            <img
              src={imgSrc}
              alt={project.title}
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
              <FolderKanban className="w-10 h-10 mb-1 opacity-40 text-slate-500" />
              <span className="text-[11px] font-mono text-slate-400">[Project Photography]</span>
            </div>
          )}

          {/* Objective Badge Top-Left */}
          <div className="absolute top-3 left-3">
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md border shadow-xs ${getObjectiveColor(
                project.objective
              )}`}
            >
              {project.objective}
            </span>
          </div>

          {/* Photo Count Indicator (if multiple photos) */}
          {photos.length > 1 && (
            <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/65 backdrop-blur-sm text-white text-[10px] font-medium flex items-center gap-1 shadow-sm">
              <Images className="w-3 h-3" />
              <span>{photos.length} photos</span>
            </div>
          )}

          {/* Status Badge Top-Right (for admin) */}
          {isAdmin && (
            <div className="absolute top-3 right-3 shadow-xs">
              <StatusBadge status={project.status} />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 pb-3">
          {/* Title */}
          <h3 className="text-lg font-medium text-slate-900 tracking-tight leading-snug group-hover:text-[#1D70B8] transition-colors mb-2 line-clamp-1">
            {project.title}
          </h3>

          {/* Impact & Funding Quick Chips */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] uppercase tracking-wider text-emerald-800 font-bold leading-tight truncate">
                  Funding
                </span>
                <span className="text-xs font-bold text-emerald-950 font-mono truncate">
                  {project.fundingReceived || 'Funded'}
                </span>
              </div>
            </div>

            <div className="p-2 rounded-xl bg-blue-50/70 border border-blue-100 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#1D70B8] flex-shrink-0" />
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] uppercase tracking-wider text-blue-800 font-bold leading-tight truncate">
                  Benefited
                </span>
                <span className="text-xs font-bold text-slate-900 font-mono truncate">
                  {project.beneficiariesCount || 'Impacted'}
                </span>
              </div>
            </div>
          </div>

          {/* Location & Dates */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-2.5">
            <span className="flex items-center gap-1 text-slate-600 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{project.location}</span>
            </span>
            <span className="flex items-center gap-1 font-mono text-slate-400 text-[11px]">
              <Calendar className="w-3 h-3 text-slate-400" />
              {project.startDate}
            </span>
          </div>

          {/* Description Excerpt */}
          {project.description && (
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-light">
              {project.description}
            </p>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-semibold text-[#1D70B8] group-hover:underline flex items-center gap-1">
          <span>View Project Details</span>
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
                onClick={() => onToggleStatus(project)}
                title={project.status === 'Published' ? 'Unpublish to Draft' : 'Publish'}
                className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
              >
                {project.status === 'Published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-emerald-600" />}
              </button>
            )}
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(project)}
                title="Edit Project"
                className="p-1.5 text-slate-500 hover:text-[#1D70B8] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(project)}
                title="Delete Project"
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
