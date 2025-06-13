
import { UserRole, ProjectCategory } from './types';

export const SITE_NAME = "NextLab";
export const HERO_TITLE = "科学の未来を、共に創造する";
export const HERO_SUBTITLE = "コミュニティ主導のファンディングと連携で、科学研究プロジェクトの透明な管理を支援するプラットフォーム。";

export const NAV_LINKS = [
  { name: "ホーム", path: "/" },
  { name: "プロジェクト一覧", path: "/projects" },
  // Dashboards will be shown conditionally based on user role in Navbar
];

export const USER_ROLE_SPECIFIC_NAV = {
  [UserRole.OWNER]: [
    { name: "研究者ダッシュボード", path: "/dashboard/owner" },
    { name: "プロジェクト作成", path: "/create-project" }
  ],
  [UserRole.INVESTOR]: [
    { name: "支援者ダッシュボード", path: "/dashboard/investor" }
  ]
};

export const FOOTER_TEXT = `© ${new Date().getFullYear()} NextLab. 無断複写・転載を禁じます。デモ目的のみ。`;

export const DEFAULT_PROJECT_IMAGE = "https://picsum.photos/seed/defaultproj/600/400";
export const DEFAULT_AVATAR = "https://picsum.photos/seed/defaultavatar/100/100";

// Use English values for ProjectCategory enum, map to Japanese for display in filters etc.
export const PROJECT_CATEGORIES_LIST = Object.values(ProjectCategory);

export const PROJECT_CATEGORY_DISPLAY_NAMES: Record<ProjectCategory, string> = {
  [ProjectCategory.BIOTECHNOLOGY]: "バイオテクノロジー",
  [ProjectCategory.AI_ML_RESEARCH]: "AI/ML研究",
  [ProjectCategory.SPACE_EXPLORATION]: "宇宙探査",
  [ProjectCategory.ENVIRONMENTAL_SCIENCE]: "環境科学",
  [ProjectCategory.NEUROSCIENCE]: "神経科学",
  [ProjectCategory.QUANTUM_COMPUTING]: "量子コンピューティング",
  [ProjectCategory.MATERIALS_SCIENCE]: "材料科学",
  [ProjectCategory.LONGEVITY_RESEARCH]: "長寿研究"
};

export const BREADCRUMB_NAMES: Record<string, string> = {
  '/': 'ホーム',
  '/projects': 'プロジェクト一覧',
  // projectId は動的に解決するため、ここには含めない
  '/create-project': 'プロジェクト作成',
  '/dashboard/owner': '研究者ダッシュボード',
  '/dashboard/investor': '支援者ダッシュボード',
  '/projects/:projectId/edit': 'プロジェクト編集', // Added for edit page
};

export const FOOTER_LINKS_LEGAL = [
  { name: "プライバシーポリシー", path: "#" },
  { name: "利用規約", path: "#" },
];

export const FOOTER_LINKS_CONNECT = [
  { name: "お問い合わせ", path: "#" },
  // { name: "X (旧Twitter)", path: "#" }, // 将来的なSNSリンクの例
  // { name: "Facebook", path: "#" }, // 将来的なSNSリンクの例
];