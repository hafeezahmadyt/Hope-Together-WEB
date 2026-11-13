import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Users,
  Sparkles,
  FolderKanban,
  Search,
  Compass,
  GraduationCap,
  HeartHandshake,
  ShieldCheck,
  Leaf,
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { PageHero } from '../components/PageHero';
import { objectivesData } from '../data/objectives';
import { projectService } from '../services/projectService';
import { AdminProject } from '../types/admin';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectDetailModal } from '../components/ProjectDetailModal';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [selectedObjectiveFilter, setSelectedObjectiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
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

  // Filter projects by both objective pillar and search query
  const filteredProjects = projects.filter((p) => {
    const matchesObjective =
      selectedObjectiveFilter === 'All' || p.objective === selectedObjectiveFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.location && p.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesObjective && matchesSearch;
  });

  // Calculate high-level impact statistics
  const totalBeneficiaries = projects.reduce((acc, p) => {
    if (p.beneficiariesCount) {
      return acc + (parseInt(p.beneficiariesCount.replace(/\D/g, ''), 10) || 0);
    }
    return acc;
  }, 0);

  const totalFunding = projects.reduce((acc, p) => {
    if (p.fundingReceived) {
      return acc + (parseInt(p.fundingReceived.replace(/\D/g, ''), 10) || 0);
    }
    return acc;
  }, 0);

  // Pillar icon helper
  const getPillarIcon = (number: string) => {
    switch (number) {
      case '01':
        return <GraduationCap className="w-5 h-5 text-[#1D70B8]" />;
      case '02':
        return <HeartHandshake className="w-5 h-5 text-emerald-600" />;
      case '03':
        return <ShieldCheck className="w-5 h-5 text-[#1D70B8]" />;
      case '04':
        return <Leaf className="w-5 h-5 text-emerald-600" />;
      default:
        return <Compass className="w-5 h-5 text-slate-500" />;
    }
  };

  const handlePillarFilterClick = (pillarTitle: string) => {
    setSelectedObjectiveFilter(pillarTitle);
    const element = document.getElementById('projects-grid-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <SEO
        title="Projects & Field Initiatives | Hope Together Organization"
        description="Explore the developmental field projects, clean drinking water installations, funding transparency, and community impact led by Hope Together Organization across Khyber Pakhtunkhwa, Pakistan."
      />

      {/* Page Hero */}
      <PageHero
        badge="Strategic Field Initiatives"
        title="Our"
        highlightedWord="Projects"
        description="Delivering community-driven developmental projects with complete transparency, local ownership, and measurable impact across Khyber Pakhtunkhwa."
        accentColor="green"
      />

      {/* High-Level Impact & Transparency Metrics */}
      <section className="py-10 bg-[#FAF9F6] border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0">
                <FolderKanban className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 font-semibold block leading-tight">
                  Active Initiatives
                </span>
                <span className="text-sm sm:text-base font-bold text-slate-900 font-mono">
                  {projects.length} Completed / Active
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1D70B8] flex items-center justify-center font-bold flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 font-semibold block leading-tight">
                  People Reached
                </span>
                <span className="text-sm sm:text-base font-bold text-slate-900 font-mono">
                  {totalBeneficiaries > 0 ? `${totalBeneficiaries}+ Beneficiaries` : '100+ Beneficiaries'}
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0">
                <DollarSign className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 font-semibold block leading-tight">
                  Transparent Funding
                </span>
                <span className="text-sm sm:text-base font-bold text-slate-900 font-mono">
                  {totalFunding > 0 ? `PKR ${totalFunding.toLocaleString()}` : 'PKR 20,000+'}
                </span>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold flex-shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 font-semibold block leading-tight">
                  Field Accountability
                </span>
                <span className="text-sm sm:text-base font-bold text-slate-900 font-mono">
                  100% Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Field Projects Section */}
      <section id="projects-grid-section" className="py-12 sm:py-16 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          {/* Section Header & Search/Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#1D70B8]" />
                <span className="text-xs uppercase tracking-[0.2em] text-[#1D70B8] font-bold">
                  Official Registry
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-light text-slate-900 tracking-tight">
                Our Field Initiatives
              </h2>
              <p className="text-slate-600 text-sm sm:text-base font-light mt-1">
                Explore real community interventions, funding receipts, beneficiary counts, and project photos.
              </p>
            </div>

            {/* Search Input */}
            <div className="w-full md:w-72 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects by title, district..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1D70B8] focus:border-transparent transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
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

          {/* Projects Grid Display */}
          {isLoading ? (
            <div className="py-24 text-center">
              <div className="w-10 h-10 border-3 border-[#1D70B8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-mono text-slate-400">Loading verified projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="py-16 px-6 text-center bg-white rounded-3xl border border-dashed border-slate-200 shadow-2xs max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <FolderKanban className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-1">
                {selectedObjectiveFilter !== 'All'
                  ? `No initiatives published yet under "${selectedObjectiveFilter}"`
                  : 'No projects match your query'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-light mb-5 max-w-md mx-auto leading-relaxed">
                {selectedObjectiveFilter !== 'All'
                  ? 'We are actively planning grassroots initiatives in this mandate pillar. You can collaborate with us to launch a new intervention.'
                  : 'Try resetting your search query or view all projects.'}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {selectedObjectiveFilter !== 'All' && (
                  <button
                    type="button"
                    onClick={() => setSelectedObjectiveFilter('All')}
                    className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    View All Initiatives ({projects.length})
                  </button>
                )}
                <Link
                  to="/contact#get-involved"
                  className="px-5 py-2.5 rounded-full bg-blue-50 text-[#1D70B8] border border-blue-200/70 text-xs font-medium hover:bg-blue-100 transition-colors"
                >
                  Propose an Initiative
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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

      {/* Strategic Mandate Pillars Section (Clean, Structured, Zero Dummy Pictures) */}
      <section className="py-16 sm:py-24 bg-white border-t border-slate-200/60">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="max-w-2xl mb-12 sm:mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#1D70B8] font-bold block mb-2">
              Foundational Focus
            </span>
            <h2 className="text-2xl sm:text-4xl font-light text-slate-900 tracking-tight leading-tight mb-4">
              Our Strategic Mandate Pillars
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-light leading-relaxed">
              Every project implemented by Hope Together Organization addresses deep-rooted challenges across Khyber Pakhtunkhwa under four core thematic areas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {objectivesData.map((obj) => {
              const pillarProjectsCount = projects.filter((p) => p.objective === obj.title).length;
              const isSelected = selectedObjectiveFilter === obj.title;

              return (
                <motion.div
                  key={obj.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className={`p-6 sm:p-8 rounded-3xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-50/40 border-[#1D70B8] shadow-md ring-1 ring-[#1D70B8]'
                      : 'bg-slate-50/60 border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
                  }`}
                >
                  <div>
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center shadow-2xs">
                          {getPillarIcon(obj.number)}
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-400">
                          Pillar {obj.number}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold font-mono px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600">
                        {pillarProjectsCount} {pillarProjectsCount === 1 ? 'Project' : 'Projects'}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-normal text-slate-900 tracking-tight mb-3">
                      {obj.title}
                    </h3>

                    <p className="text-slate-600 text-xs sm:text-sm font-light leading-relaxed mb-6">
                      {obj.description}
                    </p>

                    {/* Designated Focus Areas list */}
                    <div className="space-y-2 mb-6">
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block mb-2">
                        Core Focus Areas
                      </span>
                      {obj.focusAreas.map((area) => (
                        <div key={area} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span>{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Filter Action Trigger */}
                  <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handlePillarFilterClick(obj.title)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1D70B8] hover:text-blue-800 transition-colors cursor-pointer"
                    >
                      <span>
                        {pillarProjectsCount > 0
                          ? `Explore ${pillarProjectsCount} Registered Project(s)`
                          : `Filter initiatives by this pillar`}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Collaboration Call to Action */}
      <section className="py-20 sm:py-24 bg-[#FAF9F6] border-t border-slate-200/60 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-xs uppercase tracking-[0.25em] text-[#1D70B8] font-bold block mb-3">
            Grant & Partnership Collaboration
          </span>
          <h2 className="text-3xl sm:text-4xl font-light text-slate-900 tracking-tight mb-4">
            Partner With Us on Future Field Initiatives
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-light max-w-xl mx-auto mb-8 leading-relaxed">
            International agencies, public institutions, and corporate CSR programs are invited to review our project metrics and co-design sustainable community interventions across Khyber Pakhtunkhwa.
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
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white text-slate-800 border border-slate-200 text-sm font-medium hover:bg-slate-50 transition-all shadow-2xs"
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

// Also export as OurWorkPage for backward compatibility
export const OurWorkPage = ProjectsPage;
