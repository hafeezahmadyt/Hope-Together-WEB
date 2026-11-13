import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Layers,
  FileText,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Sparkles,
  FolderKanban,
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { PageHero } from '../components/PageHero';
import { objectivesData } from '../data/objectives';
import { projectService } from '../services/projectService';
import { AdminProject } from '../types/admin';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectDetailModal } from '../components/ProjectDetailModal';

export const ProjectsPage: React.FC = () => {
  const [activeObjectiveId, setActiveObjectiveId] = useState<string | null>(null);
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [selectedObjectiveFilter, setSelectedObjectiveFilter] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<AdminProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadProjects = async () => {
      try {
        const data = await projectService.getProjects();
        if (isMounted) {
          // Public view displays published/completed projects
          setProjects(data.filter((p) => p.status !== 'Draft'));
        }
      } catch {
        // Fallback
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProjects();

    const handleUpdate = () => {
      loadProjects();
    };

    window.addEventListener('hope_together_projects_changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('hope_together_projects_changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const toggleDetails = (id: string) => {
    setActiveObjectiveId((prev) => (prev === id ? null : id));
  };

  const filteredProjects = selectedObjectiveFilter === 'All'
    ? projects
    : projects.filter((p) => p.objective === selectedObjectiveFilter);

  return (
    <>
      <SEO
        title="Projects & Field Initiatives | Hope Together Organization"
        description="Explore the developmental field projects, funding transparency, and community impact led by Hope Together Organization across Khyber Pakhtunkhwa, Pakistan."
      />

      {/* Page Hero */}
      <PageHero
        badge="Strategic Initiatives"
        title="Our"
        highlightedWord="Projects"
        description="Delivering community-driven developmental projects with transparency, local ownership, and measurable impact across Khyber Pakhtunkhwa."
        accentColor="green"
      />

      {/* Context Narrative & High-Level Summary Stats */}
      <section className="py-14 bg-[#FAF9F6] border-b border-slate-200/60">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed mb-6">
            Our initiatives are structured under four strategic mandate pillars, ensuring every project directly addresses localized socio-economic, human rights, and environmental challenges.
          </p>

          {/* Quick Metrics Bar */}
          <div className="inline-flex flex-wrap items-center justify-center gap-6 sm:gap-10 p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <FolderKanban className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block leading-tight">
                  Active Projects
                </span>
                <span className="text-sm font-bold text-slate-900 font-mono">
                  {projects.length} Initiatives
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1D70B8] flex items-center justify-center font-bold">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block leading-tight">
                  Communities Served
                </span>
                <span className="text-sm font-bold text-slate-900 font-mono">
                  Across KP Province
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <DollarSign className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block leading-tight">
                  Grant Accountability
                </span>
                <span className="text-sm font-bold text-slate-900 font-mono">
                  100% Transparent
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs by Thematic Objective */}
      <section className="pt-12 pb-4 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedObjectiveFilter('All')}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedObjectiveFilter === 'All'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
              }`}
            >
              All Pillars ({projects.length})
            </button>
            {objectivesData.map((obj) => {
              const count = projects.filter((p) => p.objective === obj.title).length;
              return (
                <button
                  key={obj.id}
                  type="button"
                  onClick={() => setSelectedObjectiveFilter(obj.title)}
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedObjectiveFilter === obj.title
                      ? 'bg-[#1D70B8] text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  {obj.title} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Editorial Major Sections (Pillars Structure) */}
      <div className="py-12 sm:py-20 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 space-y-20 sm:space-y-28">
          {objectivesData
            .filter((obj) => selectedObjectiveFilter === 'All' || selectedObjectiveFilter === obj.title)
            .map((objective, idx) => {
              const isEven = idx % 2 === 1;
              const isGreen = objective.accentColor === 'green';
              const accentTextClass = isGreen ? 'text-[#16A34A]' : 'text-[#1D70B8]';
              const accentBgClass = isGreen ? 'bg-[#DCFCE7] text-[#15803D]' : 'bg-[#E0F2FE] text-[#0369A1]';
              const isOpen = activeObjectiveId === objective.id;

              // Projects matching this objective pillar
              const objectiveProjects = projects.filter((p) => p.objective === objective.title);
              const featuredProject = objectiveProjects.find((p) => p.coverImageUrl) || objectiveProjects[0];

              return (
                <motion.article
                  key={objective.id}
                  id={objective.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6 }}
                  className="scroll-mt-32 p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/70 shadow-xs"
                >
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center ${
                      isEven ? 'lg:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Text Column */}
                    <div
                      className={`lg:col-span-7 flex flex-col justify-center ${
                        isEven ? 'lg:order-2' : 'lg:order-1'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl sm:text-4xl font-mono font-light text-slate-300">
                          {objective.number}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${accentBgClass}`}
                        >
                          Mandate Pillar
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-4xl font-light text-slate-900 tracking-tight mb-5 leading-tight">
                        {objective.title}
                      </h2>

                      <p className="text-slate-600 text-base sm:text-lg font-light leading-relaxed mb-6">
                        {objective.description}
                      </p>

                      {/* Focus Areas */}
                      <div className="mb-6">
                        <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold block mb-3">
                          Designated Focus Areas
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {objective.focusAreas.map((area) => (
                            <div
                              key={area}
                              className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60"
                            >
                              <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${accentTextClass}`} />
                              <span className="text-xs sm:text-sm font-medium text-slate-700">
                                {area}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Interactive Projects Drawer Trigger */}
                      <div>
                        <button
                          type="button"
                          onClick={() => toggleDetails(objective.id)}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1D70B8] hover:text-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-hope-blue rounded py-1 transition-colors cursor-pointer"
                          aria-expanded={isOpen}
                          aria-controls={`details-${objective.id}`}
                        >
                          <Layers className="w-4 h-4 text-slate-400" />
                          <span>
                            {isOpen
                              ? 'Hide Project Roster'
                              : `Explore Registered Projects (${objectiveProjects.length})`}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              id={`details-${objective.id}`}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden mt-4"
                            >
                              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-600 text-xs sm:text-sm space-y-4">
                                <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                                  <div className="flex items-center gap-2 text-slate-800 font-medium">
                                    <FileText className="w-4 h-4 text-[#1D70B8]" />
                                    <span>Field Projects under {objective.title}</span>
                                  </div>
                                  <span className="text-[11px] font-mono text-slate-400">
                                    Click any project for full funding & beneficiary data
                                  </span>
                                </div>

                                {objectiveProjects.length > 0 ? (
                                  <div className="grid grid-cols-1 gap-3">
                                    {objectiveProjects.map((proj) => (
                                      <div
                                        key={proj.id}
                                        onClick={() => setSelectedProject(proj)}
                                        className="p-4 rounded-2xl bg-white border border-slate-200/70 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className="w-12 h-10 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                                            {proj.coverImageUrl ? (
                                              <img src={proj.coverImageUrl} alt={proj.title} className="w-full h-full object-cover" />
                                            ) : (
                                              <FolderKanban className="w-5 h-5 text-slate-400 m-auto mt-2.5" />
                                            )}
                                          </div>
                                          <div>
                                            <h4 className="font-semibold text-slate-900 group-hover:text-[#1D70B8] transition-colors text-sm">
                                              {proj.title}
                                            </h4>
                                            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                                              <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {proj.location}
                                              </span>
                                              <span className="flex items-center gap-1 font-mono">
                                                <Calendar className="w-3 h-3" />
                                                {proj.startDate}
                                              </span>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Impact Pills */}
                                        <div className="flex items-center gap-2 self-end sm:self-auto flex-shrink-0">
                                          {proj.fundingReceived && (
                                            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold font-mono border border-emerald-200/60 flex items-center gap-1">
                                              <DollarSign className="w-3 h-3" />
                                              {proj.fundingReceived}
                                            </span>
                                          )}
                                          {proj.beneficiariesCount && (
                                            <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#1D70B8] text-xs font-bold font-mono border border-blue-200/60 flex items-center gap-1">
                                              <Users className="w-3 h-3" />
                                              {proj.beneficiariesCount}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="p-4 rounded-xl bg-white border border-dashed border-slate-200 text-center">
                                    <p className="text-xs text-slate-400 font-light">
                                      No field projects currently registered under this pillar.
                                    </p>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Visual Column / Featured Project Photo */}
                    <div className={`lg:col-span-5 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                      <div
                        onClick={() => featuredProject && setSelectedProject(featuredProject)}
                        className={`relative rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/70 p-6 sm:p-8 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[380px] text-center shadow-sm group hover:border-slate-300 transition-all ${
                          featuredProject ? 'cursor-pointer' : ''
                        }`}
                      >
                        {featuredProject?.coverImageUrl ? (
                          <>
                            <img
                              src={featuredProject.coverImageUrl}
                              alt={featuredProject.title}
                              className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                            <div className="absolute bottom-5 inset-x-5 text-left text-white">
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/90 text-white mb-1.5 inline-block">
                                Featured Project
                              </span>
                              <h3 className="text-lg font-bold leading-tight drop-shadow-sm mb-1">
                                {featuredProject.title}
                              </h3>
                              <div className="flex items-center gap-3 text-xs text-slate-200 font-mono">
                                {featuredProject.fundingReceived && (
                                  <span>💰 {featuredProject.fundingReceived}</span>
                                )}
                                {featuredProject.beneficiariesCount && (
                                  <span>👥 {featuredProject.beneficiariesCount}</span>
                                )}
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform mb-4">
                              <FolderKanban className="w-8 h-8 text-slate-400" />
                            </div>
                            <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-1">
                              {objective.title}
                            </span>
                            <p className="text-xs text-slate-400 font-mono max-w-xs leading-relaxed">
                              Official program initiatives and field implementation photos
                            </p>
                            <div className="mt-4 pt-3 border-t border-slate-200 w-full flex items-center justify-center gap-2 text-[11px] text-slate-400">
                              <span>Pillar {objective.number}</span>
                              <span>•</span>
                              <span>Khyber Pakhtunkhwa</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
        </div>
      </div>

      {/* Complete Projects Showcase Cards Grid */}
      <section className="py-20 bg-white border-t border-slate-200/60">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-slate-200/70">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-4 h-4 text-[#1D70B8]" />
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400 font-semibold">
                  Field Gallery
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight">
                All Field Projects & Transparency Records
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Showing {filteredProjects.length} active initiatives
            </span>
          </div>

          {isLoading ? (
            <div className="py-20 text-center text-slate-400 font-mono text-xs">
              Loading projects...
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="py-16 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 p-8">
              <FolderKanban className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-slate-800 mb-1">No projects registered</h3>
              <p className="text-xs text-slate-500 font-light mb-4">
                Projects uploaded through the admin portal will automatically display here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((proj) => (
                <ProjectCard
                  key={proj.id}
                  project={proj}
                  isAdmin={false}
                  onViewDetails={(p) => setSelectedProject(p)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Collaboration Call to Action */}
      <section className="py-20 sm:py-24 bg-[#FAF9F6] border-t border-slate-200/60 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-xs uppercase tracking-[0.25em] text-[#1D70B8] font-semibold block mb-3">
            Collaboration & Grant Inquiries
          </span>
          <h2 className="text-3xl sm:text-4xl font-light text-slate-900 tracking-tight mb-4">
            Partner With Us on These Initiatives
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-light max-w-xl mx-auto mb-8 leading-relaxed">
            International agencies, public institutions, and corporate CSR programs are invited to review our project metrics and co-design sustainable community interventions.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/partners"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-all shadow-sm"
            >
              <span>Explore Partners</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact#get-involved"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-slate-800 border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-all shadow-xs"
            >
              <span>Get Involved</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
        isAdmin={false}
      />
    </>
  );
};

// Also export as OurWorkPage for backward compatibility if any legacy import references it
export const OurWorkPage = ProjectsPage;
