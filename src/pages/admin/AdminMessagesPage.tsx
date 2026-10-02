import React, { useState, useEffect } from 'react';
import {
  Mail,
  MailOpen,
  Archive,
  Trash2,
  Calendar,
  Phone,
  User,
  ExternalLink,
  X,
  Clock,
  Search,
} from 'lucide-react';
import { SEO } from '../../components/SEO';
import { AdminPageHeader } from '../../components/admin/AdminPageHeader';
import { EmptyState } from '../../components/admin/EmptyState';
import { ConfirmModal } from '../../components/admin/ConfirmModal';
import { Toast, ToastMessage } from '../../components/admin/Toast';
import { messageService } from '../../services/messageService';
import { activityService } from '../../services/activityService';
import { AdminContactMessage, MessageStatus } from '../../types/admin';

export const AdminMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<AdminContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | MessageStatus>('All');

  // Modals
  const [activeMessage, setActiveMessage] = useState<AdminContactMessage | null>(null);
  const [deletingMessage, setDeletingMessage] = useState<AdminContactMessage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const data = await messageService.getMessages();
      setMessages(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleOpenMessage = async (msg: AdminContactMessage) => {
    setActiveMessage(msg);
    if (msg.status === 'Unread') {
      try {
        const updated = await messageService.markAsRead(msg.id);
        setMessages((prev) => prev.map((m) => (m.id === msg.id ? updated : m)));
        setActiveMessage(updated);
        await activityService.logActivity('read', 'Contact Message', `From ${msg.name}`);
      } catch {
        // Fallback
      }
    }
  };

  const handleArchive = async (msg: AdminContactMessage, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const updated = await messageService.archiveMessage(msg.id);
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? updated : m)));
      if (activeMessage?.id === msg.id) {
        setActiveMessage(updated);
      }
      await activityService.logActivity('archived', 'Contact Message', `From ${msg.name}`);
      setToast({ id: String(Date.now()), type: 'info', text: 'Message moved to archive.' });
    } catch {
      setToast({ id: String(Date.now()), type: 'error', text: 'Failed to archive message.' });
    }
  };

  const handleDelete = async () => {
    if (!deletingMessage) return;
    setIsProcessing(true);
    try {
      await messageService.deleteMessage(deletingMessage.id);
      await activityService.logActivity('deleted', 'Contact Message', `From ${deletingMessage.name}`);
      setToast({ id: String(Date.now()), type: 'success', text: 'Message deleted.' });
      if (activeMessage?.id === deletingMessage.id) {
        setActiveMessage(null);
      }
      setDeletingMessage(null);
      loadMessages();
    } catch {
      setToast({ id: String(Date.now()), type: 'error', text: 'Failed to delete message.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const unreadCount = messages.filter((m) => m.status === 'Unread').length;

  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <SEO
        title="Admin: Contact Inquiries | Hope Together Organization"
        description="Review incoming community contact submissions and partnership inquiries."
      />

      <AdminPageHeader
        title="Inquiries & Messages"
        description="Inbound public submissions sent via the Hope Together Organization contact portal."
        action={
          unreadCount > 0 ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-hope-blue text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-hope-blue animate-pulse" />
              {unreadCount} unread {unreadCount === 1 ? 'inquiry' : 'inquiries'}
            </div>
          ) : undefined
        }
      />

      {/* Tabs & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium self-start sm:self-auto">
            <button
              onClick={() => setStatusFilter('All')}
              className={`px-3 py-1.5 rounded-md transition ${
                statusFilter === 'All'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({messages.length})
            </button>
            <button
              onClick={() => setStatusFilter('Unread')}
              className={`px-3 py-1.5 rounded-md transition flex items-center gap-1.5 ${
                statusFilter === 'Unread'
                  ? 'bg-white text-hope-blue shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 bg-hope-blue text-white rounded-full text-[10px]">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setStatusFilter('Read')}
              className={`px-3 py-1.5 rounded-md transition ${
                statusFilter === 'Read'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Read
            </button>
            <button
              onClick={() => setStatusFilter('Archived')}
              className={`px-3 py-1.5 rounded-md transition ${
                statusFilter === 'Archived'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Archived
            </button>
          </div>

          {/* Search box */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sender, email, subject..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hope-blue focus:bg-white transition"
            />
          </div>
        </div>
      </div>

      {/* Messages List / Table */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-hope-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading inbound inquiries...
        </div>
      ) : filteredMessages.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="No inquiries found"
          description={
            searchQuery || statusFilter !== 'All'
              ? 'Try clearing the search query or status filter.'
              : 'New contact form inquiries from visitors will appear here.'
          }
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filteredMessages.map((msg) => {
              const isUnread = msg.status === 'Unread';
              return (
                <div
                  key={msg.id}
                  onClick={() => handleOpenMessage(msg)}
                  className={`p-4 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isUnread
                      ? 'bg-blue-50/40 hover:bg-blue-50/70 border-l-4 border-l-hope-blue'
                      : 'hover:bg-slate-50/80 border-l-4 border-l-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold ${
                        isUnread
                          ? 'bg-blue-100 text-hope-blue font-bold'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {isUnread ? (
                        <Mail className="w-4 h-4 text-hope-blue" />
                      ) : (
                        <MailOpen className="w-4 h-4 text-slate-400" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-sm ${
                            isUnread ? 'font-bold text-slate-900' : 'font-medium text-slate-800'
                          }`}
                        >
                          {msg.name}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          &lt;{msg.email}&gt;
                        </span>
                        {msg.phone && (
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {msg.phone}
                          </span>
                        )}
                        {msg.status === 'Archived' && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600">
                            Archived
                          </span>
                        )}
                      </div>

                      <div
                        className={`text-sm mt-0.5 line-clamp-1 ${
                          isUnread ? 'font-semibold text-slate-900' : 'text-slate-700'
                        }`}
                      >
                        {msg.subject}
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {msg.message}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDate(msg.receivedDate)}
                    </span>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      {msg.status !== 'Archived' && (
                        <button
                          onClick={(e) => handleArchive(msg, e)}
                          title="Archive"
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingMessage(msg);
                        }}
                        title="Delete"
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
            <span>Showing {filteredMessages.length} of {messages.length} inquiries</span>
            <span className="text-slate-400 font-medium">Demo CMS Storage (LocalStorage)</span>
          </div>
        </div>
      )}

      {/* Message Detail Modal */}
      {activeMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div>
                <span className="text-[11px] font-semibold tracking-wider text-hope-blue uppercase">
                  Inbound Inquiry
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {activeMessage.subject}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Received on {formatDate(activeMessage.receivedDate)}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveMessage(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Sender Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-800 text-sm">
                    {activeMessage.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <a
                    href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(
                      activeMessage.subject
                    )}`}
                    className="text-hope-blue hover:underline font-mono"
                  >
                    {activeMessage.email}
                  </a>
                </div>
                {activeMessage.phone && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{activeMessage.phone}</span>
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Message Content
                </label>
                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 text-slate-800 text-sm whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto font-sans">
                  {activeMessage.message}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  {activeMessage.status !== 'Archived' ? (
                    <button
                      onClick={() => handleArchive(activeMessage)}
                      className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 transition flex items-center gap-1.5"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      Archive
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Archived</span>
                  )}
                  <button
                    onClick={() => {
                      setDeletingMessage(activeMessage);
                    }}
                    className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50 transition flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>

                <a
                  href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(
                    activeMessage.subject
                  )}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-hope-blue text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={Boolean(deletingMessage)}
        title="Delete Message"
        message={`Are you sure you want to delete this message from "${deletingMessage?.name}"?`}
        confirmLabel="Yes, Delete"
        confirmVariant="danger"
        isLoading={isProcessing}
        onConfirm={handleDelete}
        onCancel={() => setDeletingMessage(null)}
      />

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
};
