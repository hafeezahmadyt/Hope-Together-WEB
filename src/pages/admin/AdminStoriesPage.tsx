import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Check,
  X,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Tag,
  FileText,
} from 'lucide-react';
import { SEO } from '../../components/SEO';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { SearchFilterBar } from '../../components/admin/SearchFilterBar';
import { EmptyState } from '../../components/admin/EmptyState';
import { ConfirmModal } from '../../components/admin/ConfirmModal';
import { Toast, ToastMessage } from '../../components/admin/Toast';
import { storyService } from '../../services/storyService';
import { activityService } from '../../services/activityService';
import { AdminStory } from '../../types/admin';

const STORY_CATEGORIES = [
  'Field Stories',
  'Announcements',
  'Community Voices',
  'Research & Insights',
  'Press Releases',
];

export const AdminStoriesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [stories, setStories] = useState<AdminStory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modals & Form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<AdminStory | null>(null);
  const [deletingStory, setDeletingStory] = useState<AdminStory | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    coverImageUrl: string;
    isPublished: boolean;
    publishedDate: string;
  }>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: STORY_CATEGORIES[0],
    coverImageUrl: '',
    isPublished: true,
    publishedDate: '',
  });

  const [formErrors, setFormErrors] = useState<{
    title?: string;
    excerpt?: string;
    content?: string;
  }>({});

  const loadStories = async () => {
    setIsLoading(true);
    try {
      const data = await storyService.getStories();
      setStories(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStories();
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
      slug: !editingStory ? slugify(val) : prev.slug,
    }));
  };

  const handleOpenCreate = () => {
    setEditingStory(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: STORY_CATEGORIES[0],
      coverImageUrl: '',
      isPublished: true,
      publishedDate: new Date().toISOString().split('T')[0],
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEdit = (story: AdminStory) => {
    setEditingStory(story);
    setFormData({
      title: story.title,
      slug: story.slug,
      excerpt: story.excerpt,
      content: story.content,
      category: story.category,
      coverImageUrl: story.coverImageUrl || '',
      isPublished: story.isPublished,
      publishedDate: story.publishedDate || new Date().toISOString().split('T')[0],
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const validateForm = () => {
    const errors: { title?: string; excerpt?: string; content?: string } = {};
    if (!formData.title.trim()) errors.title = 'Title is required.';
    if (!formData.excerpt.trim()) errors.excerpt = 'A short excerpt is required.';
    if (!formData.content.trim()) errors.content = 'Story content is required.';
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
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        category: formData.category,
        coverImageUrl: formData.coverImageUrl.trim() ? formData.coverImageUrl.trim() : undefined,
        isPublished: formData.isPublished,
        publishedDate: formData.isPublished ? formData.publishedDate || new Date().toISOString().split('T')[0] : undefined,
      };

      if (editingStory) {
        await storyService.updateStory(editingStory.id, payload);
        await activityService.logActivity('updated', 'Story', payload.title);
        setToast({ id: String(Date.now()), type: 'success', text: `Updated "${payload.title}".` });
      } else {
        await storyService.createStory(payload);
        await activityService.logActivity('created', 'Story', payload.title);
        setToast({ id: String(Date.now()), type: 'success', text: `Created story "${payload.title}".` });
      }
      setIsFormOpen(false);
      loadStories();
    } catch {
      setToast({ id: String(Date.now()), type: 'error', text: 'Failed to save story.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async (story: AdminStory) => {
    const nextPublished = !story.isPublished;
    try {
      await storyService.updateStory(story.id, { isPublished: nextPublished });
      await activityService.logActivity(
        nextPublished ? 'published' : 'unpublished',
        'Story',
        story.title
      );
      setToast({
        id: String(Date.now()),
        type: 'info',
        text: `Story "${story.title}" marked as ${nextPublished ? 'Published' : 'Draft'}.`,
      });
      loadStories();
    } catch {
      setToast({ id: String(Date.now()), type: 'error', text: 'Failed to update publication status.' });
    }
  };

  const handleDelete = async () => {
    if (!deletingStory) return;
    setIsSaving(true);
    try {
      await storyService.deleteStory(deletingStory.id);
      await activityService.logActivity('deleted', 'Story', deletingStory.title);
      setToast({ id: String(Date.now()), type: 'success', text: `Deleted "${deletingStory.title}".` });
      setDeletingStory(null);
      loadStories();
    } catch {
      setToast({ id: String(Date.now()), type: 'error', text: 'Failed to delete story.' });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredStories = stories.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Published'
        ? s.isPublished
        : !s.isPublished;
    const matchesCategory = categoryFilter === 'All' || s.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div>
      <SEO
        title="Admin: Stories & Articles | Hope Together Organization"
        description="Manage news dispatches, field reflections, and organization updates."
      />

      <AdminPageHeader
        title="Stories & Articles"
        description="Publish editorial updates, field dispatches, and organizational announcements."
        action={
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2 bg-hope-blue text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm text-sm"
          >
            <Plus className="w-4 h-4" />
            New Article
          </button>
        }
      />

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 space-y-3">
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search by title, excerpt, or category..."
          filterValue={statusFilter}
          onFilterChange={setStatusFilter}
          filterOptions={[
            { label: 'All Statuses', value: 'All' },
            { label: 'Published Only', value: 'Published' },
            { label: 'Drafts Only', value: 'Draft' },
          ]}
        />
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap text-xs">
          <span className="text-slate-500 font-medium flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" />
            Category:
          </span>
          <button
            onClick={() => setCategoryFilter('All')}
            className={`px-2.5 py-1 rounded-md font-medium transition ${
              categoryFilter === 'All'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {STORY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                categoryFilter === cat
                  ? 'bg-hope-blue text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stories list */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-hope-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading editorial stories...
        </div>
      ) : filteredStories.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No stories found"
          description={
            searchQuery || statusFilter !== 'All' || categoryFilter !== 'All'
              ? 'Try modifying your search or filters.'
              : 'Start by composing your first article or field dispatch.'
          }
          actionLabel="Write New Article"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Published Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStories.map((story) => (
                  <tr key={story.id} className="hover:bg-slate-50/75 transition">
                    <td className="py-3 px-4 max-w-md">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 text-slate-400">
                          {story.coverImageUrl ? (
                            <img
                              src={story.coverImageUrl}
                              alt={story.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FileText className="w-6 h-6 text-slate-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 line-clamp-1">{story.title}</div>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{story.excerpt}</p>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">/{story.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                        {story.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {story.isPublished ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-xs">
                      {story.publishedDate ? (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{story.publishedDate}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Unpublished</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleTogglePublish(story)}
                          title={story.isPublished ? 'Unpublish to Draft' : 'Publish'}
                          className={`p-1.5 rounded-md transition ${
                            story.isPublished
                              ? 'text-emerald-600 hover:bg-emerald-50'
                              : 'text-slate-400 hover:bg-slate-100'
                          }`}
                        >
                          {story.isPublished ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleOpenEdit(story)}
                          title="Edit"
                          className="p-1.5 text-slate-500 hover:text-hope-blue hover:bg-blue-50 rounded-md transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingStory(story)}
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
            <span>Showing {filteredStories.length} of {stories.length} articles</span>
            <span className="text-slate-400 font-medium">Demo CMS Storage (LocalStorage)</span>
          </div>
        </div>
      )}

      {/* Add / Edit Story Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur z-10">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {editingStory ? 'Edit Story' : 'New Article'}
                </h3>
                <p className="text-xs text-slate-500">
                  Draft or publish news dispatches and field reflections.
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
                  Article Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Grassroots Youth Skills Workshop Dispatch"
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
                    placeholder="article-slug-title"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-hope-blue"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-hope-blue"
                  >
                    {STORY_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Summary / Excerpt *
                </label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="A concise synopsis shown on story cards and search previews..."
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-hope-blue ${
                    formErrors.excerpt ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {formErrors.excerpt && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.excerpt}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Article Content *
                </label>
                <textarea
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter the full article body, reflections, field narrative..."
                  className={`w-full px-3 py-2 border rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-hope-blue ${
                    formErrors.content ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {formErrors.content && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.content}</p>
                )}
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
                    Published Date
                  </label>
                  <input
                    type="date"
                    value={formData.publishedDate}
                    onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-hope-blue"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded text-hope-blue focus:ring-hope-blue border-slate-300"
                  />
                  <span>Publish immediately to public website</span>
                </label>
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
                      {editingStory ? 'Save Changes' : 'Publish Story'}
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
        isOpen={Boolean(deletingStory)}
        title="Delete Story"
        message={`Are you sure you want to delete "${deletingStory?.title}"? This cannot be undone.`}
        confirmLabel="Yes, Delete"
        confirmVariant="danger"
        isLoading={isSaving}
        onConfirm={handleDelete}
        onCancel={() => setDeletingStory(null)}
      />

      {/* Toast feedback */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
};
