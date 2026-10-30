import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  User,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  Check,
  X,
  UploadCloud,
  Settings,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Key,
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
import { teamService } from '../../services/teamService';
import { activityService } from '../../services/activityService';
import { githubSyncService, GitHubSyncSettings } from '../../services/githubSyncService';
import { AdminTeamMember } from '../../types/admin';

export const AdminTeamPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [members, setMembers] = useState<AdminTeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<AdminTeamMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<AdminTeamMember | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isReadingPhoto, setIsReadingPhoto] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // GitHub Auto-Deploy / Sync State
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isTestingGitHub, setIsTestingGitHub] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [githubSettings, setGithubSettings] = useState<GitHubSyncSettings>(() =>
    githubSyncService.getSettings()
  );
  const [testResult, setTestResult] = useState<{ success: boolean; user?: string; error?: string } | null>(
    null
  );

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    bio: '',
    category: 'Core Team' as 'Executive Body' | 'Core Team' | string,
    photoUrl: '',
    email: '',
    linkedinUrl: '',
    facebookUrl: '',
    instagramUrl: '',
    displayOrder: 1,
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState<{ name?: string; position?: string }>({});

  const loadMembers = async () => {
    setIsLoading(true);
    try {
      const data = await teamService.getTeamMembers();
      setMembers(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  // Open modal if action=new in URL query
  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      handleOpenCreate();
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  const handleOpenCreate = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      position: '',
      bio: '',
      category: 'Core Team',
      photoUrl: '',
      email: '',
      linkedinUrl: '',
      facebookUrl: '',
      instagramUrl: '',
      displayOrder: members.length + 1,
      isActive: true,
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEdit = (member: AdminTeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      position: member.position,
      bio: member.bio,
      category: member.category,
      photoUrl: member.photoUrl || '',
      email: member.email || '',
      linkedinUrl: member.linkedinUrl || '',
      facebookUrl: member.facebookUrl || '',
      instagramUrl: member.instagramUrl || '',
      displayOrder: member.displayOrder,
      isActive: member.isActive,
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const validateForm = () => {
    const errors: { name?: string; position?: string } = {};
    if (!formData.name.trim()) errors.name = 'Full name is required.';
    if (!formData.position.trim()) errors.position = 'Position title is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    const isGithubConnected = githubSyncService.isConfigured();
    try {
      if (editingMember) {
        await teamService.updateTeamMember(editingMember.id, formData);
        await activityService.logActivity('updated', 'Team Member', formData.name);
        setToast({
          id: String(Date.now()),
          type: 'success',
          text: isGithubConnected
            ? `Updated "${formData.name}" & uploaded photo to GitHub! Cloudflare Pages will deploy shortly.`
            : `Updated "${formData.name}". Connect GitHub to auto-deploy to live site.`,
        });
      } else {
        await teamService.createTeamMember(formData);
        await activityService.logActivity('added', 'Team Member', formData.name);
        setToast({
          id: String(Date.now()),
          type: 'success',
          text: isGithubConnected
            ? `Added "${formData.name}" & uploaded photo to GitHub! Cloudflare Pages will deploy shortly.`
            : `Added "${formData.name}". Connect GitHub to auto-deploy to live site.`,
        });
      }
      setIsFormOpen(false);
      loadMembers();
    } catch {
      setToast({ id: String(Date.now()), type: 'error', text: 'Failed to save team member.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingMember) return;
    setIsSaving(true);
    try {
      await teamService.deleteTeamMember(deletingMember.id);
      await activityService.logActivity('deleted', 'Team Member', deletingMember.name);
      setToast({ id: String(Date.now()), type: 'success', text: `Deleted "${deletingMember.name}".` });
      setDeletingMember(null);
      loadMembers();
    } catch {
      setToast({ id: String(Date.now()), type: 'error', text: 'Failed to delete team member.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestGitHubConnection = async () => {
    setIsTestingGitHub(true);
    setTestResult(null);
    try {
      githubSyncService.saveSettings(githubSettings);
      const res = await githubSyncService.testConnection();
      setTestResult(res);
    } finally {
      setIsTestingGitHub(false);
    }
  };

  const handleSaveGitHubSettings = (e: React.FormEvent) => {
    e.preventDefault();
    githubSyncService.saveSettings(githubSettings);
    setToast({
      id: String(Date.now()),
      type: 'success',
      text: 'GitHub Auto-Deploy settings saved successfully!',
    });
    setIsSyncModalOpen(false);
  };

  const handleManualSync = async () => {
    if (!githubSyncService.isConfigured()) {
      setIsSyncModalOpen(true);
      return;
    }
    setIsSyncing(true);
    try {
      const res = await teamService.syncToGithub();
      if (res.success) {
        setToast({
          id: String(Date.now()),
          type: 'success',
          text: `Successfully synced ${res.deployedCount} team members to GitHub! Cloudflare Pages build triggered.`,
        });
        loadMembers();
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

  // Photo File Upload handler converting to persistent Data URL
  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsReadingPhoto(true);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({ ...prev, photoUrl: reader.result as string }));
        }
        setIsReadingPhoto(false);
      };
      reader.onerror = () => {
        setIsReadingPhoto(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Filtered members
  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.email && m.email.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <SEO title="Team Management | Hope Together Admin" />
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Header */}
      <AdminPageHeader
        title="Team Members"
        description="Manage the people displayed on the public Team page."
        primaryAction={{
          label: 'Add Team Member',
          onClick: handleOpenCreate,
          icon: Plus,
        }}
      />

      {/* GitHub Auto-Deploy / Cloudflare Sync Bar */}
      <div className="mb-6 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              githubSyncService.isConfigured()
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                : 'bg-amber-50 text-amber-600 border border-amber-100'
            }`}
          >
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-800">
                GitHub Auto-Deploy & Sync
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  githubSyncService.isConfigured()
                    ? 'bg-emerald-100/70 text-emerald-700'
                    : 'bg-amber-100/70 text-amber-700'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    githubSyncService.isConfigured() ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
                {githubSyncService.isConfigured() ? 'Connected' : 'Token Required'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {githubSyncService.isConfigured()
                ? `Syncs directly to repo: ${githubSettings.owner}/${githubSettings.repo} (${githubSettings.branch})`
                : 'Connect GitHub to automatically upload member pictures and publish changes to Cloudflare Pages for all devices.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {githubSyncService.isConfigured() && (
            <button
              type="button"
              onClick={handleManualSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition shadow-2xs disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Deploying...' : 'Sync & Deploy to GitHub'}</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsSyncModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            <span>{githubSyncService.isConfigured() ? 'Sync Settings' : 'Connect GitHub'}</span>
          </button>
        </div>
      </div>

      {/* Search and Category Filter */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search by name, position, or email..."
        filterOptions={[
          { label: 'All Departments', value: 'All' },
          { label: 'Executive Body', value: 'Executive Body' },
          { label: 'Core Team', value: 'Core Team' },
        ]}
        selectedFilter={categoryFilter}
        onFilterChange={setCategoryFilter}
        totalResults={filteredMembers.length}
        itemLabel="members"
      />

      {/* Content Table / Cards */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400 font-mono text-xs">
          Loading team members...
        </div>
      ) : filteredMembers.length === 0 ? (
        <EmptyState
          title="No team members found"
          description={
            searchQuery || categoryFilter !== 'All'
              ? 'Try adjusting your search query or filter options.'
              : 'Get started by creating your first team member profile.'
          }
          icon={User}
          action={{
            label: 'Add Team Member',
            onClick: handleOpenCreate,
          }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Member</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Contact</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center hidden sm:table-cell">Order</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Photo & Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/70 overflow-hidden flex items-center justify-center flex-shrink-0">
                          {m.photoUrl ? (
                            <img src={m.photoUrl} alt={m.name} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <span className="font-medium text-slate-900 block">{m.name}</span>
                          <span className="text-xs text-slate-500 font-light">{m.position}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                        {m.category}
                      </span>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <span className="text-slate-600 font-mono text-xs">{m.email || '—'}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={m.isActive} />
                    </td>

                    {/* Order */}
                    <td className="py-3.5 px-4 text-center font-mono text-xs text-slate-500 hidden sm:table-cell">
                      #{m.displayOrder}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(m)}
                          className="p-1.5 text-slate-500 hover:text-[#1D70B8] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          aria-label={`Edit ${m.name}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingMember(m)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          aria-label={`Delete ${m.name}`}
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
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-slate-900 tracking-tight">
                  {editingMember ? 'Edit Team Member' : 'Add Team Member'}
                </h3>
                <p className="text-xs text-slate-400 font-light">
                  Provide member profile details for public display.
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

            {/* Modal Body / Form */}
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* Name & Position */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Jane Doe"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#1D70B8] ${
                      formErrors.name ? 'border-red-400 bg-red-50/20' : 'border-slate-200 bg-slate-50/40'
                    }`}
                  />
                  {formErrors.name && (
                    <span className="text-xs text-red-500 mt-1 block">{formErrors.name}</span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Position Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="e.g. Executive Director"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#1D70B8] ${
                      formErrors.position ? 'border-red-400 bg-red-50/20' : 'border-slate-200 bg-slate-50/40'
                    }`}
                  />
                  {formErrors.position && (
                    <span className="text-xs text-red-500 mt-1 block">{formErrors.position}</span>
                  )}
                </div>
              </div>

              {/* Department / Category & Display Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Department Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as 'Executive Body' | 'Core Team',
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D70B8]"
                  >
                    <option value="Executive Body">Executive Body</option>
                    <option value="Core Team">Core Team</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.displayOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D70B8]"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Brief Biography
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Summary of experience and background..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D70B8] resize-none"
                />
              </div>

              {/* Photo Upload / URL Simulation */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Member Photograph
                </label>
                <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200">
                  <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {formData.photoUrl ? (
                      <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoFileChange}
                      className="text-xs text-slate-500 file:mr-2.5 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-white file:text-slate-700 file:shadow-2xs file:cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.photoUrl}
                      onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                      placeholder="Or paste photo URL..."
                      className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Email & Social Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.org"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/40"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/40"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Facebook URL
                  </label>
                  <input
                    type="url"
                    value={formData.facebookUrl}
                    onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                    placeholder="https://facebook.com/..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/40"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Instagram URL
                  </label>
                  <input
                    type="url"
                    value={formData.instagramUrl}
                    onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                    placeholder="https://instagram.com/..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/40"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-[#1D70B8] focus:ring-[#1D70B8] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="isActive" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Display actively on public website
                </label>
              </div>

              {/* Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  disabled={isSaving}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isReadingPhoto}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all shadow-xs disabled:opacity-60 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {isSaving
                      ? 'Saving...'
                      : isReadingPhoto
                      ? 'Reading photo...'
                      : editingMember
                      ? 'Update Member'
                      : 'Save Member'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GitHub Sync Modal */}
      {isSyncModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-slate-100 text-slate-800 rounded-xl">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-slate-900 tracking-tight">
                    GitHub Cloud Deployment Setup
                  </h3>
                  <p className="text-xs text-slate-400">
                    Upload photos & data straight to your GitHub repository.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSyncModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveGitHubSettings} className="p-6 overflow-y-auto space-y-4 flex-1">
              {/* Info Note */}
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#1D70B8]" />
                  Automatic Cloudflare Pages Redeployment
                </div>
                <p className="text-[11px] text-blue-800/90 leading-relaxed">
                  When you add or edit someone with a photo, it will automatically commit the photo to <code className="bg-white/70 px-1 py-0.5 rounded font-mono">public/assets/team/</code> and commit the team data to GitHub. Cloudflare Pages automatically rebuilds within 1 minute, displaying your changes on phones and PCs worldwide.
                </p>
              </div>

              {/* GitHub Token */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <Key className="w-3.5 h-3.5" />
                    GitHub Personal Access Token (PAT)
                  </label>
                  <a
                    href="https://github.com/settings/tokens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#1D70B8] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Generate token on GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showToken ? 'text' : 'password'}
                    value={githubSettings.token}
                    onChange={(e) =>
                      setGithubSettings({ ...githubSettings, token: e.target.value })
                    }
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/40 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#1D70B8]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Required scopes: <code className="font-mono text-slate-600 bg-slate-100 px-1 rounded">repo</code> (Full control of repositories). Stored securely in your admin browser.
                </p>
              </div>

              {/* Repo Owner & Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Repository Owner
                  </label>
                  <input
                    type="text"
                    value={githubSettings.owner}
                    onChange={(e) =>
                      setGithubSettings({ ...githubSettings, owner: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/40"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Repository Name
                  </label>
                  <input
                    type="text"
                    value={githubSettings.repo}
                    onChange={(e) =>
                      setGithubSettings({ ...githubSettings, repo: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/40"
                  />
                </div>
              </div>

              {/* Branch */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1">
                    Target Branch
                  </label>
                  <input
                    type="text"
                    value={githubSettings.branch}
                    onChange={(e) =>
                      setGithubSettings({ ...githubSettings, branch: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/40"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={githubSettings.autoSync}
                      onChange={(e) =>
                        setGithubSettings({ ...githubSettings, autoSync: e.target.checked })
                      }
                      className="rounded text-[#1D70B8] focus:ring-[#1D70B8] w-4 h-4 cursor-pointer"
                    />
                    <span>Auto-upload on Save</span>
                  </label>
                </div>
              </div>

              {/* Test Result Message */}
              {testResult && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    testResult.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {testResult.success ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  )}
                  <span>
                    {testResult.success
                      ? `Verified successfully! Connected as @${testResult.user} with write access to ${githubSettings.owner}/${githubSettings.repo}.`
                      : testResult.error}
                  </span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleTestGitHubConnection}
                  disabled={isTestingGitHub || !githubSettings.token}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingGitHub ? 'animate-spin' : ''}`} />
                  <span>{isTestingGitHub ? 'Testing...' : 'Test Connection'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSyncModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition shadow-xs cursor-pointer"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deletingMember !== null}
        title="Delete Team Member?"
        message={`Are you sure you want to delete "${deletingMember?.name}"? This action will remove the record from local state.`}
        confirmLabel="Delete Member"
        isLoading={isSaving}
        onConfirm={handleDelete}
        onCancel={() => setDeletingMember(null)}
      />
    </div>
  );
};
