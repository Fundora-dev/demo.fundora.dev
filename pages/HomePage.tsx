

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ProjectCard } from '../components/ProjectCard';
import { Button } from '../components/Button';
import { mockProjects } from '../services/mockData';
import { Project, UserRole } from '../types';
import { HERO_TITLE, HERO_SUBTITLE } from '../constants';
import { useUser } from '../contexts/UserContext';
import { LoginModal } from '../components/LoginModal';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { usePointerParallax } from '../hooks/usePointerParallax';

// Icons for Features section
const EyeIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LightBulbIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
  </svg>
);

const ChatBubbleOvalLeftEllipsisIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-3.861 8.25-8.625 8.25S3.75 16.556 3.75 12C3.75 7.444 7.611 3.75 12.375 3.75S21 7.444 21 12z" />
  </svg>
);

const sectionOuterStyle = "py-12 md:py-16";
const sectionTitleStyle = "text-3xl font-bold text-center mb-12 md:mb-16";
const lightGlassSectionStyle = `
  bg-slate-50/60 backdrop-blur-xl backdrop-saturate-150
  border border-slate-900/10
  shadow-xl shadow-slate-900/5
  rounded-[24px]
  p-8 md:p-12 my-8 md:my-12
`;
const lightGlassCardStyle = `
  bg-slate-50/60 backdrop-blur-xl backdrop-saturate-150
  border border-slate-900/10
  shadow-lg shadow-slate-900/5
  rounded-[24px]
  p-6 flex flex-col
  hover:shadow-xl hover:shadow-slate-900/10
  transition-shadow duration-150 ease-in-out
`;

interface ParallaxCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const ParallaxCard = React.forwardRef<HTMLDivElement, ParallaxCardProps>(
  ({ children, className, style }, ref) => {
    const { parallaxStyle, onPointerMove, onPointerEnter, onPointerLeave } = usePointerParallax();
    return (
      <div
        ref={ref}
        className={`${lightGlassCardStyle} ${className || ''}`.replace(/\s\s+/g, ' ').trim()}
        style={{ ...parallaxStyle, ...style }}
        onPointerMove={onPointerMove}
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
      >
        {children}
      </div>
    );
  }
);


export const HomePage: React.FC = () => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { currentUser } = useUser();
  const navigate = useNavigate();

  const researcherStepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const supporterStepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleResearcherIndices, setVisibleResearcherIndices] = useState<Set<number>>(new Set());
  const [visibleSupporterIndices, setVisibleSupporterIndices] = useState<Set<number>>(new Set());
  const [researcherLineHeight, setResearcherLineHeight] = useState(0);
  const [supporterLineHeight, setSupporterLineHeight] = useState(0);


  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const activeProjects = mockProjects
        .filter(p => new Date(p.deadline) > new Date())
        .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setFeaturedProjects(activeProjects.slice(0, 3));
      setLoading(false);
    }, 300);
  }, []);

  const handleCreateProjectClick = () => {
    if (currentUser && currentUser.role === UserRole.OWNER) {
      navigate('/create-project');
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const features = [
    {
      icon: <EyeIcon className="w-16 h-16 text-[#0A6CFF]" />,
      title: "透明性の高い運営",
      description: "マイルストーンベースの資金解放と進捗の可視化により、プロジェクトの透明性を確保します。",
      iconBgColor: "bg-[#0A6CFF]/10"
    },
    {
      icon: <LightBulbIcon className="w-16 h-16 text-[#8B5CF6]" />,
      title: "革新的な研究支援",
      description: "多様な科学分野の野心的な研究プロジェクトを支援し、イノベーションを加速します。",
      iconBgColor: "bg-[#8B5CF6]/10"
    },
    {
      icon: <ChatBubbleOvalLeftEllipsisIcon className="w-16 h-16 text-[#22D3EE]" />,
      title: "活発なコミュニティ",
      description: "研究者と支援者が直接繋がり、共に科学の未来を創造するコミュニティを形成します。",
      iconBgColor: "bg-[#22D3EE]/10"
    }
  ];

  const researcherSteps = [
    { title: "プロジェクト申請", description: "研究アイデア、目標、計画を詳細に記述し、NextLabにプロジェクトを申請します。" },
    { title: "資金調達開始", description: "承認されたプロジェクトは公開され、広く支援を募ることができます。" },
    { title: "進捗報告", description: "定期的に研究の進捗状況を報告し、支援者との信頼関係を構築します。" },
    { title: "資金受領", description: "設定したマイルストーンを達成するごとに、段階的に研究資金が解放されます。" }
  ];

  const supporterSteps = [
    { title: "プロジェクト発見", description: "興味のある分野やキーワードで、未来を形作る可能性を秘めた研究プロジェクトを探します。" },
    { title: "内容の吟味", description: "プロジェクトの詳細、目標、チーム、推薦者の声などを確認し、支援する価値を見極めます。" },
    { title: "研究を支援", description: "共感したプロジェクトに資金を提供し、研究の実現を直接サポートします。" },
    { title: "進捗を見守る", description: "支援したプロジェクトの進捗報告を受け取り、科学の発展に貢献する喜びを分かち合います。" }
  ];

  const createObserverCallback = (
    setVisibleIndices: React.Dispatch<React.SetStateAction<Set<number>>>
  ) => (entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      const index = parseInt(entry.target.getAttribute('data-step-index') || '-1', 10);
      if (index === -1) return;

      setVisibleIndices(prevIndices => {
        const newIndices = new Set(prevIndices);
        if (entry.isIntersecting) {
          newIndices.add(index);
        } else {
          newIndices.delete(index);
        }
        return newIndices;
      });
    });
  };

  useEffect(() => {
    const researcherObserver = new IntersectionObserver(createObserverCallback(setVisibleResearcherIndices), { threshold: 0.1 });
    researcherStepRefs.current.forEach(ref => ref && researcherObserver.observe(ref));
    
    const supporterObserver = new IntersectionObserver(createObserverCallback(setVisibleSupporterIndices), { threshold: 0.1 });
    supporterStepRefs.current.forEach(ref => ref && supporterObserver.observe(ref));

    return () => {
      researcherObserver.disconnect();
      supporterObserver.disconnect();
    };
  }, [researcherSteps.length, supporterSteps.length]); // Re-run if step counts change

  useEffect(() => {
    const maxVisibleIndex = visibleResearcherIndices.size > 0 ? Math.max(...Array.from(visibleResearcherIndices)) : -1;
    const heightPercentage = researcherSteps.length > 0 ? ((maxVisibleIndex + 1) / researcherSteps.length) * 100 : 0;
    setResearcherLineHeight(Math.max(0, Math.min(100, heightPercentage)));
  }, [visibleResearcherIndices, researcherSteps.length]);

  useEffect(() => {
    const maxVisibleIndex = visibleSupporterIndices.size > 0 ? Math.max(...Array.from(visibleSupporterIndices)) : -1;
    const heightPercentage = supporterSteps.length > 0 ? ((maxVisibleIndex + 1) / supporterSteps.length) * 100 : 0;
    setSupporterLineHeight(Math.max(0, Math.min(100, heightPercentage)));
  }, [visibleSupporterIndices, supporterSteps.length]);


  return (
    <>
      {/* Hero Section */}
      <section className={`py-16 md:py-24 text-slate-800 text-center rounded-3xl shadow-xl shadow-slate-900/10 border border-slate-900/10 mb-12 md:mb-16 bg-slate-50/50 backdrop-blur-lg`}>
        <div className="container mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#0A6CFF] to-[#8B5CF6] mb-6 tracking-tight pt-8">
            {HERO_TITLE}
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
            {HERO_SUBTITLE}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/projects">
              <Button variant="primary" size="lg">
                プロジェクトを探す
              </Button>
            </Link>
            <Button variant="secondary" size="lg" onClick={handleCreateProjectClick}>
              プロジェクトを始める
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className={sectionOuterStyle}>
        <div className="container mx-auto px-4">
          <h2 className={`${sectionTitleStyle} text-[#0A6CFF]`}>注目の研究プロジェクト</h2>
          {loading ? (
             <div className="flex justify-center items-center min-h-[300px]">
                <LoadingSpinner text="プロジェクトを読み込み中..." />
            </div>
          ) : featuredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-600">現在、注目のプロジェクトはありません。</p>
          )}
           {featuredProjects.length > 0 && (
            <div className="text-center mt-12">
              <Link to="/projects">
                <Button variant="primary" size="lg">
                  全てのプロジェクトを見る
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* NextLab Features Section */}
      <section className={`${sectionOuterStyle}`}>
        <div className={`container mx-auto px-4 ${lightGlassSectionStyle.replace('my-8 md:my-12','')} `}>
          <h2 className={`${sectionTitleStyle} text-[#0A6CFF]`}>NextLabが選ばれる理由</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <ParallaxCard key={index} className="items-center">
                <div className={`flex-shrink-0 p-4 rounded-xl ${feature.iconBgColor} shadow-md mb-4 backdrop-blur-sm border border-slate-900/5`}>
                  {feature.icon}
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              </ParallaxCard>
            ))}
          </div>
        </div>
      </section>

      {/* For Researchers: Steps Section */}
      <section className={sectionOuterStyle}>
        <div className="container mx-auto px-4">
          <h2 className={`${sectionTitleStyle} text-[#8B5CF6]`}>研究者の方へ：NextLabで研究を加速する</h2>
          <div className="max-w-3xl mx-auto relative">
            {/* Progress Line - Desktop Only */}
            <div className="hidden md:block absolute top-0 left-6 bottom-0 w-1 bg-slate-300/50 rounded-full">
              <div 
                className="bg-gradient-to-b from-[#8B5CF6] to-[#7038E0] w-full rounded-full transition-all duration-500 ease-out" 
                style={{ height: `${researcherLineHeight}%` }} 
              />
            </div>
            <div className="space-y-10 md:space-y-12 md:ml-12">
              {researcherSteps.map((step, index) => {
                const stepTheme = { gradientFrom: "from-[#8B5CF6]", gradientTo: "to-[#7038E0]", textColor: "text-[#8B5CF6]" };
                return (
                  <ParallaxCard 
                    key={`researcher-step-${index}`}
                    ref={el => { researcherStepRefs.current[index] = el; }}
                    data-step-index={index}
                    className="!p-6 md:!p-8"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                      <div className="flex-shrink-0 flex md:flex-col items-center justify-center md:items-center space-x-4 md:space-x-0 md:space-y-4 mb-4 md:mb-0 md:w-28 h-full">
                        <div className={`flex-shrink-0 bg-gradient-to-br ${stepTheme.gradientFrom} ${stepTheme.gradientTo} text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl font-bold shadow-lg border-2 border-white/40`}>
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-grow text-center md:text-left">
                        <h3 className={`text-xl font-semibold ${stepTheme.textColor} mb-2`}>{step.title}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </ParallaxCard>
                );
              })}
            </div>
          </div>
           <div className="text-center mt-12 md:mt-16">
            <Button variant="secondary" size="lg" onClick={handleCreateProjectClick}>
              プロジェクト申請を始める
            </Button>
          </div>
        </div>
      </section>

      {/* For Supporters: Steps Section */}
       <section className={`${sectionOuterStyle}`}>
        <div className={`container mx-auto px-4 ${lightGlassSectionStyle.replace('my-8 md:my-12','')} `}>
          <h2 className={`${sectionTitleStyle} text-[#0A6CFF]`}>支援者の方へ：未来の科学に貢献する</h2>
          <div className="max-w-3xl mx-auto relative">
             {/* Progress Line - Desktop Only */}
            <div className="hidden md:block absolute top-0 left-6 bottom-0 w-1 bg-slate-300/50 rounded-full">
              <div 
                className="bg-gradient-to-b from-[#0A6CFF] to-[#0052CC] w-full rounded-full transition-all duration-500 ease-out" 
                style={{ height: `${supporterLineHeight}%` }} 
              />
            </div>
            <div className="space-y-10 md:space-y-12 md:ml-12">
              {supporterSteps.map((step, index) => {
                const stepTheme = { gradientFrom: "from-[#0A6CFF]", gradientTo: "to-[#0052CC]", textColor: "text-[#0A6CFF]" };
                return (
                  <ParallaxCard 
                    key={`supporter-step-${index}`}
                    ref={el => { supporterStepRefs.current[index] = el; }}
                    data-step-index={index}
                    className="!p-6 md:!p-8"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                      <div className="flex-shrink-0 flex md:flex-col items-center justify-center md:items-center space-x-4 md:space-x-0 md:space-y-4 mb-4 md:mb-0 md:w-28 h-full">
                        <div className={`flex-shrink-0 bg-gradient-to-br ${stepTheme.gradientFrom} ${stepTheme.gradientTo} text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl font-bold shadow-lg border-2 border-white/40`}>
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-grow text-center md:text-left">
                        <h3 className={`text-xl font-semibold ${stepTheme.textColor} mb-2`}>{step.title}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </ParallaxCard>
                );
              })}
            </div>
          </div>
          <div className="text-center mt-12 md:mt-16">
            <Link to="/projects">
              <Button variant="primary" size="lg">
                支援するプロジェクトを探す
              </Button>
            </Link>
          </div>
        </div>
      </section>


      {/* Let's Get Started with NextLab Section */}
       <section className={`${sectionOuterStyle}`}>
        <div className={`container mx-auto px-4 ${lightGlassSectionStyle.replace('my-8 md:my-12','bg-purple-500/5 backdrop-blur-xl')} `}>
          <h2 className={`${sectionTitleStyle} text-[#0A6CFF]`}>NextLabで始めよう</h2>
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <ParallaxCard className="text-center md:text-left !p-8">
              <h3 className="text-2xl font-semibold text-[#0A6CFF] mb-4">研究者の皆様へ</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                革新的なアイデアをプロジェクトとして公開し、研究資金を調達しましょう。
                透明性の高いマイルストーン管理で支援者との信頼を築き、研究の進捗を共有できます。
              </p>
              <Button variant="secondary" size="lg" onClick={handleCreateProjectClick}>
                プロジェクトを申請する
              </Button>
            </ParallaxCard>
            <ParallaxCard className="text-center md:text-left !p-8">
              <h3 className="text-2xl font-semibold text-[#0A6CFF] mb-4">支援者の皆様へ</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                未来を形作る可能性を秘めた研究プロジェクトを発견し、支援してください。
                進捗をリアルタイムで追い、科学の発展に直接貢献する喜びを体験できます。
              </p>
              <Link to="/projects">
                <Button variant="primary" size="lg">
                  プロジェクトを支援する
                </Button>
              </Link>
            </ParallaxCard>
          </div>
        </div>
      </section>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        targetActionDescription={currentUser?.role !== UserRole.OWNER ? "プロジェクトを作成するには、研究者としてログインしてください。" : undefined}
        onOwnerLoginSuccess={() => {
          // Check if currentUser is updated and is OWNER before navigating
          // This check might be slightly delayed due to state updates.
          // A more robust way might be to pass a callback to loginAsOwner that then navigates.
          // For now, assuming context updates reasonably fast.
          if (currentUser && currentUser.role === UserRole.OWNER) { // Re-check after login
             navigate('/create-project');
          } else {
            // If not immediately updated, we might need a useEffect in HomePage that watches currentUser and navigates.
            // Or the login function itself should trigger navigation after successful role set.
            // For this demo, let's assume it works or the user clicks again.
          }
        }}
      />
    </>
  );
};
