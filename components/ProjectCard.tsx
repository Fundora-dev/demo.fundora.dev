import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Project, ProjectCategory } from '../types';
import { ProgressBar } from './ProgressBar';
import { DEFAULT_PROJECT_IMAGE, PROJECT_CATEGORY_DISPLAY_NAMES } from '../constants';
import { usePointerParallax } from '../hooks/usePointerParallax';

// SVG Icons
const CalendarDaysIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-4 h-4"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-3.75h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
  </svg>
);

const TagIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-3 h-3"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
  </svg>
);

const AcademicCapIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-4 h-4"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5z" />
  </svg>
);


interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const { parallaxStyle, onPointerMove, onPointerEnter, onPointerLeave } = usePointerParallax();

  const calculateTimeLeft = useCallback(() => {
    const difference = +new Date(project.deadline) - +new Date();
    if (difference <= 0) return "募集終了";

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);

    let parts: string[] = [];
    if (days > 0) parts.push(`${days}日`);
    if (hours > 0 || (days > 0 && (minutes > 0 || hours >0))) parts.push(`${hours}時間`);
    if (days === 0 && (hours > 0 || minutes >0)) parts.push(`${minutes}分`);

    return parts.length > 0 ? `残り ${parts.join(' ')}` : "まもなく終了";
  }, [project.deadline]);

  useEffect(() => {
    if (new Date(project.deadline) <= new Date()) {
      setTimeLeft("募集終了");
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); 
    setTimeLeft(calculateTimeLeft()); 
    return () => clearInterval(timer);
  }, [project.deadline, calculateTimeLeft]);

  const deadlineDate = new Date(project.deadline);
  const formattedDeadline = `${deadlineDate.getFullYear()}/${String(deadlineDate.getMonth() + 1).padStart(2, '0')}/${String(deadlineDate.getDate()).padStart(2, '0')}`;
  
  const cardClasses = `
    bg-slate-50/60 backdrop-blur-xl backdrop-saturate-150 
    border border-slate-900/10 
    shadow-xl shadow-slate-900/5 
    rounded-[24px] 
    overflow-hidden transform transition-transform,transition-shadow duration-150 ease-in-out 
    group-hover:scale-[0.97] group-hover:shadow-2xl group-hover:shadow-slate-900/10
    h-full flex flex-col
  `;

  return (
    <Link 
      to={`/projects/${project.id}`} 
      className="block group"
      style={parallaxStyle}
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <div className={cardClasses.replace(/\s\s+/g, ' ').trim()}>
        <img 
          src={project.imageUrl || DEFAULT_PROJECT_IMAGE} 
          alt={project.title} 
          className="w-full h-48 object-cover" 
          onError={(e) => (e.currentTarget.src = DEFAULT_PROJECT_IMAGE)}
        />
        <div className="p-5 flex flex-col flex-grow text-slate-800">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#0A6CFF]/10 text-[#0052CC] mb-2.5 self-start backdrop-blur-sm border border-[#0A6CFF]/20">
            <TagIcon className="inline-block mr-1.5 align-middle w-3 h-3" /> 
            {PROJECT_CATEGORY_DISPLAY_NAMES[project.category] || project.category}
          </span>
          <h3 className="text-xl font-semibold text-[#0A6CFF] mb-2 group-hover:text-[#0047b3] transition-colors duration-150 truncate" title={project.title}>
            {project.title}
          </h3>
          <p className="text-sm text-slate-600 mb-3 h-10 overflow-hidden text-ellipsis">
            {project.tagline}
          </p>
          
          <div className="mt-auto">
            <ProgressBar current={project.currentFunding} goal={project.fundingGoal} />
            <div className="flex justify-between items-end mt-4 text-sm text-slate-600">
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center">
                  <img src={project.ownerAvatar} alt={project.ownerName} className="w-6 h-6 rounded-full mr-2 flex-shrink-0 border border-slate-900/10"/>
                  <span className="truncate text-slate-700 group-hover:text-[#0A6CFF]" title={project.ownerName}>{project.ownerName}</span>
                </div>
                {project.affiliation && (
                  <div className="flex items-center mt-0.5 text-xs text-slate-500">
                    <AcademicCapIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span className="truncate" title={project.affiliation}>{project.affiliation}</span>
                  </div>
                )}
              </div>
              <div className="text-right text-xs flex-shrink-0">
                <div className="flex items-center justify-end text-[#8B5CF6] group-hover:text-[#6D28D9]">
                  <CalendarDaysIcon className="mr-1 h-3.5 w-3.5 flex-shrink-0" />
                  <span>締切: {formattedDeadline}</span>
                </div>
                <div className="mt-0.5 text-slate-600">{timeLeft}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};