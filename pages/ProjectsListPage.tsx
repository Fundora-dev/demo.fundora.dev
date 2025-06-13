
import React, { useState, useMemo } from 'react';
import { ProjectCard } from '../components/ProjectCard';
import { mockProjects } from '../services/mockData';
import { Project, ProjectCategory } from '../types';
import { PROJECT_CATEGORIES_LIST, PROJECT_CATEGORY_DISPLAY_NAMES } from '../constants';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Button } from '../components/Button';

// Search icon
const MagnifyingGlassIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

type ProjectStatusFilter = 'all' | 'active' | 'successful' | 'ended';

const statusFilterOptions: { label: string; value: ProjectStatusFilter }[] = [
  { label: 'すべて', value: 'all' },
  { label: '募集中', value: 'active' },
  { label: '目標達成', value: 'successful' },
  { label: '募集終了', value: 'ended' },
];

export const ProjectsListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'All'>('All');
  const [sortBy, setSortBy] = useState<'deadline' | 'funding' | 'newest'>('newest');
  const [projectStatusFilter, setProjectStatusFilter] = useState<ProjectStatusFilter>('all');
  const [loading, setLoading] = useState(true); 

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const filteredAndSortedProjects = useMemo(() => {
    let projects = [...mockProjects];

    if (selectedCategory !== 'All') {
      projects = projects.filter(p => p.category === selectedCategory);
    }

    if (searchTerm) {
      projects = projects.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (projectStatusFilter !== 'all') {
      projects = projects.filter(p => {
        const isDeadlinePassed = new Date(p.deadline) <= new Date();
        const isGoalReached = p.currentFunding >= p.fundingGoal;

        switch (projectStatusFilter) {
          case 'active':
            return !isDeadlinePassed;
          case 'successful':
            return isGoalReached;
          case 'ended':
            return isDeadlinePassed;
          default:
            return true;
        }
      });
    }

    switch (sortBy) {
      case 'deadline':
        projects.sort((a, b) => {
          const aDeadline = new Date(a.deadline).getTime();
          const bDeadline = new Date(b.deadline).getTime();
          const aIsActive = aDeadline > Date.now();
          const bIsActive = bDeadline > Date.now();
          if (aIsActive && !bIsActive) return -1;
          if (!aIsActive && bIsActive) return 1;
          return aDeadline - bDeadline;
        });
        break;
      case 'funding':
        projects.sort((a, b) => (b.currentFunding / b.fundingGoal) - (a.currentFunding / a.fundingGoal));
        break;
      case 'newest':
      default:
        projects.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
    return projects;
  }, [searchTerm, selectedCategory, sortBy, projectStatusFilter]);

  const commonInputStyle = "px-4 py-2.5 rounded-xl bg-slate-50/70 backdrop-blur-sm text-slate-800 border border-slate-900/15 focus-visible:ring-2 focus-visible:ring-[#0A6CFF]/50 focus-visible:border-[#0A6CFF]/70 placeholder-slate-500 shadow-sm transition-all";
  const filterBarStyle = `
    p-6 bg-slate-50/60 backdrop-blur-xl backdrop-saturate-150 
    border border-slate-900/10 
    shadow-xl shadow-slate-900/5 
    rounded-[24px] space-y-4
  `;
   const headerStyle = `
    py-10 bg-slate-50/50 backdrop-blur-lg 
    rounded-3xl shadow-xl shadow-slate-900/10 text-center 
    border border-slate-900/10
  `;
  const noResultsBoxStyle = `
    text-center py-20 
    bg-slate-50/60 backdrop-blur-xl backdrop-saturate-150 
    border border-slate-900/10 
    shadow-xl shadow-slate-900/5 
    rounded-[24px]
  `;


  return (
    <div className="space-y-8">
      <header className={headerStyle.replace(/\s\s+/g, ' ').trim()}>
        <h1 className="text-4xl font-extrabold text-[#0A6CFF]">革新的な研究を発見する</h1>
        <p className="mt-2 text-slate-600">あなたを刺激するNextLabプロジェクトを見つけて支援しましょう。</p>
      </header>

      {/* Filters and Search Bar */}
      <div className={filterBarStyle.replace(/\s\s+/g, ' ').trim()}>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:flex-grow">
              <input
                type="text"
                placeholder="プロジェクトを検索..."
                className={`w-full pl-10 pr-4 ${commonInputStyle}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="text-slate-400" />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <select
                className={`w-full sm:w-auto ${commonInputStyle}`}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as ProjectCategory | 'All')}
              >
                <option value="All">すべてのカテゴリ</option>
                {PROJECT_CATEGORIES_LIST.map(catValue => (
                  <option key={catValue} value={catValue}>{PROJECT_CATEGORY_DISPLAY_NAMES[catValue]}</option>
                ))}
              </select>
              <select
                className={`w-full sm:w-auto ${commonInputStyle}`}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'deadline' | 'funding' | 'newest')}
              >
                <option value="newest">並び替え: 新着順</option>
                <option value="deadline">並び替え: 締切順</option>
                <option value="funding">並び替え: 達成率順</option>
              </select>
            </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-2 items-center">
            <span className="text-sm text-slate-700/80 mr-2">ステータス:</span>
            {statusFilterOptions.map(filter => (
            <Button
              key={filter.value}
              variant={projectStatusFilter === filter.value ? 'primary' : 'outline'}
              onClick={() => setProjectStatusFilter(filter.value)}
              size="sm"
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="プロジェクトを取得中..." className="py-20" />
      ) : filteredAndSortedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAndSortedProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className={noResultsBoxStyle.replace(/\s\s+/g, ' ').trim()}>
          <MagnifyingGlassIcon className="w-16 h-16 text-[#0A6CFF]/50 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-[#0A6CFF] mb-2">プロジェクトが見つかりません</h3>
          <p className="text-slate-600">検索語やフィルター条件を変更してみてください。</p>
        </div>
      )}
    </div>
  );
};