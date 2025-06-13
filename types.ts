
export enum ProjectCategory {
  BIOTECHNOLOGY = "Biotechnology",
  AI_ML_RESEARCH = "AI/ML Research",
  SPACE_EXPLORATION = "Space Exploration",
  ENVIRONMENTAL_SCIENCE = "Environmental Science",
  NEUROSCIENCE = "Neuroscience",
  QUANTUM_COMPUTING = "Quantum Computing",
  MATERIALS_SCIENCE = "Materials Science",
  LONGEVITY_RESEARCH = "Longevity Research"
}

export type ProjectCategoryKey = keyof typeof ProjectCategory;

export enum MilestoneStatus {
  PENDING = "未実施",
  IN_PROGRESS = "進行中",
  COMPLETED = "達成",
  FUNDING_GOAL_MET = "クラウドファンディング達成"
}

export interface MilestoneCompletionRequestData {
  reportText: string;
  reportFile: File | null;
  relatedUrl: string;
  evidenceImage: File | null;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO Date string
  status: MilestoneStatus;
  fundingReleasePercentage: number; // Percentage (0-100)
  completionRequestedAt?: string; // ISO Date string, when completion was requested
  // Optional: Store the actual request data for demo purposes
  completionRequestData?: Omit<MilestoneCompletionRequestData, 'reportFile' | 'evidenceImage'> & {
    reportFileName?: string;
    evidenceImageName?: string;
  };
}

export interface ProjectUpdate {
  id: string;
  date: string; // ISO Date string
  title: string;
  content: string;
}

export interface ProjectImpactSection {
  title: string;
  content: string;
  icon?: string; // Optional: for future use if icons per section are desired
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  ownerId: string; 
  ownerName: string;
  ownerAvatar: string;
  affiliation: string; // 発起人の所属機関
  category: ProjectCategory;
  fundingGoal: number;
  currentFunding: number;
  deadline: string; // ISO Date string
  imageUrl: string;
  videoUrl?: string; // Optional video link (e.g., YouTube)
  researchPaperUrl?: string; // Optional link to research paper
  team?: { name: string; role: string; bio?: string; avatarUrl?: string }[];
  milestones: Milestone[]; // Now required
  updates?: ProjectUpdate[];
  detailedSections?: ProjectImpactSection[]; // New field for PR content
  investorCount: number;
  createdAt: string; // ISO Date string
  recommenderName: string; // 推薦者の氏名
  recommenderAffiliation: string; // 推薦者の所属機関
  recommenderTitle: string; // 推薦者の役職
  recommenderComment: string; // 推薦コメント (必須)
  recommenderAvatarUrl: string; // 推薦者のアバターURL (必須)
}

export enum UserRole {
  OWNER = "研究者",
  INVESTOR = "支援者",
}

export interface Investment {
  projectId: string;
  amount: number;
  date: string; // ISO Date string
}

export interface User {
  id: string;
  name: string;
  email?: string; // For display, not auth
  role: UserRole;
  avatarUrl: string;
  bio?: string; // 自己紹介や専門分野など
  ownedProjectIds?: string[];
  investments?: Investment[];
}

// Type for milestone input in CreateProjectPage form
export type MilestoneFormData = Omit<Milestone, 'id' | 'status' | 'completionRequestedAt' | 'completionRequestData'>;
