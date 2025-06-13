import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { ProjectCategory, UserRole, MilestoneStatus, MilestoneFormData } from '../types';
import { useUser } from '../contexts/UserContext';
import { addProject } from '../services/mockData';
import { PROJECT_CATEGORIES_LIST, PROJECT_CATEGORY_DISPLAY_NAMES, DEFAULT_PROJECT_IMAGE, DEFAULT_AVATAR } from '../constants';

// Icons
const PhotographIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);
const PlusCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
);
const UserCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);


interface CreateProjectFormData {
  title: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  fundingGoal: number;
  deadline: string; 
  imageUrl: string; 
  affiliation: string; 
  recommenderName: string;
  recommenderAffiliation: string;
  recommenderTitle: string;
  recommenderComment: string;
  recommenderAvatarUrl: string; 
  milestones: MilestoneFormData[];
}


const initialMilestone: MilestoneFormData = {
    title: '',
    description: '',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], 
    fundingReleasePercentage: 0,
};

const initialFormData: CreateProjectFormData = {
  title: '',
  tagline: '',
  description: '',
  category: ProjectCategory.BIOTECHNOLOGY, 
  fundingGoal: 100000, 
  deadline: '',
  imageUrl: '',
  affiliation: '',
  recommenderName: '',
  recommenderAffiliation: '',
  recommenderTitle: '',
  recommenderComment: '',
  recommenderAvatarUrl: '', 
  milestones: [{ ...initialMilestone, title: 'クラウドファンディング達成', description: 'プロジェクト開始のための初期資金。', fundingReleasePercentage: 50 }],
};


export const CreateProjectPage: React.FC = () => {
  const [formData, setFormData] = useState<CreateProjectFormData>(initialFormData);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [recommenderAvatarPreviewUrl, setRecommenderAvatarPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { currentUser } = useUser();

  useEffect(() => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const defaultDeadline = futureDate.toISOString().split('T')[0];
    
    setFormData(prev => ({ 
        ...prev, 
        deadline: defaultDeadline,
        milestones: prev.milestones.map((m, index) => ({
            ...m,
            dueDate: index === 0 ? defaultDeadline : (m.dueDate || defaultDeadline) 
        }))
    }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'deadline') {
        setFormData(prev => ({
            ...prev,
            deadline: value,
            milestones: prev.milestones.map((m, index) => 
                index === 0 ? { ...m, dueDate: value } : m
            )
        }));
    } else {
        setFormData(prev => ({
          ...prev,
          [name]: name === 'fundingGoal' ? parseInt(value, 10) : value,
        }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
        setFormData(prev => ({ ...prev, imageUrl: file.name })); 
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreviewUrl(null);
      setFormData(prev => ({ ...prev, imageUrl: '' }));
    }
  };

  const handleRecommenderAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setRecommenderAvatarPreviewUrl(reader.result as string);
        setFormData(prev => ({ ...prev, recommenderAvatarUrl: file.name }));
      };
      reader.readAsDataURL(file);
    } else {
      setRecommenderAvatarPreviewUrl(null);
      setFormData(prev => ({ ...prev, recommenderAvatarUrl: '' }));
    }
  };

  const handleMilestoneChange = (index: number, field: keyof MilestoneFormData, value: string | number) => {
    if (index === 0 && field === 'title') {
      return;
    }
    if (index === 0 && field === 'dueDate') {
        return;
    }

    const newMilestones = [...formData.milestones];
    const milestoneToUpdate = { ...newMilestones[index] };
    
    if (field === 'fundingReleasePercentage') {
        milestoneToUpdate[field] = Math.max(0, Math.min(100, Number(value)));
    } else if (field === 'dueDate') {
        milestoneToUpdate[field] = value as string;
    }
     else {
        (milestoneToUpdate[field as keyof Omit<MilestoneFormData, 'fundingReleasePercentage' | 'dueDate'>] as string) = value as string;
    }
    newMilestones[index] = milestoneToUpdate;
    setFormData(prev => ({ ...prev, milestones: newMilestones }));
  };

  const addMilestone = () => {
    const futureDate = new Date();
    futureDate.setDate(new Date(formData.milestones[formData.milestones.length -1]?.dueDate || Date.now()).getDate() + 30);

    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, { ...initialMilestone, dueDate: futureDate.toISOString().split('T')[0] }],
    }));
  };

  const removeMilestone = (index: number) => {
    if (index === 0) {
        setError("最初のマイルストーン（クラウドファンディング達成）は削除できません。");
        return;
    }
    if (formData.milestones.length <= 1) { 
        setError("少なくとも1つのマイルストーンが必要です。");
        return;
    }
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index),
    }));
  };
  
  const totalFundingRelease = formData.milestones.reduce((sum, ms) => sum + (ms.fundingReleasePercentage || 0), 0);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!currentUser || currentUser.role !== UserRole.OWNER) {
      setError("プロジェクトを作成するには研究者としてログインする必要があります。");
      return;
    }
    if (formData.fundingGoal <= 0) {
      setError("目標金額は0より大きい値を設定してください。");
      return;
    }
    if (new Date(formData.deadline) <= new Date()) {
      setError("募集終了日は未来の日付を設定してください。");
      return;
    }
    if (!formData.affiliation.trim() || 
        !formData.recommenderName.trim() || 
        !formData.recommenderAffiliation.trim() || 
        !formData.recommenderTitle.trim() || 
        !formData.recommenderComment.trim() ||
        !formData.recommenderAvatarUrl.trim()) { 
        setError("所属機関および推薦者情報（推薦コメント、アバター画像を含む）はすべて必須です。");
        return;
    }
    if (formData.milestones.some(ms => !ms.title.trim() || ms.fundingReleasePercentage < 0 || ms.fundingReleasePercentage > 100 || !ms.dueDate)) {
        setError("すべてのマイルストーンにはタイトル、有効な資金解放率（0-100%）、完了予定日が必要です。");
        return;
    }
     if (totalFundingRelease > 100) {
        setError("資金解放率の合計が100%を超えています。調整してください。");
        return;
    }


    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const projectDataForAdd = {
        title: formData.title,
        tagline: formData.tagline,
        description: formData.description,
        category: formData.category,
        fundingGoal: formData.fundingGoal,
        deadline: new Date(formData.deadline).toISOString(), 
        imageUrl: imagePreviewUrl || formData.imageUrl || DEFAULT_PROJECT_IMAGE,
        ownerId: currentUser.id,
        affiliation: formData.affiliation,
        recommenderName: formData.recommenderName,
        recommenderAffiliation: formData.recommenderAffiliation,
        recommenderTitle: formData.recommenderTitle,
        recommenderComment: formData.recommenderComment,
        recommenderAvatarUrl: recommenderAvatarPreviewUrl || formData.recommenderAvatarUrl || DEFAULT_AVATAR, 
        milestones: formData.milestones,
      };

      const newProject = addProject(projectDataForAdd, currentUser);
      setIsSubmitting(false);
      alert('プロジェクトが正常に作成されました！（デモ）');
      navigate(`/projects/${newProject.id}`);
    } catch (err) {
      setIsSubmitting(false);
      setError("プロジェクトの作成に失敗しました。もう一度お試しください。");
      console.error(err);
    }
  };
  
  const inputBaseStyle = "w-full px-3.5 py-2.5 rounded-xl bg-slate-50/70 backdrop-blur-sm text-slate-800 border border-slate-900/20 focus-visible:ring-2 focus-visible:ring-[#0A6CFF]/50 focus-visible:border-[#0A6CFF]/70 placeholder-slate-500 shadow-sm transition-all";
  const fieldsetBaseStyle = "border border-slate-900/10 p-6 rounded-[24px] bg-slate-50/40 backdrop-blur-lg shadow-lg shadow-slate-900/5";
  const fileInputContainerStyle = "mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-slate-900/20 border-dashed rounded-xl bg-slate-50/30 backdrop-blur-sm hover:border-[#0A6CFF]/50 transition-colors";
  const mainContainerStyle = `
    max-w-3xl mx-auto 
    bg-slate-50/60 backdrop-blur-xl backdrop-saturate-150 
    border border-slate-900/10 
    shadow-xl shadow-slate-900/5 
    p-8 rounded-[24px]
  `;


  return (
    <div className={mainContainerStyle.replace(/\s\s+/g, ' ').trim()}>
      <h1 className="text-3xl font-bold text-[#0A6CFF] mb-8 text-center">あなたの研究プロジェクトを始めよう</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <fieldset className={fieldsetBaseStyle}>
            <legend className="text-xl font-semibold text-[#0A6CFF] px-2 mb-2">プロジェクト基本情報</legend>
            <div className="space-y-5 mt-3">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">プロジェクト名 <span className="text-red-500">*</span></label>
                  <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required 
                         className={inputBaseStyle} />
                </div>
                <div>
                  <label htmlFor="tagline" className="block text-sm font-medium text-slate-700 mb-1">キャッチコピー <span className="text-red-500">*</span></label>
                  <input type="text" name="tagline" id="tagline" value={formData.tagline} onChange={handleChange} required maxLength={120}
                         className={inputBaseStyle} />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">プロジェクト概要 <span className="text-red-500">*</span></label>
                  <textarea name="description" id="description" value={formData.description} onChange={handleChange} required rows={5}
                            className={inputBaseStyle}></textarea>
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">カテゴリ <span className="text-red-500">*</span></label>
                  <select name="category" id="category" value={formData.category} onChange={handleChange} required
                          className={inputBaseStyle}>
                    {PROJECT_CATEGORIES_LIST.map(catValue => (
                      <option key={catValue} value={catValue}>{PROJECT_CATEGORY_DISPLAY_NAMES[catValue]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="fundingGoal" className="block text-sm font-medium text-slate-700 mb-1">目標金額 (円) <span className="text-red-500">*</span></label>
                  <input type="number" name="fundingGoal" id="fundingGoal" value={formData.fundingGoal} onChange={handleChange} required min="1"
                         className={inputBaseStyle} />
                </div>
                <div>
                  <label htmlFor="deadline" className="block text-sm font-medium text-slate-700 mb-1">募集終了日 <span className="text-red-500">*</span></label>
                  <input type="date" name="deadline" id="deadline" value={formData.deadline} onChange={handleChange} required 
                         className={`${inputBaseStyle} appearance-none`} />
                </div>
                <div>
                    <label htmlFor="imageUpload" className="block text-sm font-medium text-slate-700 mb-1">プロジェクト画像 <span className="text-red-500">*</span></label>
                    <div className={fileInputContainerStyle}>
                        <div className="space-y-1 text-center">
                            {imagePreviewUrl ? (
                                <img src={imagePreviewUrl} alt="プロジェクト画像プレビュー" className="mx-auto h-32 w-auto rounded-md object-contain shadow-sm" />
                            ) : (
                                <PhotographIcon className="mx-auto h-12 w-12 text-slate-400" />
                            )}
                            <div className="flex text-sm text-slate-600 justify-center">
                                <label
                                    htmlFor="imageUploadInput"
                                    className="relative cursor-pointer rounded-md font-medium text-[#0A6CFF] hover:text-[#0052CC] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-white focus-within:ring-[#0A6CFF]"
                                >
                                    <span>ファイルをアップロード</span>
                                    <input id="imageUploadInput" name="imageUpload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} required={!formData.imageUrl && !imagePreviewUrl} />
                                </label>
                                <p className="pl-1">またはドラッグ＆ドロップ</p>
                            </div>
                            <p className="text-xs text-slate-500">PNG, JPG, GIF 最大10MB</p>
                            {formData.imageUrl && !imagePreviewUrl && <p className="text-xs text-green-600 mt-1">選択中のファイル: {formData.imageUrl}</p>}
                        </div>
                    </div>
                    {imagePreviewUrl && (
                        <Button variant="outline" size="sm" onClick={() => { setImagePreviewUrl(null); setFormData(f => ({...f, imageUrl: ''}))}} className="mt-2">
                            プレビューをクリア
                        </Button>
                    )}
                </div>
            </div>
        </fieldset>

        <fieldset className={fieldsetBaseStyle}>
            <legend className="text-xl font-semibold text-[#0A6CFF] px-2 mb-2">発起人情報</legend>
            <div className="space-y-5 mt-3">
                <div>
                  <label htmlFor="affiliation" className="block text-sm font-medium text-slate-700 mb-1">所属機関（大学・高校名など） <span className="text-red-500">*</span></label>
                  <input type="text" name="affiliation" id="affiliation" value={formData.affiliation} onChange={handleChange} required 
                         className={inputBaseStyle} />
                </div>
            </div>
        </fieldset>

        <fieldset className={fieldsetBaseStyle}>
            <legend className="text-xl font-semibold text-[#0A6CFF] px-2 mb-2">推薦者情報</legend>
            <div className="space-y-5 mt-3">
                 <div>
                  <label htmlFor="recommenderName" className="block text-sm font-medium text-slate-700 mb-1">推薦者氏名 <span className="text-red-500">*</span></label>
                  <input type="text" name="recommenderName" id="recommenderName" value={formData.recommenderName} onChange={handleChange} required 
                         className={inputBaseStyle} />
                </div>
                <div>
                  <label htmlFor="recommenderAffiliation" className="block text-sm font-medium text-slate-700 mb-1">推薦者の所属機関 <span className="text-red-500">*</span></label>
                  <input type="text" name="recommenderAffiliation" id="recommenderAffiliation" value={formData.recommenderAffiliation} onChange={handleChange} required 
                         className={inputBaseStyle} />
                </div>
                <div>
                  <label htmlFor="recommenderTitle" className="block text-sm font-medium text-slate-700 mb-1">推薦者の役職 <span className="text-red-500">*</span></label>
                  <input type="text" name="recommenderTitle" id="recommenderTitle" value={formData.recommenderTitle} onChange={handleChange} required 
                         className={inputBaseStyle} />
                </div>
                <div>
                  <label htmlFor="recommenderComment" className="block text-sm font-medium text-slate-700 mb-1">推薦コメント <span className="text-red-500">*</span></label>
                  <textarea name="recommenderComment" id="recommenderComment" value={formData.recommenderComment} onChange={handleChange} required rows={4}
                            className={inputBaseStyle}></textarea>
                </div>
                <div>
                  <label htmlFor="recommenderAvatarUpload" className="block text-sm font-medium text-slate-700 mb-1">推薦者アバター画像 <span className="text-red-500">*</span></label>
                  <div className={fileInputContainerStyle}>
                        <div className="space-y-1 text-center">
                            {recommenderAvatarPreviewUrl ? (
                                <img src={recommenderAvatarPreviewUrl} alt="推薦者アバタープレビュー" className="mx-auto h-24 w-24 rounded-full object-cover shadow-sm" />
                            ) : (
                                <UserCircleIcon className="mx-auto h-12 w-12 text-slate-400" />
                            )}
                            <div className="flex text-sm text-slate-600 justify-center">
                                <label
                                    htmlFor="recommenderAvatarUploadInput"
                                    className="relative cursor-pointer rounded-md font-medium text-[#0A6CFF] hover:text-[#0052CC] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-white focus-within:ring-[#0A6CFF]"
                                >
                                    <span>ファイルをアップロード</span>
                                    <input id="recommenderAvatarUploadInput" name="recommenderAvatarUpload" type="file" className="sr-only" accept="image/*" onChange={handleRecommenderAvatarChange} required={!formData.recommenderAvatarUrl && !recommenderAvatarPreviewUrl} />
                                </label>
                                <p className="pl-1">またはドラッグ＆ドロップ</p>
                            </div>
                            <p className="text-xs text-slate-500">PNG, JPG, GIF 最大2MB</p>
                            {formData.recommenderAvatarUrl && !recommenderAvatarPreviewUrl && <p className="text-xs text-green-600 mt-1">選択中のファイル: {formData.recommenderAvatarUrl}</p>}
                        </div>
                    </div>
                    {recommenderAvatarPreviewUrl && (
                        <Button variant="outline" size="sm" onClick={() => { setRecommenderAvatarPreviewUrl(null); setFormData(f => ({...f, recommenderAvatarUrl: ''}))}} className="mt-2">
                            プレビューをクリア
                        </Button>
                    )}
                </div>
            </div>
        </fieldset>

        <fieldset className={fieldsetBaseStyle}>
            <legend className="text-xl font-semibold text-[#0A6CFF] px-2 mb-2">マイルストーンと資金解放スケジュール</legend>
            <div className="space-y-5 mt-3">
                {formData.milestones.map((milestone, index) => (
                    <div key={index} className="p-4 border border-slate-900/15 rounded-xl bg-slate-50/50 space-y-3 relative shadow-sm backdrop-blur-sm">
                        <h4 className="font-medium text-slate-700">マイルストーン {index + 1}{index === 0 ? " (クラウドファンディング達成)" : ""}</h4>
                        {index !== 0 && formData.milestones.length > 1 && ( 
                             <button type="button" onClick={() => removeMilestone(index)} className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-500/10 transition-colors">
                                <TrashIcon className="w-5 h-5"/>
                             </button>
                        )}
                        <div>
                            <label htmlFor={`milestoneTitle-${index}`} className="block text-xs font-medium text-slate-600 mb-0.5">タイトル <span className="text-red-500">*</span></label>
                            <input type="text" id={`milestoneTitle-${index}`} value={milestone.title}
                                   onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)} required
                                   placeholder={index === 0 ? "クラウドファンディング達成" : "例: 研究フェーズ1完了"}
                                   readOnly={index === 0}
                                   className={`${inputBaseStyle} text-sm ${index === 0 ? 'bg-slate-200/50 cursor-not-allowed !border-slate-900/10' : ''}`} />
                        </div>
                        <div>
                            <label htmlFor={`milestoneDesc-${index}`} className="block text-xs font-medium text-slate-600 mb-0.5">説明</label>
                            <textarea id={`milestoneDesc-${index}`} value={milestone.description}
                                      onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)} rows={2}
                                      className={`${inputBaseStyle} text-sm`}></textarea>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label htmlFor={`milestoneDueDate-${index}`} className="block text-xs font-medium text-slate-600 mb-0.5">完了予定日 <span className="text-red-500">*</span></label>
                                <input type="date" id={`milestoneDueDate-${index}`} value={milestone.dueDate}
                                       onChange={(e) => handleMilestoneChange(index, 'dueDate', e.target.value)} required
                                       readOnly={index === 0} 
                                       className={`${inputBaseStyle} text-sm appearance-none ${index === 0 ? 'bg-slate-200/50 cursor-not-allowed !border-slate-900/10' : ''}`} />
                            </div>
                            <div>
                                <label htmlFor={`milestoneRelease-${index}`} className="block text-xs font-medium text-slate-600 mb-0.5">資金解放率 (%) <span className="text-red-500">*</span></label>
                                <input type="number" id={`milestoneRelease-${index}`} value={milestone.fundingReleasePercentage}
                                       onChange={(e) => handleMilestoneChange(index, 'fundingReleasePercentage', parseInt(e.target.value, 10))}
                                       required min="0" max="100" placeholder="0-100"
                                       className={`${inputBaseStyle} text-sm`} />
                            </div>
                        </div>
                    </div>
                ))}
                <div className="flex justify-between items-center pt-2">
                    <Button type="button" variant="outline" size="sm" onClick={addMilestone} leftIcon={<PlusCircleIcon/>}>
                        マイルストーンを追加
                    </Button>
                    <div className={`text-sm font-medium ${totalFundingRelease > 100 ? 'text-red-500' : 'text-green-600'}`}>
                        合計解放率: {totalFundingRelease}%
                        {totalFundingRelease > 100 && " (100%を超過)"}
                         {totalFundingRelease < 100 && formData.milestones.length > 0 && " (100%に達していません)"}
                    </div>
                </div>
            </div>
        </fieldset>


        {error && <p className="text-red-600 text-sm p-3 bg-red-100/70 backdrop-blur-sm rounded-lg border border-red-300/50">{error}</p>}

        <div className="pt-4">
          <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} className="w-full" disabled={isSubmitting || !currentUser || currentUser.role !== UserRole.OWNER || totalFundingRelease > 100}>
            {isSubmitting ? 'プロジェクトを送信中...' : 'プロジェクトを作成'}
          </Button>
        </div>
        {(!currentUser || currentUser.role !== UserRole.OWNER) && <p className="text-yellow-600 text-sm text-center mt-2">プロジェクトを作成するには研究者としてログインしてください。</p>}
      </form>
    </div>
  );
};