import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Handshake,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
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
import { partnerService } from '../../services/partnerService';
import { activityService } from '../../services/activityService';
import { AdminPartner, PARTNER_CATEGORIES } from '../../types/admin';

export const AdminPartnersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [partners, setPartners] = useState<AdminPartner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<AdminPartner | null>(null);
  const [deletingPartner, setDeletingPartner] = useState<AdminPartner | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Community Partners',
    categorySubtitle: '',
    description: '',
    logoUrl: '',
    websiteUrl: '',
    displayOrder: 1,
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState<{ name?: string }>({});

  const loadPartners = async () => {
    setIsLoading(true);
    try {
      const data = await partnerService.getPartners();
      setPartners(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      handleOpenCreate();
      setSearchParams({}, { replace: true });
    }
  }, [searchParams]);

  const handleOpenCreate = () => {
    setEditingPartner(null);
    setFormData({
      name: '',
      category: 'Community Partners',
      categorySubtitle: '',
      description: '',
      logoUrl: '',
      websiteUrl: '',
      displayOrder: partners.length + 1,
      isActive: true,
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEdit = (partner: AdminPartner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      category: partner.category,
      categorySubtitle: partner.categorySubtitle || '',
      description: partner.description || '',
      logoUrl: partner.logoUrl || '',
      websiteUrl: partner.websiteUrl || '',
      displayOrder: partner.displayOrder,
      isActive: partner.isActive,
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const validateForm = () => {
    const errors: { name?: string } = {};
    if (!formData.name.trim()) errors.name = 'Partner organization name is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSaving(true);
    try {
      if (editingPartner) {
        await partnerService.updatePartner(editingPartner.id, formData);
        await activityService.logActivity('updated', 'Partner', formData.name);
        setToast({ id: String(Date.now()), type: 'success', text: `Updated "${formData.name}" successfully.` });
      } else {
        await partnerService.createPartner(formData);
        await activityService.logActivity('added', 'Partner', formData.name);
        setToast({ id: String(Date.now()), type: 'success', text: `Added "${formData.name}" successfully.` });
      }
      setIsFormOpen(false);
      loadPartners();
    } catch {
      setToast({ id: String(Date.now()), type: 'error', text: 'Failed to save partner.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingPartner) return;
    setIsSaving(true);
    try {
      await partnerService.deletePartner(deletingPartner.id);
      await activityService.logActivity('deleted', 'Partner', deletingPartner.name);
      setToast({ id: String(Date.now()), type: 'success', text: `Deleted "${deletingPartner.name}".` });
      setDeletingPartner(null);
      loadPartners();
    } catch {
      setToast({ id: String(Date.now()), type: 'error', text: 'Failed to delete partner.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, logoUrl: localUrl }));
    }
  };

  const filteredPartners = partners.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <SEO title="Partners Management | Hope Together Admin" />
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      <AdminPageHeader
        title="Partners & Alliances"
        description="Manage organizational coalitions displayed across the public website."
        primaryAction={{
          label: 'Add Partner',
          onClick: handleOpenCreate,
          icon: Plus,
        }}
      />

      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search partner name or description..."
        filterOptions={[
          { label: 'All Categories', value: 'All' },
          ...PARTNER_CATEGORIES.map((c) => ({ label: c, value: c })),
        ]}
        selectedFilter={categoryFilter}
        onFilterChange={setCategoryFilter}
        totalResults={filteredPartners.length}
        itemLabel="partners"
      />

      {isLoading ? (
        <div className="py-20 text-center text-slate-400 font-mono text-xs">
          Loading partners...
        </div>
      ) : filteredPartners.length === 0 ? (
        <EmptyState
          title="No partners found"
          description={
            searchQuery || categoryFilter !== 'All'
              ? 'Try modifying your search or category filter.'
              : 'Add your first institutional or community partner alliance.'
          }
          icon={Handshake}
          action={{
            label: 'Add Partner',
            onClick: handleOpenCreate,
          }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">Partner</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Website</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center hidden sm:table-cell">Order</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPartners.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Logo & Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 rounded-xl bg-slate-50 border border-slate-200/70 p-1 flex items-center justify-center flex-shrink-0">
                          {p.logoUrl ? (
                            <img src={p.logoUrl} alt={p.name} className="max-h-full max-w-full object-contain" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-300" />
                          )}
                        </div>
                        <div>
                          <span className="font-medium text-slate-900 block">{p.name}</span>
                          {p.categorySubtitle && (
                            <span className="text-[11px] text-slate-400 font-mono block">
                              {p.categorySubtitle}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                        {p.category}
                      </span>
                    </td>

                    {/* Website */}
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      {p.websiteUrl ? (
                        <a
                          href={p.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1D70B8] hover:underline inline-flex items-center gap-1 font-mono text-xs"
                        >
                          <span>{p.websiteUrl.replace(/^https?:\/\//, '')}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-400 font-mono text-xs">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-center">
                      <StatusBadge status={p.isActive} />
                    </td>

                    {/* Order */}
                    <td className="py-3.5 px-4 text-center font-mono text-xs text-slate-500 hidden sm:table-cell">
                      #{p.displayOrder}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-slate-500 hover:text-[#1D70B8] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          aria-label={`Edit ${p.name}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingPartner(p)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          aria-label={`Delete ${p.name}`}
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
                  {editingPartner ? 'Edit Partner' : 'Add Partner'}
                </h3>
                <p className="text-xs text-slate-400 font-light">
                  Define partner credentials and categorical affiliation.
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
                  Partner Organization Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sample Academic Institute"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#1D70B8] ${
                    formErrors.name ? 'border-red-400 bg-red-50/20' : 'border-slate-200 bg-slate-50/40'
                  }`}
                />
                {formErrors.name && (
                  <span className="text-xs text-red-500 mt-1 block">{formErrors.name}</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D70B8]"
                  >
                    {PARTNER_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
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

              {/* Subtitle tag & website */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category Tag / Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.categorySubtitle}
                    onChange={(e) => setFormData({ ...formData, categorySubtitle: e.target.value })}
                    placeholder="e.g. [Grassroots Network]"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/40 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    placeholder="https://example.org"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/40 text-sm"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Brief Collaboration Summary
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe joint initiatives or institutional role..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/40 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D70B8] resize-none"
                />
              </div>

              {/* Logo Upload / URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Partner Logo
                </label>
                <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200">
                  <div className="w-16 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1 overflow-hidden flex-shrink-0">
                    {formData.logoUrl ? (
                      <img src={formData.logoUrl} alt="Logo preview" className="max-h-full max-w-full object-contain" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFileChange}
                      className="text-xs text-slate-500 file:mr-2.5 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-white file:text-slate-700 file:shadow-2xs file:cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.logoUrl}
                      onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                      placeholder="Or enter logo URL..."
                      className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Active Toggle */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="partnerActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-[#1D70B8] focus:ring-[#1D70B8] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="partnerActive" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Display on public website
                </label>
              </div>

              {/* Action Buttons */}
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
                  <span>{isSaving ? 'Saving...' : editingPartner ? 'Update Partner' : 'Save Partner'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={deletingPartner !== null}
        title="Delete Partner?"
        message={`Are you sure you want to remove "${deletingPartner?.name}"? This action will remove the partner from local state.`}
        confirmLabel="Delete Partner"
        isLoading={isSaving}
        onConfirm={handleDelete}
        onCancel={() => setDeletingPartner(null)}
      />
    </div>
  );
};
