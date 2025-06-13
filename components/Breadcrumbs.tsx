import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { BREADCRUMB_NAMES } from '../constants';
import { getProjectById } from '../services/mockData'; // プロジェクト名取得用
import { Project } from '../types';

// Heroicons
const HomeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 10.707V17.5a1.5 1.5 0 01-1.5 1.5h-3.5a.5.5 0 01-.5-.5V14a1 1 0 00-1-1h-2a1 1 0 00-1 1v3.5a.5.5 0 01-.5-.5h-3.5A1.5 1.5 0 013 17.5V10.707a1 1 0 01.293-.707l7-7z" clipRule="evenodd" />
  </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
  </svg>
);

interface BreadcrumbItem {
  name: string;
  path: string;
  isCurrent: boolean;
}

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const params = useParams<{ projectId?: string }>();
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  useEffect(() => {
    const newCrumbs: BreadcrumbItem[] = [];
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const fromDashboard = location.state?.fromDashboard;

    // Always add Home
    newCrumbs.push({ 
      name: BREADCRUMB_NAMES['/'] || 'ホーム', 
      path: '/', 
      isCurrent: location.pathname === '/' 
    });

    if (location.pathname.startsWith('/projects/') && params.projectId) {
      const projectPath = `/projects/${params.projectId}`;
      const project = getProjectById(params.projectId);
      const projectName = project?.title || params.projectId || 'プロジェクト詳細';

      if (fromDashboard && BREADCRUMB_NAMES['/dashboard/owner']) {
        newCrumbs.push({ name: BREADCRUMB_NAMES['/dashboard/owner'], path: '/dashboard/owner', isCurrent: false });
      } else if (BREADCRUMB_NAMES['/projects']) {
        newCrumbs.push({ name: BREADCRUMB_NAMES['/projects'], path: '/projects', isCurrent: false });
      }
      
      const isEditPage = location.pathname.endsWith('/edit');
      newCrumbs.push({ name: projectName, path: projectPath, isCurrent: !isEditPage });

      if (isEditPage) {
        const editPathKey = `/projects/:projectId/edit`;
        newCrumbs.push({ name: BREADCRUMB_NAMES[editPathKey] || 'プロジェクト編集', path: location.pathname, isCurrent: true });
      }
    } else if (location.pathname === '/projects') {
      if (BREADCRUMB_NAMES['/projects']) {
        newCrumbs.push({ name: BREADCRUMB_NAMES['/projects'], path: '/projects', isCurrent: true });
      }
    } else if (location.pathname === '/create-project') {
      if (BREADCRUMB_NAMES['/dashboard/owner']) {
        newCrumbs.push({ name: BREADCRUMB_NAMES['/dashboard/owner'], path: '/dashboard/owner', isCurrent: false });
      }
      if (BREADCRUMB_NAMES['/create-project']) {
        newCrumbs.push({ name: BREADCRUMB_NAMES['/create-project'], path: '/create-project', isCurrent: true });
      }
    } else if (location.pathname === '/dashboard/owner') {
      if (BREADCRUMB_NAMES['/dashboard/owner']) {
        newCrumbs.push({ name: BREADCRUMB_NAMES['/dashboard/owner'], path: '/dashboard/owner', isCurrent: true });
      }
    } else if (location.pathname === '/dashboard/investor') {
      if (BREADCRUMB_NAMES['/dashboard/investor']) {
        newCrumbs.push({ name: BREADCRUMB_NAMES['/dashboard/investor'], path: '/dashboard/investor', isCurrent: true });
      }
    }

    // If Home is current but there are other crumbs, it shouldn't be current.
    if (newCrumbs.length > 1 && newCrumbs[0].path === '/' && newCrumbs[0].isCurrent) {
      newCrumbs[0].isCurrent = false;
    }
    
    setBreadcrumbs(newCrumbs);
  }, [location.pathname, location.state, params.projectId]);

  if (breadcrumbs.length <= 1 && location.pathname === '/') {
    return null; 
  }

  return (
    <div className="flex items-center space-x-2 mb-4 text-sm text-[#1E1E1E]/70">
      <nav aria-label="パンくずリスト">
        <ol className="flex items-center space-x-1.5 flex-wrap">
          {breadcrumbs.map((crumb, index) => (
            <li key={`${crumb.path}-${index}`} className="flex items-center">
              {index === 0 && crumb.path === '/' && (
                <HomeIcon className="w-4 h-4 mr-1.5 text-[#0A6CFF] flex-shrink-0" />
              )}
              {crumb.isCurrent ? (
                <span className="font-semibold text-[#1E1E1E]" aria-current="page">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  to={crumb.path}
                  state={location.state} // Preserve state for consistent breadcrumb generation on back/forward
                  className="hover:underline text-[#0A6CFF] hover:text-[#0052CC] transition-colors"
                >
                  {crumb.name}
                </Link>
              )}
              {index < breadcrumbs.length - 1 && (
                <ChevronRightIcon className="w-4 h-4 text-[#1E1E1E]/40 ml-1.5" />
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};