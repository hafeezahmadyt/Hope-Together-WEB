import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  FolderKanban,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Calendar,
  Check,
  X,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Tag,
} from 'lucide-react';
import { SEO } from '../../components/SEO';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { SearchFilterBar } from '../../components/admin/SearchFilterBar';
import { EmptyState } from '../../components/admin/EmptyState';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { ConfirmModal } from '../../components/admin/ConfirmModal';
import { Toast, ToastMessage } from '../../components/admin/Toast';
import { projectService } from '../../services/projectService';
import { activityService } from '../../services/activityService';
import { AdminProject, ContentStatus, OfficialObjective, OFFICIAL_OBJECTIVES } from '../../types/admin';

export const AdminProjectsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [objectiveFilter, setObjectiveFilter] = useState('All');

  // Modals & form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<AdminProject | null>(null);
  const [deletingProject, setDeletingProject] = useState<AdminProject | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    objective: OfficialObjective;
    description: string;
    location: string;
    startDate: string;
    endDate: string;
    coverImageUrl: string;
    status: ContentStatus;
  }>({
    title: '',
    slug: '',
    objective: OFFICIAL_OBJECTIVES[0],
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    coverImageUrl: '',
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
      coverImageUrl: '',
      status: 'Published',
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEdit = (project: AdminProject) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      slug: project.slug,
      objective: project.objective,
      description: project.description,
      location: project.location,
      startDate: project.startDate,
      endDate: project.endDate || '',
      coverImageUrl: project.coverImageUrl || '',
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      const payload = {
        title: formData.title.trim(),
        slug: formData.slug.trim() || slugify(formData.title),
        objective: formData.objective,
        description: formData.description.trim(),
        location: formData.location.trim(),
        startDate: formData.startDate,
        endDate: formData.endDate ? formData.endDate : undefined,
        coverImageUrl: formData.coverImageUrl.trim() ? formData.coverImageUrl.trim() : undefined,
        status: formData.status,
      };

      if (editingProject) {
        await projectService.updateProject(editingProject.id, payload);
        await activityService.logActivity('updated', 'Project', payload.title);
        setToast({ id: String(Date.now()), type: 'success', text: `Updated "${payload.title}".` });
      } else {
        await projectService.createProject(payload);
        await activityService.logActivity('created', 'Project', payload.title);
        setToast({ id: String(Date.now()), type: 'success', text: `Created "${payload.title}".` });
      }
      setIsFormOpen(false);
      loadProjects();
    } catch {
      setToast({ id: String(Date.now()), type: 'error', text: 'Failed to save project.' });
    } finally {
      setIsSaving(false);
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
        text: `Changed "${project.title}" status to ${nextStatus}.`,
      });
      loadProjects();
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
      setToast({ id: String(Date.now()), type: 'success', text: `Deleted "${deletingProject.title}".` });
      setDeletingProject(null);
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

      <AdminPageHeader
        title="Projects & Initiatives"
        description="Manage developmental projects, tracking their thematic focus and active lifecycle status."
        action={
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-hope-blue text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        }
      />

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 space-y-3">
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search by title, location, or objective..."
          filterValue={statusFilter}
          onFilterChange={setStatusFilter}
          filterOptions={[
            { label: 'All Statuses', value: 'All' },
            { label: 'Published', value: 'Published' },
            { label: 'Draft', value: 'Draft' },
            { label: 'Completed', value: 'Completed' },
            { label: 'Archived', value: 'Archived' },
          ]}
        />
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap text-xs">
          <span className="text-slate-500 font-medium flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" />
            Objective:
          </span>
          <button
            onClick={() => setObjectiveFilter('All')}
            className={`px-2.5 py-1 rounded-md font-medium transition ${
              objectiveFilter === 'All'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {OFFICIAL_OBJECTIVES.map((obj) => (
            <button
              key={obj}
              onClick={() => setObjectiveFilter(obj)}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                objectiveFilter === obj
                  ? 'bg-hope-blue text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {obj}
            </button>
          ))}
        </div>
      </div>

      {/* Table view */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-hope-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading project registry...
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects found"
          description={
            searchQuery || statusFilter !== 'All' || objectiveFilter !== 'All'
              ? 'Try adjusting your search criteria or filters.'
              : 'Add your first project to showcase ongoing initiatives.'
          }
          actionLabel="Create Project"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Official Objective</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Timeline</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/75 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 text-slate-400">
                          {project.coverImageUrl ? (
                            <img
                              src={project.coverImageUrl}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FolderKanban className="w-6 h-6 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 line-clamp-1">{project.title}</div>
                          <div className="text-xs text-slate-400 font-mono">/{project.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-hope-blue border border-blue-100">
                        {project.objective}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="flex items-center gap-1.5 text-xs">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="line-clamp-1">{project.location}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>
                          {project.startDate} {project.endDate ? `→ ${project.endDate}` : '(Ongoing)'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={project.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleToggleStatus(project)}
                          title={project.status === 'Published' ? 'Unpublish' : 'Publish'}
                          className={`p-1.5 rounded-md transition ${
                            project.status === 'Published'
                              ? 'text-emerald-600 hover:bg-emerald-50'
                              : 'text-slate-400 hover:bg-slate-100'
                          }`}
                        >
                          {project.status === 'Published' ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleOpenEdit(project)}
                          title="Edit"
                          className="p-1.5 text-slate-500 hover:text-hope-blue hover:bg-blue-50 rounded-md transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingProject(project)}
                          title="Delete"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
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
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
            <span>Showing {filteredProjects.length} of {projects.length} total projects</span>
            <span className="text-slate-400 font-medium">Demo CMS Storage (LocalStorage)</span>
          </div>
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur z-10">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingProject ? 'Edit Project' : 'New Project'}
                </h3>
                <p className="text-xs text-slate-500">
                  Categorize initiatives under the official humanitarian thematic objectives.
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Grassroots Skills Mentorship (Demo)"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-hope-blue ${
                    formErrors.title ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {formErrors.title && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Slug / URL Key *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                    placeholder="project-slug-name"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-hope-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Official Objective *
                  </label>
                  <select
                    value={formData.objective}
                    onChange={(e) =>
                      setFormData({ ...formData, objective: e.target.value as OfficialObjective })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-hope-blue"
                  >
                    {OFFICIAL_OBJECTIVES.map((obj) => (
                      <option key={obj} value={obj}>
                        {obj}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Description / Abstract
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summarize the project's purpose, key interventions, and community focus..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-hope-blue"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Peshawar, KP"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-hope-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-hope-blue ${
                      formErrors.startDate ? 'border-red-500' : 'border-slate-300'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-hope-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Cover Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={formData.coverImageUrl}
                      onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-hope-blue"
                    />
                    <div className="w-10 h-10 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {formData.coverImageUrl ? (
                        <img
                          src={formData.coverImageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                        />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Lifecycle Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ContentStatus })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-hope-blue"
                  >
                    <option value="Published">Published (Public)</option>
                    <option value="Draft">Draft (Internal)</option>
                    <option value="Completed">Completed</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2 bg-hope-blue text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 shadow-sm"
                >
                  {isSaving ? (
                    'Saving...'
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      {editingProject ? 'Save Changes' : 'Create Project'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmModal
        isOpen={Boolean(deletingProject)}
        title="Delete Project"
        message={`Are you sure you want to delete "${deletingProject?.title}"? This change will be stored in your browser session.`}
        confirmLabel="Yes, Delete"
        confirmVariant="danger"
        isLoading={isSaving}
        onConfirm={handleDelete}
        onCancel={() => setDeletingProject(null)}
      />

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
};
