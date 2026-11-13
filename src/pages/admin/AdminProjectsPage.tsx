import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FolderKanban,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Eye,
  EyeOff,
  LayoutGrid,
  Table as TableIcon,
  Star,
  Upload,
  DollarSign,
  Users,
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
import { ProjectCard } from '../../components/ProjectCard';
import { ProjectDetailModal } from '../../components/ProjectDetailModal';
import { projectService } from '../../services/projectService';
import { activityService } from '../../services/activityService';
import { githubSyncService } from '../../services/githubSyncService';
import { AdminProject, ContentStatus, OfficialObjective, OFFICIAL_OBJECTIVES } from '../../types/admin';

export const AdminProjectsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [objectiveFilter, setObjectiveFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Modals & selection
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<AdminProject | null>(null);
  const [viewingProject, setViewingProject] = useState<AdminProject | null>(null);
  const [deletingProject, setDeletingProject] = useState<AdminProject | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isReadingPhotos, setIsReadingPhotos] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // GitHub Auto-Deploy / Sync State
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    objective: OfficialObjective;
    description: string;
    location: string;
    startDate: string;
    endDate: string;
    fundingReceived: string;
    beneficiariesCount: string;
    donorOrPartner: string;
    coverImageUrl: string;
    images: string[];
    status: ContentStatus;
  }>({
    title: '',
    slug: '',
    objective: OFFICIAL_OBJECTIVES[0],
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    fundingReceived: '',
    beneficiariesCount: '',
    donorOrPartner: '',
    coverImageUrl: '',
    images: [],
    status: 'Published',
  });

  const [formErrors, setFormErrors] = useState<{
    title?: string;
    objective?: string;
    startDate?: string;
  }>({});

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const data = await projectService.getProjects();
      setProjects(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
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
      slug: !editingProject ? slugify(val) : prev.slug,
    }));
  };

  const handleOpenCreate = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      slug: '',
      objective: OFFICIAL_OBJECTIVES[0],
      description: '',
      location: 'Khyber Pakhtunkhwa, Pakistan',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      fundingReceived: '',
      beneficiariesCount: '',
      donorOrPartner: '',
      coverImageUrl: '',
      images: [],
      status: 'Published',
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEdit = (project: AdminProject) => {
    setEditingProject(project);
    const projectPhotos = Array.isArray(project.images) && project.images.length > 0
      ? project.images
      : (project.coverImageUrl ? [project.coverImageUrl] : []);

    setFormData({
      title: project.title,
      slug: project.slug,
      objective: project.objective,
      description: project.description,
      location: project.location,
      startDate: project.startDate,
      endDate: project.endDate || '',
      fundingReceived: project.fundingReceived || '',
      beneficiariesCount: project.beneficiariesCount || '',
      donorOrPartner: project.donorOrPartner || '',
      coverImageUrl: project.coverImageUrl || projectPhotos[0] || '',
      images: [...projectPhotos],
      status: project.status,
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const validateForm = () => {
    const errors: { title?: string; objective?: string; startDate?: string } = {};
    if (!formData.title.trim()) errors.title = 'Project title is required.';
    if (!formData.objective) errors.objective = 'Please select one of the official objectives.';
    if (!formData.startDate) errors.startDate = 'Start date is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Multiple files change handler (up to 5 photos)
  const handleMultipleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const availableSlots = 5 - formData.images.length;
    if (availableSlots <= 0) {
      setToast({
        id: String(Date.now()),
        type: 'error',
        text: 'A maximum of 5 pictures can be uploaded per project.',
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
      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim() || slugify(formData.title),
        objective: formData.objective,
        description: formData.description.trim(),
        location: formData.location.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate ? formData.endDate : undefined,
        fundingReceived: formData.fundingReceived.trim() || undefined,
        beneficiariesCount: formData.beneficiariesCount.trim() || undefined,
        donorOrPartner: formData.donorOrPartner.trim() || undefined,
        coverImageUrl: formData.coverImageUrl || formData.images[0] || undefined,
        images: formData.images,
        status: formData.status,
      };

      if (editingProject) {
        await projectService.updateProject(editingProject.id, payload);
        await activityService.logActivity('updated', 'Project', payload.title);
        setToast({
          id: String(Date.now()),
          type: 'success',
          text: isGithubConnected
            ? `Updated "${payload.title}" & synced ${photoCount} picture(s) to GitHub! Cloudflare Pages will rebuild.`
            : `Updated "${payload.title}". Connect GitHub in the bar above to auto-deploy.`,
        });
      } else {
        await projectService.createProject(payload);
        await activityService.logActivity('created', 'Project', payload.title);
        setToast({
          id: String(Date.now()),
          type: 'success',
          text: isGithubConnected
            ? `Created "${payload.title}" & synced ${photoCount} picture(s) to GitHub! Cloudflare Pages will rebuild.`
            : `Created "${payload.title}". Connect GitHub in the bar above to auto-deploy.`,
        });
      }
      setIsFormOpen(false);
      loadProjects();
    } catch {
      setToast({ id: String(Date.now()), type: 'error', text: 'Failed to save project.' });
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
      const res = await projectService.syncToGithub();
      if (res.success) {
        setToast({
          id: String(Date.now()),
          type: 'success',
          text: `Successfully synced ${res.deployedCount} projects and all photos to GitHub! Cloudflare Pages build triggered.`,
        });
        loadProjects();
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

  const handleToggleStatus = async (project: AdminProject) => {
    const nextStatus: ContentStatus = project.status === 'Published' ? 'Draft' : 'Published';
    try {
      await projectService.updateProject(project.id, { status: nextStatus });
      await activityService.logActivity(nextStatus === 'Published' ? 'published' : 'unpublished', 'Project', project.title);
      setToast({
        id: String(Date.now()),
        type: 'info',
        text: `Changed "${project.title}" status to ${nextStatus}. Synced to GitHub!`,
      });
      loadProjects();
      if (viewingProject && viewingProject.id === project.id) {
        setViewingProject({ ...viewingProject, status: nextStatus });
      }
    } catch {
      setToast({ id: String(Date.now()), type: 'error', text: 'Status update failed.' });
    }
  };

  const handleDelete = async () => {
    if (!deletingProject) return;
    setIsSaving(true);
    try {
      await projectService.deleteProject(deletingProject.id);
      await activityService.logActivity('deleted', 'Project', deletingProject.title);
      setToast({ id: String(Date.now()), type: 'success', text: `Deleted "${deletingProject.title}". Synced to GitHub!` });
      setDeletingProject(null);
      if (viewingProject && viewingProject.id === deletingProject.id) {
        setViewingProject(null);
      }
      loadProjects();
    } catch {
      setToast({ id: String(Date.now()), type: 'error', text: 'Failed to delete project.' });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.objective.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesObjective = objectiveFilter === 'All' || p.objective === objectiveFilter;
    return matchesSearch && matchesStatus && matchesObjective;
  });

  return (
    <div>
      <SEO
        title="Admin: Projects & Initiatives | Hope Together Organization"
        description="Manage organizational projects aligned with core thematic objectives."
      />
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      <AdminPageHeader
        title="Projects & Initiatives"
        description="Coordinate field projects, tracking their thematic focus, funding received, beneficiaries reached, and photo galleries."
        primaryAction={{
          label: 'Add Project',
          onClick: handleOpenCreate,
          icon: Plus,
        }}
      />

      {/* GitHub Auto-Deploy / Cloudflare Sync Bar */}
      <GitHubSyncBar
        resourceName="Projects"
        folderPath="public/assets/projects/"
        isSyncing={isSyncing}
        onSync={handleManualSync}
        onOpenSettings={() => setIsSyncModalOpen(true)}
      />

      {/* Filters & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              placeholder="Search by title, location, or objective..."
              filterOptions={[
                { label: 'All Statuses', value: 'All' },
                { label: 'Published', value: 'Published' },
                { label: 'Draft', value: 'Draft' },
                { label: 'Completed', value: 'Completed' },
                { label: 'Archived', value: 'Archived' },
              ]}
              selectedFilter={statusFilter}
              onFilterChange={setStatusFilter}
              totalResults={filteredProjects.length}
              itemLabel="projects"
            />
          </div>

          {/* Objective Filter Dropdown */}
          <div className="sm:w-64">
            <select
              value={objectiveFilter}
              onChange={(e) => setObjectiveFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#1D70B8]"
            >
              <option value="All">All Objectives ({projects.length})</option>
              {OFFICIAL_OBJECTIVES.map((obj) => (
                <option key={obj} value={obj}>
                  {obj}
                </option>
              ))}
            </select>
          </div>
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
          Loading projects...
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          title="No projects found"
          description={
            searchQuery || statusFilter !== 'All' || objectiveFilter !== 'All'
              ? 'Try modifying your search query or objective filters.'
              : 'Add your first organizational project or field initiative.'
          }
          icon={FolderKanban}
          action={{
            label: 'Add Project',
            onClick: handleOpenCreate,
          }}
        />
      ) : viewMode === 'cards' ? (
        /* Visual Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <ProjectCard
              key={proj.id}
              project={proj}
              isAdmin={true}
              onViewDetails={(p) => setViewingProject(p)}
              onEdit={(p) => handleOpenEdit(p)}
              onToggleStatus={(p) => handleToggleStatus(p)}
              onDelete={(p) => setDeletingProject(p)}
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
                  <th className="py-3.5 px-4">Project</th>
                  <th className="py-3.5 px-4">Objective</th>
                  <th className="py-3.5 px-4">Funding & Beneficiaries</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Timeline</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((proj) => (
                  <tr
                    key={proj.id}
                    onClick={() => setViewingProject(proj)}
                    className="hover:bg-slate-50/60 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-xl bg-slate-100 border border-slate-200/70 overflow-hidden flex items-center justify-center flex-shrink-0">
                          {proj.coverImageUrl ? (
                            <img src={proj.coverImageUrl} alt={proj.title} className="w-full h-full object-cover" />
                          ) : (
                            <FolderKanban className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <span className="font-medium text-slate-900 block hover:text-[#1D70B8] transition-colors">
                            {proj.title}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono block">/{proj.slug}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-xs font-semibold text-[#1D70B8]">{proj.objective}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col text-xs font-mono">
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {proj.fundingReceived || 'Funded'}
                        </span>
                        <span className="text-slate-500 flex items-center gap-1 mt-0.5">
                          <Users className="w-3 h-3 text-[#1D70B8]" />
                          {proj.beneficiariesCount || 'Communities'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <span className="text-slate-600 text-xs font-mono">
                        {proj.startDate} {proj.endDate ? `to ${proj.endDate}` : '(Ongoing)'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={proj.status} />
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewingProject(proj)}
                          title="View Details"
                          className="p-1.5 text-slate-500 hover:text-[#1D70B8] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(proj)}
                          title={proj.status === 'Published' ? 'Unpublish to Draft' : 'Publish'}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        >
                          {proj.status === 'Published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-emerald-600" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(proj)}
                          title="Edit Project"
                          className="p-1.5 text-slate-500 hover:text-[#1D70B8] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingProject(proj)}
                          title="Delete Project"
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

      {/* Project Details Modal */}
      <ProjectDetailModal
        project={viewingProject}
        isOpen={viewingProject !== null}
        onClose={() => setViewingProject(null)}
        isAdmin={true}
        onEdit={(p) => handleOpenEdit(p)}
        onToggleStatus={(p) => handleToggleStatus(p)}
        onDelete={(p) => setDeletingProject(p)}
      />

      {/* Add / Edit Form Modal */}
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
                  {editingProject ? 'Edit Project' : 'Add Project'}
                </h3>
                <p className="text-xs text-slate-400 font-light">
                  Specify funding received, beneficiaries impacted, and upload up to 5 photos.
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
              {/* Project Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Youth Vocational Skill Incubation"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#1D70B8] ${
                    formErrors.title ? 'border-red-400 bg-red-50/20' : 'border-slate-200 bg-slate-50/40'
                  }`}
                />
                {formErrors.title && <span className="text-xs text-red-500 mt-1 block">{formErrors.title}</span>}
              </div>

              {/* Objective Pillar & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Objective Pillar <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.objective}
                    onChange={(e) => setFormData({ ...formData, objective: e.target.value as OfficialObjective })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/40 text-sm"
                  >
                    {OFFICIAL_OBJECTIVES.map((obj) => (
                      <option key={obj} value={obj}>
                        {obj}
                      </option>
                    ))}
                  </select>
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
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Completed">Completed</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Funding Received & Beneficiaries Count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Funding Received</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fundingReceived}
                    onChange={(e) => setFormData({ ...formData, fundingReceived: e.target.value })}
                    placeholder="e.g. PKR 3,500,000 or $25,000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/40 text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#1D70B8]" />
                    <span>People Benefited</span>
                  </label>
                  <input
                    type="text"
                    value={formData.beneficiariesCount}
                    onChange={(e) => setFormData({ ...formData, beneficiariesCount: e.target.value })}
                    placeholder="e.g. 1,200+ Youth & Women"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/40 text-sm font-mono"
                  />
                </div>
              </div>

              {/* Location & Supporting Partner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Location / District
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Peshawar, KP"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/40 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Supporting Partner / Donor (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.donorOrPartner}
                    onChange={(e) => setFormData({ ...formData, donorOrPartner: e.target.value })}
                    placeholder="e.g. Local Welfare Alliance"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/40 text-sm"
                  />
                </div>
              </div>

              {/* Start Date & End Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm ${
                      formErrors.startDate ? 'border-red-400 bg-red-50/20' : 'border-slate-200 bg-slate-50/40'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/40 text-sm"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Project Description & Community Scope
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed summary of objectives, implementation steps, and community benefits..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D70B8] resize-none"
                />
              </div>

              {/* Multi-Photo Upload (Up to 5 pictures) */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Project Photos (Up to 5 Pictures)
                  </label>
                  <span className="text-xs font-mono text-slate-500">
                    {formData.images.length} / 5 selected
                  </span>
                </div>

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

                {formData.images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {formData.images.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-square shadow-2xs"
                      >
                        <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />

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

              {/* Action Buttons */}
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
                      : editingProject
                      ? 'Update Project'
                      : 'Save Project'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deletingProject !== null}
        title="Delete Project?"
        message={`Are you sure you want to delete "${deletingProject?.title}"? This will remove the project record and sync with GitHub.`}
        confirmLabel="Delete Project"
        isLoading={isSaving}
        onConfirm={handleDelete}
        onCancel={() => setDeletingProject(null)}
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
