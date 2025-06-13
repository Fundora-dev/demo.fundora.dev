
import { Project, ProjectCategory, User, UserRole, Milestone, ProjectUpdate, Investment, ProjectImpactSection, MilestoneStatus, MilestoneFormData, MilestoneCompletionRequestData } from '../types';
import { DEFAULT_PROJECT_IMAGE, DEFAULT_AVATAR } from '../constants';

const getDaysFromNow = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

const getDaysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export const mockUsers: User[] = [
  {
    id: 'user-owner-1',
    name: '佐藤 健一博士', // Changed from Dr. Aris Thorne
    role: UserRole.OWNER,
    avatarUrl: 'https://picsum.photos/seed/aristhorne/100/100', // Avatar seed kept for consistency
    bio: "量子物理学の専門家。特に量子もつれとその応用に関心を持つ。博士（理学）。",
    ownedProjectIds: ['proj-quantum-net', 'proj-neuro-sym', 'proj-carbon-capture', 'proj-successful-ended'],
    email: "kenichi.sato@example.com",
  },
  {
    id: 'user-owner-2',
    name: '田中 浩子博士', // Changed from Dr. Lena Hanson
    role: UserRole.OWNER,
    avatarUrl: 'https://picsum.photos/seed/lenahanson/100/100', // Avatar seed kept
    bio: "遺伝子工学、特にCRISPR技術の医療応用に注力するバイオテクノロジスト。修士（生命科学）。",
    ownedProjectIds: ['proj-gene-therapy', 'proj-unsuccessful-ended'],
    email: "hiroko.tanaka@example.com",
  },
  {
    id: 'user-investor-1',
    name: '山田 浩司', // Changed from Marcus Cole
    role: UserRole.INVESTOR,
    avatarUrl: 'https://picsum.photos/seed/marcuscole/100/100', // Avatar seed kept
    bio: "科学技術分野のアーリーステージ投資家。DeSciの可能性に期待している。",
    investments: [
      { projectId: 'proj-quantum-net', amount: 25000, date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
      { projectId: 'proj-gene-therapy', amount: 15000, date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { projectId: 'proj-successful-ended', amount: 5000, date: getDaysAgo(15) },
    ],
    email: "koji.yamada@example.com",
  },
   {
    id: 'user-investor-2',
    name: '鈴木 明美', // Changed from Sofia Chen
    role: UserRole.INVESTOR,
    avatarUrl: 'https://picsum.photos/seed/sofiachen/100/100', // Avatar seed kept
    bio: "サステナビリティと環境科学プロジェクトへのインパクト投資を専門とする。",
    investments: [
      { projectId: 'proj-carbon-capture', amount: 50000, date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
      { projectId: 'proj-unsuccessful-ended', amount: 10000, date: getDaysAgo(25) },
    ],
    email: "akemi.suzuki@example.com",
  },
];

const detailedSectionsExample: ProjectImpactSection[] = [
  {
    title: "研究の背景と意義",
    content: "現代社会においてXX問題は深刻であり、本研究はその解決に不可欠なYYのメカニズム解明を目指します。\n従来のZZアプローチとは異なり、我々はTTという独自の手法を用いることで、より迅速かつ効率的な成果が期待されます。"
  },
  {
    title: "期待される社会的インパクト",
    content: "本研究の成功は、AA分野における革新的な治療法開発や、BB産業における持続可能な技術確立に繋がり、数多くの人々の生活の質を向上させる可能性があります。\nまた、CCといった新たな学術領域の開拓にも貢献します。"
  },
  {
    title: "資金使途の詳細",
    content: "ご支援いただいた資金は、主に以下の用途に充当させていただきます。\n- 高性能実験装置XXXの購入: 50%\n- 熟練した研究補助員の雇用: 30%\n- 研究成果発表のための国際学会参加費用: 10%\n- 消耗品および試薬費: 10%\n透明性の高い資金管理を徹底し、定期的に会計報告を行います。"
  },
    {
    title: "私たちのビジョン",
    content: "私たちは、科学技術の力でより良い未来を創造することを信じています。このプロジェクトはその第一歩であり、皆様のご支援が、その実現を大きく後押しします。共に未来を切り拓きましょう。"
  }
];


export let mockProjects: Project[] = [ // Changed to let for in-place modification
  {
    id: 'proj-quantum-net',
    title: '量子もつれネットワークによる安全な通信',
    tagline: '次世代のハッキング不可能な通信ネットワークを構築する。',
    description: 'このプロジェクトは、小規模な量子もつれネットワークの開発とテストを目的としています。量子力学の原理を利用することで、検出なしに傍受することが理論的に不可能な通信チャネルを作成できます。資金は、高度な光学機器、特殊な結晶製造、および専門の量子物理学者の配置に使用されます。',
    ownerId: 'user-owner-1',
    ownerName: '佐藤 健一博士', // Updated
    ownerAvatar: mockUsers.find(u => u.id === 'user-owner-1')?.avatarUrl || DEFAULT_AVATAR,
    affiliation: '東京大学 量子科学研究所',
    category: ProjectCategory.QUANTUM_COMPUTING,
    fundingGoal: 500000,
    currentFunding: 550000, // Now funded, but still active
    deadline: getDaysFromNow(60),
    imageUrl: 'https://picsum.photos/seed/quantum/600/400',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
    researchPaperUrl: '#',
    team: [
      { name: '佐藤 健一博士', role: '主任研究員', avatarUrl: mockUsers.find(u => u.id === 'user-owner-1')?.avatarUrl || DEFAULT_AVATAR }, // Updated
      { name: 'Dr. Jian Li', role: '光学物理学者', avatarUrl: 'https://picsum.photos/seed/jianli/80/80' },
      { name: 'Maria Petrova', role: '量子エンジニア', avatarUrl: 'https://picsum.photos/seed/mariapetrova/80/80' },
    ],
    milestones: [
      { id: 'm0-qn', title: 'クラウドファンディング達成', description: '初期研究開発資金の確保。', dueDate: getDaysFromNow(0), status: MilestoneStatus.FUNDING_GOAL_MET, fundingReleasePercentage: 40 },
      { id: 'm1-qn', title: '実験室設営と機器校正', description: '必要な全ての量子光学機器を取得し校正する。', dueDate: getDaysFromNow(15), status: MilestoneStatus.COMPLETED, fundingReleasePercentage: 30 },
      { id: 'm2-qn', title: '最初のエンタングルメント生成成功', description: '安定したエンタングル光子対の生成を実証する。', dueDate: getDaysFromNow(45), status: MilestoneStatus.IN_PROGRESS, fundingReleasePercentage: 30 },
      { id: 'm3-qn', title: '短距離安全伝送テスト', description: '1kmの光ファイバーリンクを介した安全な鍵配布をテストする。', dueDate: getDaysFromNow(90), status: MilestoneStatus.PENDING, fundingReleasePercentage: 0 },
    ],
    updates: [
      { id: 'u1-qn', date: getDaysAgo(7), title: '実験室の設営完了！', content: '主要な機器はすべて設置され、校正されました。来週から初期のエンタングルメント実験を開始する予定です。' },
    ],
    detailedSections: detailedSectionsExample,
    investorCount: 45, // Updated investor count
    createdAt: getDaysAgo(30),
    recommenderName: '田中 一郎教授',
    recommenderAffiliation: '京都大学 理学部',
    recommenderTitle: '教授・物理学専攻',
    recommenderComment: '佐藤博士の研究は量子通信分野において非常に革新的であり、将来のセキュリティ技術に大きな影響を与える可能性を秘めています。彼のチームは高い専門性と熱意を持っており、このプロジェクトの成功を強く信じています。皆様の温かいご支援をお願い申し上げます。', // Updated recommender comment to reflect new owner name if applicable (here, Thorne to Sato)
    recommenderAvatarUrl: 'https://picsum.photos/seed/tanakasensei/100/100',
  },
  {
    id: 'proj-gene-therapy',
    title: '嚢胞性線維症のためのCRISPRベース治療法',
    tagline: 'CFTR遺伝子の変異を修正するための新規遺伝子編集アプローチを開発する。',
    description: '嚢胞性線維症は消耗性の遺伝性疾患です。私たちのチームは、最先端のCRISPR-Cas9技術を活用して、CFTR遺伝子の最も一般的な変異を直接修正する遺伝子治療法を開発しています。資金は、前臨床試験、ベクター開発、および規制当局との協議を支援します。',
    ownerId: 'user-owner-2',
    ownerName: '田中 浩子博士', // Updated
    ownerAvatar: mockUsers.find(u => u.id === 'user-owner-2')?.avatarUrl || DEFAULT_AVATAR,
    affiliation: '大阪大学 医学部附属病院 遺伝子治療センター',
    category: ProjectCategory.BIOTECHNOLOGY,
    fundingGoal: 750000,
    currentFunding: 450000, // Active, not yet funded
    deadline: getDaysFromNow(90),
    imageUrl: 'https://picsum.photos/seed/crispr/600/400',
    team: [
      { name: '田中 浩子博士', role: '主任バイオテクノロジスト', avatarUrl: mockUsers.find(u => u.id === 'user-owner-2')?.avatarUrl || DEFAULT_AVATAR }, // Updated
      { name: 'Dr. Samuel Green', role: '遺伝学者', avatarUrl: 'https://picsum.photos/seed/samgreen/80/80' },
    ],
    milestones: [
        { id: 'm0-gt', title: 'クラウドファンディング達成', description: 'プロジェクト開始のための基本資金確保。', dueDate: getDaysFromNow(0), status: MilestoneStatus.PENDING, fundingReleasePercentage: 50 }, // Status is PENDING until funded
        { id: 'm1-gt', title: 'ベクター設計と合成', description: '遺伝子送達のためのウイルスベクターの設計と合成を完了する。', dueDate: getDaysFromNow(30), status: MilestoneStatus.PENDING, fundingReleasePercentage: 30 },
        { id: 'm2-gt', title: 'In-vitro細胞株試験', description: 'ヒト細胞株でCFTR遺伝子の修正に成功する。', dueDate: getDaysFromNow(75), status: MilestoneStatus.PENDING, fundingReleasePercentage: 20 },
        { id: 'm3-gt', title: '前臨床動物モデル研究', description: '動物モデルでの安全性と有効性試験を開始する。', dueDate: getDaysFromNow(150), status: MilestoneStatus.PENDING, fundingReleasePercentage: 0 },
    ],
    updates: [],
    detailedSections: detailedSectionsExample.slice(0,2),
    investorCount: 62,
    createdAt: getDaysAgo(45),
    recommenderName: '山田 花子准教授',
    recommenderAffiliation: '慶應義塾大学 医学部',
    recommenderTitle: '准教授・遺伝医学',
    recommenderComment: '田中博士のチームが進めるCRISPR技術を用いた嚢胞性線維症治療法の開発は、多くの患者さんに希望をもたらすものです。そのアプローチは科学的にも妥当であり、実現可能性が高いと評価しています。この重要な研究をぜひ支援してください。', // Updated
    recommenderAvatarUrl: 'https://picsum.photos/seed/yamadajokyoju/100/100',
  },
  {
    id: 'proj-carbon-capture',
    title: '大気中炭素回収のための藻類バイオリアクター',
    tagline: '微細藻類を利用して効率的にCO2を大気から除去する。',
    description: 'このプロジェクトは、強化された炭素回収のために遺伝子操作された微細藻類を使用する新規フォトバイオリアクターシステムの設計と最適化に焦点を当てています。回収された炭素はバイオ燃料やその他の価値あるバイオ製品に変換されます。プロトタイプ構築、藻株の最適化、ライフサイクル分析のための資金を求めています。',
    ownerId: 'user-owner-1',
    ownerName: '佐藤 健一博士', // Updated
    ownerAvatar: mockUsers.find(u => u.id === 'user-owner-1')?.avatarUrl || DEFAULT_AVATAR,
    affiliation: '東京工業大学 環境エネルギー研究科',
    category: ProjectCategory.ENVIRONMENTAL_SCIENCE,
    fundingGoal: 300000,
    currentFunding: 120000, // Active, not yet funded
    deadline: getDaysFromNow(75),
    imageUrl: 'https://picsum.photos/seed/algae/600/400',
    team: [
      { name: '佐藤 健一博士', role: '主任研究員', avatarUrl: mockUsers.find(u => u.id === 'user-owner-1')?.avatarUrl || DEFAULT_AVATAR }, // Updated
    ],
    milestones: [
      { id: 'm0-cc', title: 'クラウドファンディング達成', description: '初期試作および藻株研究資金の確保。', dueDate: getDaysFromNow(0), status: MilestoneStatus.PENDING, fundingReleasePercentage: 60 },
      { id: 'm1-cc', title: 'プロトタイプバイオリアクター構築', description: '小規模プロトタイプリアクターの設計と構築完了。', dueDate: getDaysFromNow(40), status: MilestoneStatus.PENDING, fundingReleasePercentage: 40 },
      { id: 'm2-cc', title: '初期CO2回収効率テスト', description: 'プロトタイプでのCO2回収効率の初期評価。', dueDate: getDaysFromNow(80), status: MilestoneStatus.PENDING, fundingReleasePercentage: 0 },
    ],
    updates: [],
    detailedSections: detailedSectionsExample.slice(1,3),
    investorCount: 41,
    createdAt: getDaysAgo(15),
    recommenderName: '佐藤 次郎博士',
    recommenderAffiliation: '国立環境研究所',
    recommenderTitle: '主任研究員',
    recommenderComment: '大気中のCO2濃度上昇は喫緊の課題です。この藻類バイオリアクタープロジェクトは、その解決策の一つとして非常に有望です。佐藤博士の着眼点と技術力に期待しています。', // Updated
    recommenderAvatarUrl: 'https://picsum.photos/seed/satouhakase/100/100',
  },
  {
    id: 'proj-neuro-sym',
    title: 'AI駆動型神経交響曲アナライザー',
    tagline: '神経疾患の早期診断のための脳波パターン解読。',
    description: 'アルツハイマー病やパーキンソン病のような初期段階の神経学的状態を示す微細なパターンを特定するためにEEGデータを分析する高度なAIプラットフォームを開発しています。この非侵襲的診断ツールは、早期発見と介入を革命的に変えることを目指しています。大規模データ取得、アルゴリズム開発、臨床検証パートナーシップのために資金が必要です。',
    ownerId: 'user-owner-1',
    ownerName: '佐藤 健一博士', // Updated
    ownerAvatar: mockUsers.find(u => u.id === 'user-owner-1')?.avatarUrl || DEFAULT_AVATAR,
    affiliation: '早稲田大学 理工学術院 情報理工学科',
    category: ProjectCategory.AI_ML_RESEARCH,
    fundingGoal: 600000,
    currentFunding: 150000, // Active, not yet funded
    deadline: getDaysFromNow(120),
    imageUrl: 'https://picsum.photos/seed/neuroai/600/400',
    team: [
      { name: '佐藤 健一博士', role: '主任研究員', avatarUrl: mockUsers.find(u => u.id === 'user-owner-1')?.avatarUrl || DEFAULT_AVATAR }, // Updated
    ],
    milestones: [
      { id: 'm0-ns', title: 'クラウドファンディング達成', description: 'データ収集およびAIモデル基盤開発資金。', dueDate: getDaysFromNow(0), status: MilestoneStatus.PENDING, fundingReleasePercentage: 30 },
      { id: 'm1-ns', title: '大規模EEGデータセット構築完了', description: '初期分析用データセットの収集と前処理完了。', dueDate: getDaysFromNow(60), status: MilestoneStatus.PENDING, fundingReleasePercentage: 40 },
      { id: 'm2-ns', title: '第一次AIモデル精度検証', description: '構築したデータセットでのAIモデルの初期精度検証。', dueDate: getDaysFromNow(100), status: MilestoneStatus.PENDING, fundingReleasePercentage: 30 },
      { id: 'm3-ns', title: '臨床パートナーシップ締結', description: '実臨床データでの検証に向けた医療機関との提携。', dueDate: getDaysFromNow(150), status: MilestoneStatus.PENDING, fundingReleasePercentage: 0 },
    ],
    updates: [],
    detailedSections: detailedSectionsExample,
    investorCount: 28,
    createdAt: getDaysAgo(5),
    recommenderName: '鈴木 三郎教授',
    recommenderAffiliation: '東北大学 情報科学研究科',
    recommenderTitle: '名誉教授',
    recommenderComment: 'AIを用いた脳波解析は、神経疾患の早期発見において大きなブレークスルーとなる可能性があります。佐藤博士の提案するアナライザーは、その独創性と技術的基盤において高く評価できます。この挑戦的な研究の実現を心から応援しています。', // Updated
    recommenderAvatarUrl: 'https://picsum.photos/seed/suzukisensei/100/100',
  },
  // New: Successfully funded and ended project
  {
    id: 'proj-successful-ended',
    title: '完了済：画期的な太陽光パネル効率化技術',
    tagline: '目標達成し募集終了。次世代エネルギーへの貢献。',
    description: '本プロジェクトは、太陽光パネルの変換効率を飛躍的に向上させる新素材の開発に成功しました。皆様のご支援に心より感謝申し上げます。研究成果は近く学術雑誌にて発表予定です。',
    ownerId: 'user-owner-1',
    ownerName: '佐藤 健一博士', // Updated
    ownerAvatar: mockUsers.find(u => u.id === 'user-owner-1')?.avatarUrl || DEFAULT_AVATAR,
    affiliation: '九州大学 エネルギー理工学部',
    category: ProjectCategory.MATERIALS_SCIENCE,
    fundingGoal: 200000,
    currentFunding: 250000, // Funded
    deadline: getDaysAgo(10), // Ended 10 days ago
    imageUrl: 'https://picsum.photos/seed/solarpanel/600/400',
    team: [
        { name: '佐藤 健一博士', role: '主任研究員', avatarUrl: mockUsers.find(u => u.id === 'user-owner-1')?.avatarUrl || DEFAULT_AVATAR }, // Updated
    ],
    milestones: [
        { id: 'm0-se', title: 'クラウドファンディング達成', description: '資金確保完了。', dueDate: getDaysAgo(40), status: MilestoneStatus.FUNDING_GOAL_MET, fundingReleasePercentage: 50 },
        { id: 'm1-se', title: '新素材合成成功', description: '目標としていた新素材の合成に成功。', dueDate: getDaysAgo(20), status: MilestoneStatus.COMPLETED, fundingReleasePercentage: 50 },
        { id: 'm2-se', title: '研究成果論文投稿', description: '主要学術雑誌への論文投稿完了。', dueDate: getDaysAgo(5), status: MilestoneStatus.COMPLETED, fundingReleasePercentage: 0 },
    ],
    updates: [
      { id: 'u1-se', date: getDaysAgo(8), title: '研究成果論文が受理されました！', content: '先日投稿した太陽光パネル効率化に関する論文が、学術雑誌「Advanced Energy Materials」に受理されました。近日中にオンラインで公開される予定です。ご支援ありがとうございました！' },
    ],
    detailedSections: [detailedSectionsExample[0]],
    investorCount: 75,
    createdAt: getDaysAgo(50),
    recommenderName: '中村 五郎名誉教授',
    recommenderAffiliation: '北海道大学 工学部',
    recommenderTitle: '名誉教授',
    recommenderComment: 'この太陽光パネルプロジェクトは、クリーンエネルギー分野における重要な一歩でした。佐藤博士のリーダーシップとチームの努力が実を結び、見事に目標を達成したことを嬉しく思います。', // Updated
    recommenderAvatarUrl: 'https://picsum.photos/seed/nakamurasensei/100/100',
  },
  // New: Unsuccessfully ended project
  {
    id: 'proj-unsuccessful-ended',
    title: '募集終了：海洋マイクロプラスチック除去装置（資金未達）',
    tagline: '残念ながら目標未達で募集終了。今後の展開に期待。',
    description: '海洋マイクロプラスチック問題の解決を目指した本装置開発プロジェクトは、誠に残念ながら目標金額に到達せず、募集期間を終了いたしました。ご関心をお寄せいただいた皆様には感謝申し上げます。チームは別の形での研究継続を模索中です。',
    ownerId: 'user-owner-2',
    ownerName: '田中 浩子博士', // Updated
    ownerAvatar: mockUsers.find(u => u.id === 'user-owner-2')?.avatarUrl || DEFAULT_AVATAR,
    affiliation: '沖縄科学技術大学院大学 環境学部',
    category: ProjectCategory.ENVIRONMENTAL_SCIENCE,
    fundingGoal: 300000,
    currentFunding: 50000, // Not funded
    deadline: getDaysAgo(20), // Ended 20 days ago
    imageUrl: 'https://picsum.photos/seed/microplastic/600/400',
    team: [
        { name: '田中 浩子博士', role: '主任研究員', avatarUrl: mockUsers.find(u => u.id === 'user-owner-2')?.avatarUrl || DEFAULT_AVATAR }, // Updated
    ],
    milestones: [
        { id: 'm0-ue', title: 'クラウドファンディング開始', description: '開発資金募集開始。', dueDate: getDaysAgo(50), status: MilestoneStatus.PENDING, fundingReleasePercentage: 100 },
    ],
    updates: [],
    detailedSections: [detailedSectionsExample[1]],
    investorCount: 15,
    createdAt: getDaysAgo(60),
    recommenderName: '伊藤 六助博士',
    recommenderAffiliation: '海洋研究開発機構（JAMSTEC）',
    recommenderTitle: '上級研究員',
    recommenderComment: '海洋プラスチック問題は深刻です。田中博士のアイデアは興味深いものでしたが、今回は残念な結果となりました。今後の彼女の研究活動に期待しています。', // Updated
    recommenderAvatarUrl: 'https://picsum.photos/seed/itohakase/100/100',
  },
];

export const getProjectById = (id: string): Project | undefined => {
  return mockProjects.find(p => p.id === id);
};

export const getProjectsByOwnerId = (ownerId: string): Project[] => {
  return mockProjects.filter(p => p.ownerId === ownerId);
};

// Update addProject to include new fields
type AddProjectInput = Omit<Project, 'id' | 'currentFunding' | 'investorCount' | 'createdAt' | 'ownerName' | 'ownerAvatar' | 'updates' | 'team' | 'detailedSections' | 'milestones'> &
                       Required<Pick<Project, 'affiliation' | 'recommenderName' | 'recommenderAffiliation' | 'recommenderTitle' | 'recommenderComment' | 'recommenderAvatarUrl'>> &
                       { milestones: MilestoneFormData[] };


export const addProject = (projectInput: AddProjectInput, owner: User): Project => {
  const newProject: Project = {
    ...projectInput,
    id: `proj-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    currentFunding: 0,
    investorCount: 0,
    createdAt: new Date().toISOString(),
    ownerName: owner.name,
    ownerAvatar: owner.avatarUrl,
    milestones: projectInput.milestones.map((msData, index) => ({
        ...msData,
        id: `ms-${index}-${Date.now()}`,
        // All milestones, including "クラウドファンディング達成", start as PENDING.
        // Status for "クラウドファンディング達成" is updated in addInvestment when funding goal is met.
        status: MilestoneStatus.PENDING,
    })),
    updates: [],
    team: [{ name: owner.name, role: "主任研究員", avatarUrl: owner.avatarUrl }],
    detailedSections: [
      { title: "研究の目的", content: "このプロジェクトの主な目的は..." },
      { title: "期待される成果", content: "この研究を通じて..." }
    ],
  };
  mockProjects.unshift(newProject);
  if(owner.ownedProjectIds) {
    owner.ownedProjectIds.push(newProject.id);
  } else {
    owner.ownedProjectIds = [newProject.id];
  }
  return newProject;
};

export const addInvestment = (projectId: string, amount: number, investor: User): boolean => {
  const project = getProjectById(projectId);
  if (!project) return false;

  project.currentFunding += amount;
  project.investorCount += 1;

  if (project.currentFunding >= project.fundingGoal) {
      const cfMilestone = project.milestones?.find(m => m.title === "クラウドファンディング達成" || (m.fundingReleasePercentage > 0 && m.status !== MilestoneStatus.COMPLETED && m.status !== MilestoneStatus.FUNDING_GOAL_MET));
      if (cfMilestone && cfMilestone.status !== MilestoneStatus.FUNDING_GOAL_MET && cfMilestone.status !== MilestoneStatus.COMPLETED) {
        cfMilestone.status = MilestoneStatus.FUNDING_GOAL_MET;
      }
  }


  if (!investor.investments) {
    investor.investments = [];
  }
  investor.investments.push({ projectId, amount, date: new Date().toISOString() });

  return true;
};

export const addProjectUpdate = (projectId: string, updateData: Omit<ProjectUpdate, 'id' | 'date'>): Project | undefined => {
  const projectIndex = mockProjects.findIndex(p => p.id === projectId);
  if (projectIndex === -1) return undefined;

  const newUpdate: ProjectUpdate = {
    ...updateData,
    id: `update-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    date: new Date().toISOString(),
  };

  if (!mockProjects[projectIndex].updates) {
    mockProjects[projectIndex].updates = [];
  }
  mockProjects[projectIndex].updates!.unshift(newUpdate); // Add to the beginning for chronological order (newest first)

  return mockProjects[projectIndex];
};

type MilestoneCompletionSubmitData = Omit<MilestoneCompletionRequestData, 'reportFile' | 'evidenceImage'> & {
    reportFileName?: string;
    evidenceImageName?: string;
};

export const requestMilestoneCompletion = (
  projectId: string,
  milestoneId: string,
  completionData: MilestoneCompletionSubmitData
): boolean => {
  const project = getProjectById(projectId);
  if (!project) return false;
  const milestone = project.milestones.find(m => m.id === milestoneId);
  if (!milestone) return false;

  milestone.completionRequestedAt = new Date().toISOString();
  milestone.completionRequestData = completionData;

  console.log(
    `Milestone completion requested for project ${projectId}, milestone ${milestoneId}: "${milestone.title}" with data:`,
    completionData
  );
  return true;
};
