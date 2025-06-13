
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { getProjectById } from '../services/mockData';
import { Project, Investment, UserRole } from '../types';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { DEFAULT_PROJECT_IMAGE } from '../constants';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { usePointerParallax } from '../hooks/usePointerParallax';

interface EnrichedInvestment extends Investment {
  projectDetails?: Project;
}

const ChartBarIcon: React.FC<{ className?: string }> = ({ className }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

const getProjectStatus = (project: Project): { text: string; colorClass: string } => {
  const isExpired = new Date(project.deadline) <= new Date();
  const isFunded = project.currentFunding >= project.fundingGoal;

  if (!isExpired) {
    if (isFunded) {
      return { text: '目標達成（募集中）', colorClass: 'bg-[#22D3EE]/10 text-[#007A8A] border-[#22D3EE]/30' };
    }
    return { text: '募集中', colorClass: 'bg-[#0A6CFF]/10 text-[#0A6CFF] border-[#0A6CFF]/20' };
  } else {
    if (isFunded) {
      return { text: '目標達成（募集終了）', colorClass: 'bg-[#22D3EE]/20 text-[#006070] border-[#22D3EE]/40' };
    }
    return { text: '募集終了（資金未達）', colorClass: 'bg-red-100/60 text-red-700 border-red-300/40' };
  }
};

const lightGlassCardBase = `
  bg-slate-50/60 backdrop-blur-xl backdrop-saturate-150
  border border-slate-900/10
  shadow-xl shadow-slate-900/5
  rounded-[24px] p-6
  transition-shadow duration-150 ease-in-out
  hover:shadow-2xl hover:shadow-slate-900/10
`;

interface ParallaxWrapperProps {
  children: React.ReactNode;
  className?: string;
  isLink?: boolean;
  to?: string;
}
const ParallaxWrapper: React.FC<ParallaxWrapperProps> = ({ children, className, isLink = false, to }) => {
  const { parallaxStyle, onPointerMove, onPointerEnter, onPointerLeave } = usePointerParallax();

  if (isLink && to) {
    return (
      <Link
        to={to}
        className={`${className || ''}`.replace(/\s\s+/g, ' ').trim()}
        style={parallaxStyle}
        onPointerMove={onPointerMove}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        {children}
      </Link>
    );
  }

  return (
    <div
      className={`${className || ''}`.replace(/\s\s+/g, ' ').trim()}
      style={parallaxStyle}
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </div>
  );
};


export const InvestorDashboardPage: React.FC = () => {
  const { currentUser } = useUser();
  const [investments, setInvestments] = useState<EnrichedInvestment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser && currentUser.role === UserRole.INVESTOR && currentUser.investments) {
      setLoading(true);
      setTimeout(() => {
        const enriched = currentUser.investments!.map(inv => ({
          ...inv,
          projectDetails: getProjectById(inv.projectId),
        }));
        setInvestments(enriched);
        setLoading(false);
      }, 500);
    } else {
      setInvestments([]);
      setLoading(false);
    }
  }, [currentUser]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh]"><LoadingSpinner text="ダッシュボードを読み込み中..." /></div>;
  }

  if (!currentUser || currentUser.role !== UserRole.INVESTOR) {
    return (
      <ParallaxWrapper className={`text-center py-10 ${lightGlassCardBase}`}>
        <h1 className="text-2xl font-semibold text-[#0A6CFF]">アクセスが拒否されました</h1>
        <p className="text-slate-700/80 mt-2">このページを表示するには支援者としてログインする必要があります。</p>
        <Button onClick={() => window.location.hash = '/'} className="mt-4">ホームページへ</Button>
      </ParallaxWrapper>
    );
  }

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const uniqueProjectsCount = new Set(investments.map(inv => inv.projectId)).size;

  const listContainerStyle = `${lightGlassCardBase}`;


  return (
    <div className="space-y-8">
      <header className="pb-6 border-b border-slate-900/10">
        <h1 className="text-3xl font-bold text-[#0A6CFF]">支援者ダッシュボード</h1>
        <p className="text-slate-600">あなたの科学への支援履歴を確認しましょう。</p>
      </header>

       {/* Stats Overview */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ParallaxWrapper className={lightGlassCardBase}>
          <h3 className="text-lg font-semibold text-[#0A6CFF] mb-1">総支援額</h3>
          <p className="text-3xl font-bold text-slate-800">{totalInvested.toLocaleString()}円</p>
        </ParallaxWrapper>
        <ParallaxWrapper className={lightGlassCardBase}>
          <h3 className="text-lg font-semibold text-[#0A6CFF] mb-1">支援したプロジェクト数</h3>
          <p className="text-3xl font-bold text-slate-800">{uniqueProjectsCount}</p>
        </ParallaxWrapper>
         <ParallaxWrapper className={`${lightGlassCardBase} flex flex-col justify-center items-center`}>
           <Link to="/projects">
              <Button variant="secondary" size="lg" leftIcon={<ChartBarIcon />}>
                他のプロジェクトを探す
              </Button>
            </Link>
        </ParallaxWrapper>
      </div>

      {investments.length === 0 ? (
        <ParallaxWrapper className={`text-center py-10 ${lightGlassCardBase}`}>
          <h2 className="text-xl font-semibold text-[#0A6CFF]">まだ支援したプロジェクトがありません！</h2>
          <p className="text-slate-700/80 my-2">プロジェクトを探して、次の科学的ブレークスルーを支援しましょう。</p>
          <Link to="/projects">
            <Button variant="primary" className="mt-2">プロジェクトを探す</Button>
          </Link>
        </ParallaxWrapper>
      ) : (
        <div className={listContainerStyle}>
          <h2 className="text-2xl font-semibold text-[#0A6CFF] mb-6">あなたの支援履歴</h2>
          <div className="space-y-6">
            {investments.map(investment => {
              if (!investment.projectDetails) {
                return (
                  <div key={`${investment.projectId}-${investment.date}`} className={`${lightGlassCardBase} !p-4 animate-pulse`}>
                    <p className="text-slate-500">プロジェクトデータを読み込み中...</p>
                  </div>
                );
              }
              const project = investment.projectDetails;
              const status = getProjectStatus(project);
              return (
                <ParallaxWrapper
                  key={project.id + investment.date}
                  className={`${lightGlassCardBase} !p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4`}
                >
                  <img
                    src={project.imageUrl || DEFAULT_PROJECT_IMAGE}
                    alt={project.title}
                    className="w-full sm:w-32 h-32 sm:h-20 object-cover rounded-lg flex-shrink-0 border border-slate-900/10"
                    onError={(e) => (e.currentTarget.src = DEFAULT_PROJECT_IMAGE)}
                  />
                  <div className="flex-grow">
                    <Link to={`/projects/${project.id}`} className="text-lg font-semibold text-[#0A6CFF] hover:underline block">
                      {project.title}
                    </Link>
                     <span className={`inline-block px-2.5 py-1 my-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${status.colorClass}`}>
                        {status.text}
                      </span>
                    <p className="text-sm text-slate-700 mb-2">
                      支援額: <span className="font-semibold text-[#8B5CF6]">{investment.amount.toLocaleString()}円</span> （{new Date(investment.date).toLocaleDateString('ja-JP')}）
                    </p>
                    <ProgressBar current={project.currentFunding} goal={project.fundingGoal} height="h-2" />
                  </div>
                  <Link to={`/projects/${project.id}`} className="flex-shrink-0 mt-2 sm:mt-0">
                     <Button variant="outline" size="sm">プロジェクトを見る</Button>
                  </Link>
                </ParallaxWrapper>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};