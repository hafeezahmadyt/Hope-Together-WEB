import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Handshake,
  Calendar,
  FolderKanban,
  Newspaper,
  MessageSquare,
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { SEO } from '../../components/SEO';
import { teamService } from '../../services/teamService';
import { partnerService } from '../../services/partnerService';
import { eventService } from '../../services/eventService';
import { projectService } from '../../services/projectService';
import { storyService } from '../../services/storyService';
import { messageService } from '../../services/messageService';
import { activityService } from '../../services/activityService';
import { AdminActivityLog } from '../../types/admin';

interface DashboardCounts {
  teamCount: number;
  partnerCount: number;
  eventCount: number;
  projectCount: number;
  storyCount: number;
  unreadMessageCount: number;
}

export const AdminDashboardPage: React.FC = () => {
  const [counts, setCounts] = useState<DashboardCounts>({
    teamCount: 0,
    partnerCount: 0,
    eventCount: 0,
    projectCount: 0,
    storyCount: 0,
    unreadMessageCount: 0,
  });
  const [activities, setActivities] = useState<AdminActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [team, partners, events, projects, stories, messages, recentActs] =
          await Promise.all([
            teamService.getTeamMembers(),
            partnerService.getPartners(),
            eventService.getEvents(),
            projectService.getProjects(),
            storyService.getStories(),
            messageService.getMessages(),
            activityService.getActivities(),
          ]);

        setCounts({
          teamCount: team.length,
          partnerCount: partners.length,
          eventCount: events.length,
          projectCount: projects.length,
          storyCount: stories.filter((s) => s.isPublished).length,
          unreadMessageCount: messages.filter((m) => m.status === 'Unread').length,
        });
        setActivities(recentActs);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const statCards = [
    {
      label: 'Team Members',
      count: counts.teamCount,
      icon: Users,
      path: '/admin/team',
      color: 'blue',
      description: 'Active personnel & volunteers',
    },
    {
      label: 'Partners',
      count: counts.partnerCount,
      icon: Handshake,
      path: '/admin/partners',
      color: 'green',
      description: 'Community & institutional allies',
    },
    {
      label: 'Events',
      count: counts.eventCount,
      icon: Calendar,
      path: '/admin/events',
      color: 'blue',
      description: 'Workshops & community drives',
    },
    {
      label: 'Projects',
      count: counts.projectCount,
      icon: FolderKanban,
      path: '/admin/projects',
      color: 'green',
      description: 'Initiatives across 4 core objectives',
    },
    {
      label: 'Published Stories',
      count: counts.storyCount,
      icon: Newspaper,
      path: '/admin/stories',
      color: 'blue',
      description: 'Field dispatches & announcements',
    },
    {
      label: 'Unread Messages',
      count: counts.unreadMessageCount,
      icon: MessageSquare,
      path: '/admin/messages',
      color: counts.unreadMessageCount > 0 ? 'amber' : 'slate',
      description: 'Public contact inquiries',
      highlight: counts.unreadMessageCount > 0,
    },
  ];

  const quickActions = [
    { label: 'Add Team Member', path: '/admin/team?action=new', icon: Users },
    { label: 'Add Partner', path: '/admin/partners?action=new', icon: Handshake },
    { label: 'Create Event', path: '/admin/events?action=new', icon: Calendar },
    { label: 'Create Project', path: '/admin/projects?action=new', icon: FolderKanban },
    { label: 'Write Story', path: '/admin/stories?action=new', icon: Newspaper },
  ];

  return (
    <div className="space-y-8">
      <SEO title="Dashboard | Hope Together Admin" />

      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#1D70B8]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-wider uppercase text-sky-200 mb-3 border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Admin Overview</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight">
              Welcome back, Hope Together Administration
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm font-light mt-1 max-w-xl leading-relaxed">
              Manage website content, review contact inquiries, and prepare official documentation for
              the Hope Together Organization public portal.
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              to="/admin/messages"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 text-xs sm:text-sm font-medium hover:bg-slate-100 transition-colors shadow-sm"
            >
              <span>View Inquiries</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
          Content Records Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            const isGreen = card.color === 'green';
            const isAmber = card.color === 'amber';
            const iconBg = isAmber
              ? 'bg-amber-50 text-amber-600'
              : isGreen
              ? 'bg-emerald-50 text-[#16A34A]'
              : 'bg-blue-50 text-[#1D70B8]';

            return (
              <Link
                key={card.label}
                to={card.path}
                className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {card.label}
                    </span>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-light text-slate-900 tracking-tight">
                      {isLoading ? '...' : card.count}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">records</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 group-hover:text-slate-700 transition-colors">
                  <span>{card.description}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Two Column Grid: Quick Actions + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Quick Actions
          </h2>
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2.5">
            {quickActions.map((action) => {
              const ActionIcon = action.icon;
              return (
                <Link
                  key={action.label}
                  to={action.path}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/60 hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-medium transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200/60 flex items-center justify-center text-slate-500 group-hover:text-[#1D70B8] transition-colors">
                      <ActionIcon className="w-3.5 h-3.5" />
                    </div>
                    <span>{action.label}</span>
                  </div>
                  <Plus className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Recent Activity
            </h2>
            <span className="text-xs text-slate-400 font-mono">Audit Log</span>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
            {isLoading ? (
              <p className="text-xs text-slate-400 py-6 text-center">Loading audit log...</p>
            ) : activities.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No recent actions recorded.</p>
            ) : (
              <div className="space-y-4">
                {activities.slice(0, 5).map((act) => (
                  <div
                    key={act.id}
                    className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="text-xs sm:text-sm text-slate-800 font-medium">
                        <span className="capitalize font-semibold text-[#1D70B8]">{act.entity}</span>{' '}
                        <span className="text-slate-500">{act.action}:</span>{' '}
                        <span>"{act.entityTitle}"</span>
                      </p>
                      <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                        by {act.user}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      <span>{act.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
