
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Project, Milestone, ProjectUpdate, MilestoneStatus, UserRole, MilestoneCompletionRequestData } from '../types';
import { getProjectById, addProjectUpdate, requestMilestoneCompletion } from '../services/mockData';
import { useUser } from '../contexts/UserContext';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { NotFoundPage } from './NotFoundPage';
import { DEFAULT_AVATAR, DEFAULT_PROJECT_IMAGE, PROJECT_CATEGORY_DISPLAY_NAMES } from '../constants';
import { Modal } from '../components/Modal';

// Icons
const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-4 h-4 text-sky-400"}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
  </svg>
);
const ClockIcon: React.FC<{ className?: string }> = ({ className }) => ( 
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-4 h-4 text-amber-500"}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
  </svg>
);
const QuestionMarkCircleIcon: React.FC<{ className?: string }> = ({ className }) => ( 
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-4 h-4 text-slate-400"}>
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.94 6.94a.75.75 0 11-1.06-1.061 3.5 3.5 0 111.06 1.061zM10 15.25a.75.75 0 000-1.5h-.008a.75.75 0 000 1.5H10z" clipRule="evenodd" />
  </svg>
);
const CheckBadgeIcon: React.FC<{ className?: string }> = ({ className }) => ( 
 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-4 h-4 text-blue-500"}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
  </svg>
);
const BellIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
  </svg>
);
const ArrowUpOnSquareStackIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15M9 12l3 3m0 0l3-3m-3 3V2.25" />
  </svg>
);
const DocumentTextIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);
const PhotoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);
const LinkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
  </svg>
);


const sectionBaseStyle = "bg-slate-50/50 backdrop-blur-xl backdrop-saturate-150 border border-slate-900/10 shadow-xl shadow-slate-900/5 rounded-[24px] p-6";
const inputBaseStyle = "w-full px-3.5 py-2.5 rounded-xl bg-slate-50/70 backdrop-blur-sm text-slate-800 border border-slate-900/20 focus-visible:ring-2 focus-visible:ring-[#0A6CFF]/50 focus-visible:border-[#0A6CFF]/70 placeholder-slate-500 shadow-sm transition-all";
const modalInputBaseStyle = "w-full px-3.5 py-2.5 rounded-xl bg-slate-900/5 backdrop-blur-sm text-slate-900 border border-slate-900/20 focus-visible:ring-2 focus-visible:ring-[#0A6CFF]/50 focus-visible:border-[#0A6CFF]/70 placeholder-slate-500 shadow-sm transition-all";
const modalLabelStyle = "block text-sm font-medium text-slate-700 mb-1";


export const ProjectEditPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'milestones' | 'updates'>('milestones');

  // For Project Updates
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateContent, setUpdateContent] = useState('');
  const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false);

  // For Milestone Completion Request
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [completionFormData, setCompletionFormData] = useState<MilestoneCompletionRequestData>({
    reportText: '',
    reportFile: null,
    relatedUrl: '',
    evidenceImage: null,
  });
  const [isSubmittingCompletion, setIsSubmittingCompletion] = useState(false);


  useEffect(() => {
    if (!projectId) {
      setError("プロジェクトIDが指定されていません。");
      setLoading(false);
      return;
    }
    setLoading(true);
    setTimeout(() => { // Simulate API call
      const fetchedProject = getProjectById(projectId);
      if (fetchedProject) {
        if (currentUser && fetchedProject.ownerId === currentUser.id) {
          setProject(fetchedProject);
        } else {
          setError("このプロジェクトを編集する権限がありません。");
        }
      } else {
        setError("プロジェクトが見つかりません。");
      }
      setLoading(false);
    }, 500);
  }, [projectId, currentUser]);

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !updateTitle.trim() || !updateContent.trim()) {
      alert("タイトルと内容を入力してください。");
      return;
    }
    setIsSubmittingUpdate(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API
      const updatedProject = addProjectUpdate(project.id, { title: updateTitle, content: updateContent });
      if (updatedProject) {
        setProject(updatedProject);
        setUpdateTitle('');
        setUpdateContent('');
        alert("活動報告が追加されました！");
      } else {
        throw new Error("Failed to add update");
      }
    } catch (err) {
      alert("活動報告の追加に失敗しました。");
    } finally {
      setIsSubmittingUpdate(false);
    }
  };

  const openCompletionModal = (milestone: Milestone) => {
    if (milestone.status === MilestoneStatus.PENDING || milestone.status === MilestoneStatus.IN_PROGRESS) {
        setSelectedMilestone(milestone);
        setCompletionFormData({ reportText: '', reportFile: null, relatedUrl: '', evidenceImage: null });
        setIsCompletionModalOpen(true);
    } else {
        alert("このマイルストーンは既に達成申請済みまたは完了済みです。");
    }
  };
  
  const handleCompletionFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCompletionFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCompletionFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'reportFile' | 'evidenceImage') => {
    if (e.target.files && e.target.files[0]) {
      setCompletionFormData(prev => ({ ...prev, [fieldName]: e.target.files![0] }));
    } else {
      setCompletionFormData(prev => ({ ...prev, [fieldName]: null }));
    }
  };

  const handleCompletionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !selectedMilestone || !completionFormData.reportText.trim()) {
      alert("報告内容を記載してください。");
      return;
    }
    setIsSubmittingCompletion(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API
      const success = requestMilestoneCompletion(project.id, selectedMilestone.id, {
        reportText: completionFormData.reportText,
        relatedUrl: completionFormData.relatedUrl,
        reportFileName: completionFormData.reportFile?.name,
        evidenceImageName: completionFormData.evidenceImage?.name,
      });
      if (success) {
        const updatedProject = getProjectById(project.id);
        setProject(updatedProject);
        setIsCompletionModalOpen(false);
        setSelectedMilestone(null);
        alert(`マイルストーン「${selectedMilestone.title}」の達成を申請しました！`);
      } else {
        throw new Error("Failed to submit completion request");
      }
    } catch (err) {
      alert("マイルストーン達成申請に失敗しました。");
    } finally {
      setIsSubmittingCompletion(false);
    }
  };

  const getMilestoneStatusIcon = (status: MilestoneStatus) => {
    switch (status) {
      case MilestoneStatus.COMPLETED: return <CheckCircleIcon className="w-5 h-5 text-sky-400" />;
      case MilestoneStatus.FUNDING_GOAL_MET: return <CheckBadgeIcon className="w-5 h-5 text-blue-500" />;
      case MilestoneStatus.IN_PROGRESS: return <ClockIcon className="w-5 h-5 text-amber-500" />;
      case MilestoneStatus.PENDING:
      default: return <QuestionMarkCircleIcon className="w-5 h-5 text-slate-400" />;
    }
  };


  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh]"><LoadingSpinner text="プロジェクト情報を編集中..." /></div>;
  }

  if (error) {
    return <NotFoundPage message={error} />;
  }

  if (!project) {
    return <NotFoundPage message="プロジェクトが見つかりませんでした。" />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="pb-6 border-b border-slate-900/10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
                <h1 className="text-3xl font-bold text-[#0A6CFF]">{project.title}</h1>
                <p className="text-slate-600">プロジェクト管理</p>
            </div>
            <Link to={`/projects/${project.id}`}>
                <Button variant="outline" size="sm" className="mt-3 sm:mt-0">
                    プロジェクト詳細ページへ
                </Button>
            </Link>
        </div>
        <div className="mt-4 flex space-x-1 border-b border-slate-900/10">
            <Button variant={activeTab === 'milestones' ? "primary" : "ghost"} onClick={() => setActiveTab('milestones')} size="sm" className="rounded-b-none">マイルストーン管理</Button>
            <Button variant={activeTab === 'updates' ? "primary" : "ghost"} onClick={() => setActiveTab('updates')} size="sm" className="rounded-b-none">活動報告</Button>
        </div>
      </header>

      {activeTab === 'milestones' && (
        <section className={sectionBaseStyle}>
          <h2 className="text-xl font-semibold text-[#0A6CFF] mb-4">マイルストーンの進捗管理</h2>
          {project.milestones.length > 0 ? (
            <ul className="space-y-4">
              {project.milestones.map(ms => (
                <li key={ms.id} className="p-4 rounded-xl bg-slate-50/50 border border-slate-900/10 shadow-sm backdrop-blur-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="flex-grow mb-2 sm:mb-0">
                        <div className="flex items-center mb-1">
                            {getMilestoneStatusIcon(ms.status)}
                            <h3 className="ml-2 font-semibold text-slate-800">{ms.title}</h3>
                        </div>
                        <p className="text-xs text-slate-600 ml-7">{ms.description}</p>
                        <p className="text-xs text-slate-500 ml-7 mt-0.5">期日: {new Date(ms.dueDate).toLocaleDateString('ja-JP')} - 資金解放: {ms.fundingReleasePercentage}%</p>
                    </div>
                    {(ms.status === MilestoneStatus.PENDING || ms.status === MilestoneStatus.IN_PROGRESS) && ms.title !== "クラウドファンディング達成" && (
                      <Button variant="secondary" size="sm" onClick={() => openCompletionModal(ms)} disabled={ms.completionRequestedAt !== undefined}>
                        {ms.completionRequestedAt ? '申請済み' : '達成を申請する'}
                      </Button>
                    )}
                     {ms.status === MilestoneStatus.FUNDING_GOAL_MET && ms.title === "クラウドファンディング達成" && (
                       <span className="text-xs font-semibold px-2 py-1 bg-green-100/70 text-green-700 rounded-full border border-green-300/50">ファンディング達成済</span>
                     )}
                     {ms.status === MilestoneStatus.COMPLETED && (
                       <span className="text-xs font-semibold px-2 py-1 bg-sky-100/70 text-sky-700 rounded-full border border-sky-300/50">完了済</span>
                     )}
                  </div>
                   {ms.completionRequestedAt && (
                    <div className="mt-2 ml-7 p-2 bg-amber-500/10 border border-amber-500/20 rounded-md text-xs text-amber-700">
                        達成申請日時: {new Date(ms.completionRequestedAt).toLocaleString('ja-JP')}
                        {ms.completionRequestData && (
                           <ul className="list-disc list-inside mt-1 text-xs">
                               <li>報告内容: {ms.completionRequestData.reportText.substring(0,50)}{ms.completionRequestData.reportText.length > 50 ? '...' : ''}</li>
                               {ms.completionRequestData.reportFileName && <li>報告書: {ms.completionRequestData.reportFileName}</li>}
                               {ms.completionRequestData.relatedUrl && <li>関連URL: {ms.completionRequestData.relatedUrl}</li>}
                               {ms.completionRequestData.evidenceImageName && <li>証拠画像: {ms.completionRequestData.evidenceImageName}</li>}
                           </ul>
                        )}
                    </div>
                   )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-600">このプロジェクトにはまだマイルストーンが設定されていません。</p>
          )}
        </section>
      )}

      {activeTab === 'updates' && (
        <section className={sectionBaseStyle}>
          <h2 className="text-xl font-semibold text-[#0A6CFF] mb-4">活動報告を追加する</h2>
          <form onSubmit={handleUpdateSubmit} className="space-y-4">
            <div>
              <label htmlFor="updateTitle" className="block text-sm font-medium text-slate-700 mb-1">タイトル</label>
              <input type="text" id="updateTitle" value={updateTitle} onChange={(e) => setUpdateTitle(e.target.value)} required className={inputBaseStyle}/>
            </div>
            <div>
              <label htmlFor="updateContent" className="block text-sm font-medium text-slate-700 mb-1">内容</label>
              <textarea id="updateContent" value={updateContent} onChange={(e) => setUpdateContent(e.target.value)} required rows={5} className={inputBaseStyle}></textarea>
            </div>
            <Button type="submit" variant="primary" isLoading={isSubmittingUpdate} disabled={isSubmittingUpdate}>
              活動報告を投稿
            </Button>
          </form>
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-[#0A6CFF] mb-3">過去の活動報告</h3>
            {project.updates && project.updates.length > 0 ? (
                 <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
                    {project.updates.map(upd => (
                        <li key={upd.id} className="p-3 rounded-lg bg-slate-50/40 border border-slate-900/10 backdrop-blur-sm">
                            <p className="font-medium text-sm text-slate-800">{upd.title}</p>
                            <p className="text-xs text-slate-500 mb-1">{new Date(upd.date).toLocaleDateString('ja-JP')}</p>
                            <p className="text-xs text-slate-600 whitespace-pre-line">{upd.content.substring(0,100)}{upd.content.length > 100 ? '...' : ''}</p>
                        </li>
                    ))}
                 </ul>
            ) : (
                <p className="text-sm text-slate-500">まだ活動報告はありません。</p>
            )}
          </div>
        </section>
      )}

      {/* Milestone Completion Request Modal */}
      <Modal isOpen={isCompletionModalOpen} onClose={() => setIsCompletionModalOpen(false)} title={`マイルストーン達成申請: ${selectedMilestone?.title || ''}`}>
        <form onSubmit={handleCompletionSubmit} className="space-y-4">
          <div>
            <label htmlFor="reportText" className={modalLabelStyle}>報告内容 <span className="text-red-500">*</span></label>
            <textarea
              id="reportText"
              name="reportText"
              value={completionFormData.reportText}
              onChange={handleCompletionFormChange}
              required
              rows={4}
              className={modalInputBaseStyle}
              placeholder="達成内容、証拠、次のステップなどを詳細に記述してください。"
            />
          </div>
          <div>
            <label htmlFor="reportFile" className={modalLabelStyle}>報告書ファイル (任意)</label>
            <div className="flex items-center space-x-2">
                <DocumentTextIcon className="w-5 h-5 text-slate-500" />
                <input type="file" id="reportFile" name="reportFile" onChange={(e) => handleCompletionFileChange(e, 'reportFile')} className={`${modalInputBaseStyle} !p-1.5 text-xs`}/>
            </div>
            {completionFormData.reportFile && <p className="text-xs text-[#0A6CFF] mt-1">選択中: {completionFormData.reportFile.name}</p>}
          </div>
          <div>
            <label htmlFor="relatedUrl" className={modalLabelStyle}>関連URL (任意)</label>
             <div className="flex items-center space-x-2">
                <LinkIcon className="w-5 h-5 text-slate-500" />
                <input
                type="url"
                id="relatedUrl"
                name="relatedUrl"
                value={completionFormData.relatedUrl}
                onChange={handleCompletionFormChange}
                className={modalInputBaseStyle}
                placeholder="https://example.com/proof"
                />
            </div>
          </div>
          <div>
            <label htmlFor="evidenceImage" className={modalLabelStyle}>証拠画像 (任意)</label>
            <div className="flex items-center space-x-2">
                <PhotoIcon className="w-5 h-5 text-slate-500" />
                <input type="file" id="evidenceImage" name="evidenceImage" accept="image/*" onChange={(e) => handleCompletionFileChange(e, 'evidenceImage')} className={`${modalInputBaseStyle} !p-1.5 text-xs`}/>
            </div>
             {completionFormData.evidenceImage && <p className="text-xs text-[#0A6CFF] mt-1">選択中: {completionFormData.evidenceImage.name}</p>}
          </div>
          
          <div className="pt-3 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => setIsCompletionModalOpen(false)} 
                    disabled={isSubmittingCompletion}>
              キャンセル
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmittingCompletion} disabled={isSubmittingCompletion}>
              達成を申請する
            </Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};