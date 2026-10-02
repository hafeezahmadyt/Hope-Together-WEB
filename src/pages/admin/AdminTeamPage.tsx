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
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    bio: '',
    category: 'Leadership' as 'Leadership' | 'Team' | 'Volunteers',
    photoUrl: '',
    email: '',
    linkedinUrl: '',
    facebookUrl: '',
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
      category: 'Leadership',
      photoUrl: '',
      email: '',
      linkedinUrl: '',
      facebookUrl: '',
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
    try {
      if (editingMember) {
        await teamService.updateTeamMember(editingMember.id, formData);
        await activityService.logActivity('updated', 'Team Member', formData.name);
        setToast({ id: String(Date.now()), type: 'success', text: `Updated "${formData.name}" successfully.` });
      } else {
        await teamService.createTeamMember(formData);
        await activityService.logActivity('added', 'Team Member', formData.name);
        setToast({ id: String(Date.now()), type: 'success', text: `Added "${formData.name}" successfully.` });
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

  // Mock Photo File Upload simulation
  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeLocalUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, photoUrl: fakeLocalUrl }));
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

      {/* Search and Category Filter */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search by name, position, or email..."
        filterOptions={[
          { label: 'All Departments', value: 'All' },
          { label: 'Leadership', value: 'Leadership' },
          { label: 'Core Team', value: 'Team' },
          { label: 'Volunteers', value: 'Volunteers' },
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
                        category: e.target.value as 'Leadership' | 'Team' | 'Volunteers',
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D70B8]"
                  >
                    <option value="Leadership">Leadership &amp; Governance</option>
                    <option value="Team">Core Team &amp; Field Staff</option>
                    <option value="Volunteers">Community Volunteers</option>
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all shadow-xs disabled:opacity-60 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : editingMember ? 'Update Member' : 'Save Member'}</span>
                </button>
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
