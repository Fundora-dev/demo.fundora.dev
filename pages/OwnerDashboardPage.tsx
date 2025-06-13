
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { getProjectsByOwnerId } from '../services/mockData';
import { Project, UserRole } from '../types';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { usePointerParallax } from '../hooks/usePointerParallax';

const PlusCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-4 h-4"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-4 h-4"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


const lightGlassCardBase = `
  bg-slate-50/60 backdrop-blur-xl backdrop-saturate-150
  border border-slate-900/10
  shadow-xl shadow-slate-900/5
  rounded-[24px] p-6
  transition-shadow duration-150 ease-in-out
  hover:shadow-2xl hover:shadow-slate-900/10
`;

interface ParallaxCardProps {
  children: React.ReactNode;
  className?: string;
  isLink?: boolean;
  to?: string;
}
const ParallaxCard: React.FC<ParallaxCardProps> = ({ children, className, isLink = false, to }) => {
  const { parallaxStyle, onPointerMove, onPointerEnter, onPointerLeave } = usePointerParallax();

  const combinedClasses = `${lightGlassCardBase} ${className || ''}`.replace(/\s\s+/g, ' ').trim();

  if (isLink && to) {
    return (
      <Link
        to={to}
        className={combinedClasses}
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
      className={combinedClasses}
      style={parallaxStyle}
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </div>
  );
};


export const OwnerDashboardPage: React.FC = () => {
  const { currentUser } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser && currentUser.role === UserRole.OWNER) {
      setLoading(true);
      setTimeout(() => {
        setProjects(getProjectsByOwnerId(currentUser.id));
        setLoading(false);
      }, 500);
    } else {
      setProjects([]);
      setLoading(false);
    }
  }, [currentUser]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh]"><LoadingSpinner text="ダッシュボードを読み込み中..." /></div>;
  }

  if (!currentUser || currentUser.role !== UserRole.OWNER) {
    return (
      <div className={`text-center py-10 ${lightGlassCardBase}`}>
        <h1 className="text-2xl font-semibold text-[#0A6CFF]">アクセスが拒否されました</h1>
        <p className="text-slate-700/80 mt-2">このページを表示するには研究者としてログインする必要があります。</p>
        <Button onClick={() => window.location.hash = '/'} className="mt-4">ホームページへ</Button>
      </div>
    );
  }

  const totalFundingGoal = projects.reduce((sum, p) => sum + p.fundingGoal, 0);
  const totalCurrentFunding = projects.reduce((sum, p) => sum + p.currentFunding, 0);

  const listContainerStyle = `${lightGlassCardBase} !p-0 md:!p-6 overflow-hidden`;


  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-center pb-6 border-b border-slate-900/10">
        <div>
            <h1 className="text-3xl font-bold text-[#0A6CFF]">研究者ダッシュボード</h1>
            <p className="text-slate-600">あなたの研究プロジェクトを管理します。</p>
        </div>
        <Link to="/create-project">
          <Button variant="primary" leftIcon={<PlusCircleIcon />}>
            新しいプロジェクトを作成
          </Button>
        </Link>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ParallaxCard>
          <h3 className="text-lg font-semibold text-[#0A6CFF] mb-1">進行中のプロジェクト</h3>
          <p className="text-3xl font-bold text-slate-800">{projects.length}</p>
        </ParallaxCard>
        <ParallaxCard>
          <h3 className="text-lg font-semibold text-[#0A6CFF] mb-1">目標総額</h3>
          <p className="text-3xl font-bold text-slate-800">{totalFundingGoal.toLocaleString()}円</p>
        </ParallaxCard>
        <ParallaxCard>
          <h3 className="text-lg font-semibold text-[#0A6CFF] mb-1">調達総額</h3>
          <p className="text-3xl font-bold text-slate-800">{totalCurrentFunding.toLocaleString()}円</p>
        </ParallaxCard>
      </div>

      {projects.length === 0 ? (
        <ParallaxCard className="text-center py-10">
          <h2 className="text-xl font-semibold text-[#0A6CFF]">まだプロジェクトがありません！</h2>
          <p className="text-slate-700/80 my-2">最初の研究ファンディングキャンペーンを始めましょう。</p>
          <Link to="/create-project">
            <Button variant="secondary" leftIcon={<PlusCircleIcon />} className="mt-2">最初のプロジェクトを作成する</Button>
          </Link>
        </ParallaxCard>
      ) : (
        <div className={listContainerStyle}>
          <h2 className="text-2xl font-semibold text-[#0A6CFF] mb-6 px-6 pt-6 md:px-0 md:pt-0">My Projects</h2>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4 px-4 pb-4">
            {projects.map(project => {
              const daysLeft = Math.max(0, Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
              return (
                <ParallaxCard key={`${project.id}-mobile`} className="!p-4">
                  <Link
                    to={`/projects/${project.id}`}
                    state={{ fromDashboard: true }}
                    className="text-lg font-semibold text-[#0A6CFF] hover:text-[#0052CC] mb-2 block truncate transition-colors"
                  >
                      {project.title}
                  </Link>
                  <div className="mb-3">
                    <ProgressBar current={project.currentFunding} goal={project.fundingGoal} showPercentageText={false} height="h-2.5" />
                    <span className="text-xs text-slate-500 mt-1 block">{project.currentFunding.toLocaleString()}円 / {project.fundingGoal.toLocaleString()}円</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-600 mb-3">
                    <span>支援者数: {project.investorCount}人</span>
                    <span>残り: {daysLeft > 0 ? `${daysLeft}日` : "終了"}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-auto pt-3 border-t border-slate-900/10">
                     <Link to={`/projects/${project.id}`} state={{ fromDashboard: true }} className="flex-1">
                       <Button variant="ghost" size="sm" leftIcon={<EyeIcon className="w-3.5 h-3.5"/>} className="w-full">詳細</Button>
                     </Link>
                     <Link to={`/projects/${project.id}/edit`} state={{ fromDashboard: true }} className="flex-1">
                       <Button variant="outline" size="sm" leftIcon={<EditIcon className="w-3.5 h-3.5"/>} className="w-full">編集</Button>
                     </Link>
                  </div>
                </ParallaxCard>
              );
            })}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-max text-left">
              <thead className="border-b border-slate-900/10">
                <tr>
                  <th className="p-4 text-sm font-semibold text-slate-500">プロジェクト名</th>
                  <th className="p-4 text-sm font-semibold text-slate-500">達成状況</th>
                  <th className="p-4 text-sm font-semibold text-slate-500">支援者数</th>
                  <th className="p-4 text-sm font-semibold text-slate-500">残り日数</th>
                  <th className="p-4 text-sm font-semibold text-slate-500">操作</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(project => {
                  const daysLeft = Math.max(0, Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
                  return (
                    <tr key={project.id} className="border-b border-slate-900/5 hover:bg-slate-50/30 transition-colors duration-150 last:border-b-0">
                      <td className="p-4 text-slate-700">
                        <Link
                          to={`/projects/${project.id}`}
                          state={{ fromDashboard: true }}
                          className="hover:text-[#0A6CFF] font-medium transition-colors"
                        >
                            {project.title}
                        </Link>
                      </td>
                      <td className="p-4 w-1/4">
                        <ProgressBar current={project.currentFunding} goal={project.fundingGoal} showPercentageText={false} />
                        <span className="text-xs text-slate-500 mt-1 block">{project.currentFunding.toLocaleString()}円 / {project.fundingGoal.toLocaleString()}円</span>
                      </td>
                      <td className="p-4 text-slate-600">{project.investorCount}人</td>
                      <td className="p-4 text-slate-600">{daysLeft > 0 ? `${daysLeft}日` : "終了"}</td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                           <Link to={`/projects/${project.id}`} state={{ fromDashboard: true }}>
                             <Button variant="ghost" size="sm" leftIcon={<EyeIcon className="w-3.5 h-3.5"/>}>詳細</Button>
                           </Link>
                           <Link to={`/projects/${project.id}/edit`} state={{ fromDashboard: true }}>
                             <Button variant="outline" size="sm" leftIcon={<EditIcon className="w-3.5 h-3.5"/>}>編集</Button>
                           </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};