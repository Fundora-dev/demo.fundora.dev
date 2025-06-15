import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProjectById, addInvestment } from '../services/mockData';
import { Project, Milestone, ProjectUpdate, MilestoneStatus, ProjectCategory } from '../types';
import { ProgressBar } from '../components/ProgressBar';
import { Button } from '../components/Button';
import { NotFoundPage } from './NotFoundPage';
import { DEFAULT_PROJECT_IMAGE, DEFAULT_AVATAR, PROJECT_CATEGORY_DISPLAY_NAMES } from '../constants';
import { Modal } from '../components/Modal';
import { useUser } from '../contexts/UserContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { usePointerParallax } from '../hooks/usePointerParallax';

// SVG Icons
const CalendarDaysIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-3.75h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
  </svg>
);

const TagIcon: React.FC<{ className?: string }> = ({ className }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-4 h-4"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
  </svg>
);
const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-4 h-4 text-[#22D3EE]"}> {/* Cyan for completed */}
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
  </svg>
);
const ClockIcon: React.FC<{ className?: string }> = ({ className }) => ( 
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-4 h-4 text-amber-500"}> {/* Amber for in-progress */}
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
  </svg>
);
const QuestionMarkCircleIcon: React.FC<{ className?: string }> = ({ className }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-4 h-4 text-slate-400"}> {/* Slate for pending */}
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.06-1.061 3.5 3.5 0 111.06 1.061zM10 15.25a.75.75 0 000-1.5h-.008a.75.75 0 000 1.5H10z" clipRule="evenodd" />
  </svg>
);
const CheckBadgeIcon: React.FC<{ className?: string }> = ({ className }) => ( 
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-4 h-4 text-[#0A6CFF]"}> {/* Primary blue for funding goal met */}
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
  </svg>
);
const AcademicCapIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5z" />
  </svg>
);
const ChatBubbleLeftEllipsisIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-3.861 8.25-8.625 8.25S3.75 16.556 3.75 12C3.75 7.444 7.611 3.75 12.375 3.75S21 7.444 21 12z" />
  </svg>
);

const InformationCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);


const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => {
  const { parallaxStyle, onPointerMove, onPointerEnter, onPointerLeave } = usePointerParallax();
  return (
  <button
    onClick={onClick}
    style={parallaxStyle}
    onPointerMove={onPointerMove}
    onPointerEnter={onPointerEnter}
    onPointerLeave={onPointerLeave}
    className={`px-4 py-3 font-medium text-sm rounded-t-lg transition-all duration-150 ease-in-out relative overflow-hidden
      ${active 
        ? 'bg-[#0A6CFF]/10 backdrop-blur-sm text-[#0A6CFF] border-b-2 border-[#0A6CFF] shadow-xs' 
        : 'text-slate-600 hover:text-[#0A6CFF] hover:bg-slate-900/5'
      }`}
  >
    {children}
  </button>
  );
};

const lightGlassBaseStyle = `
  bg-slate-50/60 backdrop-blur-xl backdrop-saturate-150 
  border border-slate-900/10 
  shadow-xl shadow-slate-900/5 
  rounded-[24px]
`;

export const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null | undefined>(undefined); 
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState<number>(1000); 
  const [activeTab, setActiveTab] = useState<'details' | 'milestones' | 'updates' | 'team'>('details');
  const [timeLeft, setTimeLeft] = useState<string>('');
  const { currentUser } = useUser();
  const navigate = useNavigate();

  const { parallaxStyle: headerParallax, onPointerMove: headerMove, onPointerEnter: headerEnter, onPointerLeave: headerLeave } = usePointerParallax();
  const { parallaxStyle: tabsParallax, onPointerMove: tabsMove, onPointerEnter: tabsEnter, onPointerLeave: tabsLeave } = usePointerParallax();

  const calculateTimeLeft = useCallback(() => {
    if (!project) return "";
    const difference = +new Date(project.deadline) - +new Date();
    
    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      return `残り ${days}日 ${hours}時間 ${minutes}分 ${seconds}秒`;
    } else {
      return "募集終了";
    }
  }, [project]);

  useEffect(() => {
    if (projectId) {
      setTimeout(() => {
        const foundProject = getProjectById(projectId);
        setProject(foundProject);
      }, 300);
    }
  }, [projectId]);
  
  useEffect(() => {
    if (!project || new Date(project.deadline) <= new Date()) {
      setTimeLeft("募集終了");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    setTimeLeft(calculateTimeLeft()); 
    return () => clearInterval(timer);
  }, [project, calculateTimeLeft]);


  const handleInvest = () => {
    if (!currentUser) {
        alert("支援するには支援者としてログインしてください。"); 
        return;
    }
    if (currentUser.role !== '支援者') {
        alert("支援者のみがプロジェクトに資金提供できます。");
        return;
    }
    if (project && investmentAmount > 0) {
        const success = addInvestment(project.id, investmentAmount, currentUser);
        if (success) {
            alert(`${project.title}に${investmentAmount.toLocaleString()}円を支援しました！`);
            const updatedProject = getProjectById(project.id); 
            setProject(updatedProject); 
            setIsInvestModalOpen(false);
        } else {
            alert("支援に失敗しました。もう一度お試しください。");
        }
    }
  };

  if (project === undefined) { 
    return <div className="flex justify-center items-center min-h-[60vh]"><LoadingSpinner text="プロジェクト詳細を読み込み中..." /></div>;
  }

  if (!project) {
    return <NotFoundPage message="お探しのプロジェクトは存在しないか、見つかりませんでした。" />;
  }

  const deadlineDate = new Date(project.deadline);
  const formattedDeadline = deadlineDate.toLocaleString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  const getMilestoneIcon = (status: MilestoneStatus) => {
    switch (status) {
      case MilestoneStatus.FUNDING_GOAL_MET:
        return <CheckBadgeIcon className="w-4 h-4 text-[#0A6CFF] flex-shrink-0" />;
      case MilestoneStatus.COMPLETED:
        return <CheckCircleIcon className="w-4 h-4 text-[#22D3EE] flex-shrink-0" />;
      case MilestoneStatus.IN_PROGRESS:
        return <ClockIcon className="w-4 h-4 text-amber-500 flex-shrink-0" />;
      case MilestoneStatus.PENDING:
      default:
        return <QuestionMarkCircleIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />;
    }
  };

  const NoDataMessage: React.FC<{ message: string }> = ({ message }) => (
    <div className={`flex flex-col items-center justify-center py-10 text-center text-slate-600 ${lightGlassBaseStyle} p-5`}>
      <InformationCircleIcon className="w-12 h-12 text-slate-400 mb-3" />
      <p>{message}</p>
    </div>
  );

  const contentBoxStyle = `${lightGlassBaseStyle} p-5`;

  return (
    <div className="max-w-5xl mx-auto space-y-8 text-slate-800">
      {/* Header Section */}
      <div 
        className={`${lightGlassBaseStyle} p-6 md:p-8`}
        style={headerParallax}
        onPointerMove={headerMove}
        onPointerEnter={headerEnter}
        onPointerLeave={headerLeave}
      >
        <div className="md:flex md:space-x-8">
          <div className="md:w-2/5 mb-6 md:mb-0">
            <img 
              src={project.imageUrl || DEFAULT_PROJECT_IMAGE} 
              alt={project.title} 
              className="w-full h-auto max-h-[400px] object-cover rounded-xl shadow-lg border border-slate-900/10"
              onError={(e) => (e.currentTarget.src = DEFAULT_PROJECT_IMAGE)}
            />
          </div>
          <div className="md:w-3/5">
             <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-[#0A6CFF]/10 text-[#0052CC] mb-3 backdrop-blur-sm border border-[#0A6CFF]/20">
              <TagIcon className="inline-block mr-1.5 align-middle h-4 w-4" /> 
              {PROJECT_CATEGORY_DISPLAY_NAMES[project.category] || project.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-[#0A6CFF] mb-2">{project.title}</h1>
            <p className="text-lg text-slate-600 mb-4">{project.tagline}</p>
            
            <div className="text-sm text-slate-600 mb-3">
              <div className="flex items-center">
                <img src={project.ownerAvatar || DEFAULT_AVATAR} alt={project.ownerName} className="w-8 h-8 rounded-full mr-2.5 border-2 border-slate-900/15"/>
                <span className="text-slate-700">起案者: <Link to="#" className="text-[#0A6CFF] hover:underline font-medium">{project.ownerName}</Link></span>
              </div>
              {project.affiliation && (
                <div className="flex items-center mt-1.5 pl-10"> 
                  <AcademicCapIcon className="w-4 h-4 mr-1.5 text-slate-500" />
                  <span>所属: {project.affiliation}</span>
                </div>
              )}
            </div>
            
            <div className="space-y-3 mb-6">
              <ProgressBar current={project.currentFunding} goal={project.fundingGoal} height="h-4"/>
              <div className="flex justify-between text-sm">
                <p className="text-[#0A6CFF]"><span className="font-semibold text-slate-800">{project.currentFunding.toLocaleString()}円</span> 支援総額</p>
                <p className="text-slate-700"><span className="font-semibold text-slate-800">{project.investorCount}人</span> の支援者</p>
              </div>
              <div className="text-sm text-slate-600">
                  <div className="flex items-center text-[#8B5CF6]">
                    <CalendarDaysIcon className="mr-1.5 h-4 w-4 flex-shrink-0" />
                    <span>終了日時: {formattedDeadline}</span>
                  </div>
                  <div className="mt-1 text-slate-700 font-medium">{timeLeft}</div>
              </div>
            </div>

            <Button size="lg" variant="primary" onClick={() => setIsInvestModalOpen(true)} disabled={new Date(project.deadline) <= new Date()}>
              {new Date(project.deadline) > new Date() ? 'このプロジェクトを支援する' : '資金調達終了'}
            </Button>
            {project.researchPaperUrl && project.researchPaperUrl !== '#' && (
                <Button size="lg" variant="outline" className="ml-3" onClick={() => window.open(project.researchPaperUrl, '_blank')}>
                    研究論文を見る
                </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs for Details, Milestones, Updates, Team */}
      <div 
        className={`${lightGlassBaseStyle}`}
        style={tabsParallax}
        onPointerMove={tabsMove}
        onPointerEnter={tabsEnter}
        onPointerLeave={tabsLeave}
      >
        <div className="border-b border-slate-900/10 flex space-x-1 px-2 pt-2 overflow-x-auto">
          <TabButton active={activeTab === 'details'} onClick={() => setActiveTab('details')}>プロジェクト詳細</TabButton>
          <TabButton active={activeTab === 'milestones'} onClick={() => setActiveTab('milestones')}>マイルストーン</TabButton>
          <TabButton active={activeTab === 'updates'} onClick={() => setActiveTab('updates')}>活動報告</TabButton>
          <TabButton active={activeTab === 'team'} onClick={() => setActiveTab('team')}>チーム</TabButton>
        </div>

        <div className="p-6">
          {activeTab === 'details' && (
            <article className="prose prose-sm sm:prose-base max-w-none text-slate-700 leading-relaxed">
              <h3 className="text-xl font-semibold text-[#0A6CFF] mb-3">このプロジェクトについて</h3>
              <p className="whitespace-pre-line">{project.description}</p>
              {project.videoUrl && (
                <div className="my-6 rounded-xl overflow-hidden shadow-lg border border-slate-900/10 h-[320px]">
                  <iframe 
                    src={project.videoUrl.replace("watch?v=", "embed/")} 
                    title="プロジェクト動画" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              )}
              {project.detailedSections && project.detailedSections.length > 0 ? (
                <div className="mt-8 pt-6 border-t border-slate-900/10">
                  {project.detailedSections.map((section, index) => (
                    <div key={index} className={`mb-6 p-5 ${contentBoxStyle}`}>
                      <h4 className="text-lg font-semibold text-[#0A6CFF] mb-2">{section.title}</h4>
                      <p className="whitespace-pre-line text-slate-700">{section.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                 <NoDataMessage message="追加のプロジェクト情報セクションはまだありません。" />
              )}

              {/* Recommender Section */}
              <div className="mt-10 pt-8 border-t border-slate-900/10">
                <h3 className="text-2xl font-bold text-[#0A6CFF] mb-6 flex items-center">
                    <ChatBubbleLeftEllipsisIcon className="w-7 h-7 mr-2 text-[#8B5CF6]" />
                    推薦者からの推薦文
                </h3>
                <div className={`${contentBoxStyle} p-6`}>
                    <div className="flex items-start space-x-4">
                        <img 
                            src={project.recommenderAvatarUrl} 
                            alt={project.recommenderName} 
                            className="w-16 h-16 rounded-full object-cover flex-shrink-0 border-2 border-[#8B5CF6]/30"
                            onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)} 
                        />
                        <div className="flex-grow">
                            <h4 className="text-xl font-semibold text-[#0A6CFF]">{project.recommenderName}</h4>
                            <p className="text-sm text-[#8B5CF6] font-medium">{project.recommenderTitle}</p>
                            <p className="text-sm text-slate-600 mb-3">{project.recommenderAffiliation}</p>
                        </div>
                    </div>
                    <p className="text-slate-700 whitespace-pre-line mt-4 leading-relaxed">{project.recommenderComment}</p>
                </div>
              </div>

            </article>
          )}

          {activeTab === 'milestones' && (
            <div>
              <h3 className="text-xl font-semibold text-[#0A6CFF] mb-6">プロジェクトのマイルストーン</h3>
              {project.milestones && project.milestones.length > 0 ? (
                <ul className="space-y-4">
                  {project.milestones.map((milestone: Milestone) => (
                    <li key={milestone.id} className={contentBoxStyle}>
                      <div className="flex items-start">
                        <div className="mr-3 mt-1">
                          {getMilestoneIcon(milestone.status)}
                        </div>
                        <div className="flex-grow">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1">
                              <h4 className="font-semibold text-[#0A6CFF]">{milestone.title}</h4>
                              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm border ${
                                  milestone.status === MilestoneStatus.COMPLETED ? 'bg-[#22D3EE]/10 text-[#007A8A] border-[#22D3EE]/30' : 
                                  milestone.status === MilestoneStatus.FUNDING_GOAL_MET ? 'bg-[#0A6CFF]/10 text-[#0A6CFF] border-[#0A6CFF]/30' : 
                                  milestone.status === MilestoneStatus.IN_PROGRESS ? 'bg-amber-400/10 text-amber-700 border-amber-400/30' : 
                                  'bg-slate-200/50 text-slate-600 border-slate-300/60'
                              }`}>{milestone.status}</span>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">{milestone.description}</p>
                          <div className="flex flex-col sm:flex-row justify-between text-xs text-slate-500 mt-2">
                              <span>期限: {new Date(milestone.dueDate).toLocaleDateString('ja-JP')}</span>
                              {milestone.fundingReleasePercentage > 0 && (
                                  <span className="font-medium text-[#8B5CF6]">資金解放: {milestone.fundingReleasePercentage}%</span>
                              )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <NoDataMessage message="まだマイルストーンはありません。" />
              )}
            </div>
          )}

          {activeTab === 'updates' && (
             <div>
              <h3 className="text-xl font-semibold text-[#0A6CFF] mb-4">最新の活動報告</h3>
              {project.updates && project.updates.length > 0 ? (
                <ul className="space-y-6">
                  {project.updates.map((update: ProjectUpdate) => (
                    <li key={update.id} className={contentBoxStyle}>
                      <h4 className="font-semibold text-[#0A6CFF]">{update.title}</h4>
                      <p className="text-xs text-slate-500 mb-2">投稿日: {new Date(update.date).toLocaleDateString('ja-JP')}</p>
                      <p className="text-sm text-slate-700 whitespace-pre-line">{update.content}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <NoDataMessage message="まだ活動報告はありません。" />
              )}
            </div>
          )}

           {activeTab === 'team' && (
             <div>
              <h3 className="text-xl font-semibold text-[#0A6CFF] mb-6">チーム紹介</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(project.team || []).map((member, index) => (
                  <div key={index} className={`${contentBoxStyle} flex flex-col items-center text-center`}>
                    <img 
                      src={member.avatarUrl || DEFAULT_AVATAR} 
                      alt={member.name} 
                      className="w-24 h-24 rounded-full mb-3 object-cover shadow-lg border-2 border-[#0A6CFF]/20"
                      onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
                    />
                    <h4 className="font-semibold text-[#0A6CFF] text-lg">{member.name}</h4>
                    <p className="text-sm text-[#8B5CF6] font-medium mb-1">{member.role}</p>
                    {member.bio && <p className="text-xs text-slate-600">{member.bio}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Investment Modal */}
      <Modal isOpen={isInvestModalOpen} onClose={() => setIsInvestModalOpen(false)} title="このプロジェクトを支援する">
        {currentUser && currentUser.role === '支援者' ? ( 
          <div className="space-y-4">
            <p className="text-slate-700">支援対象プロジェクト: <strong className="text-[#0A6CFF]">{project.title}</strong></p>
            <div>
              <label htmlFor="investmentAmount" className="block text-sm font-medium text-slate-700 mb-1">支援額 (円)</label>
              <input
                type="number"
                id="investmentAmount"
                name="investmentAmount"
                min="1"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/5 backdrop-blur-sm text-slate-900 border border-slate-900/20 focus-visible:ring-2 focus-visible:ring-[#0A6CFF]/50 focus-visible:border-[#0A6CFF]/70 placeholder-slate-500 shadow-sm transition-all"
              />
            </div>
            <p className="text-xs text-slate-500">最小支援額: 1円。これはデモであり、実際の取引は行われません。</p>
            <div className="flex justify-end space-x-3 pt-2">
                <Button 
                    variant="outline" 
                    onClick={() => setIsInvestModalOpen(false)}
                >
                    キャンセル
                </Button>
                <Button 
                    variant="primary" 
                    onClick={handleInvest}
                >
                    支援を確定する
                </Button>
            </div>
          </div>
        ) : (
            <div className="text-center">
                <p className="text-slate-700 mb-4">プロジェクトを支援するには支援者としてログインしてください。</p>
                <Button 
                    variant="primary" 
                    onClick={() => {setIsInvestModalOpen(false); navigate('/')}}
                >
                    ホームページへ
                </Button>
            </div>
        )}
      </Modal>
    </div>
  );
};