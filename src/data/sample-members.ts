/**
 * Sample Members Data for WDK Badminton Club
 * 五道口AI创业羽毛球俱乐部 - 示例会员数据
 */

export interface SampleMember {
  id: string
  name: string
  nameEn?: string
  avatarUrl?: string
  bio?: string
  companyName?: string
  companyNameEn?: string
  jobTitle?: string
  aiSector?: string
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  totalPoints: number
  matchesPlayed: number
  matchesWon: number
  joinedAt: string
}

export const sampleMembers: SampleMember[] = [
  {
    id: '1',
    name: '张伟',
    nameEn: 'Zhang Wei',
    companyName: '智谱AI',
    companyNameEn: 'Zhipu AI',
    jobTitle: '联合创始人 & CTO',
    aiSector: '大语言模型',
    skillLevel: 'advanced',
    bio: 'AI大模型专家，羽毛球爱好者。喜欢通过运动结识同行，探讨技术与创业话题。',
    totalPoints: 850,
    matchesPlayed: 42,
    matchesWon: 28,
    joinedAt: '2024-09-15',
  },
  {
    id: '2',
    name: '李娜',
    nameEn: 'Li Na',
    companyName: '红杉中国',
    companyNameEn: 'Sequoia Capital China',
    jobTitle: '投资经理',
    aiSector: 'AI应用投资',
    skillLevel: 'intermediate',
    bio: 'AI领域投资人，关注大模型应用方向。通过羽毛球认识优秀创业者，也享受运动带来的放松。',
    totalPoints: 620,
    matchesPlayed: 35,
    matchesWon: 18,
    joinedAt: '2024-10-01',
  },
  {
    id: '3',
    name: '王强',
    nameEn: 'Wang Qiang',
    companyName: '商汤科技',
    companyNameEn: 'SenseTime',
    jobTitle: '高级研究员',
    aiSector: '计算机视觉',
    skillLevel: 'expert',
    bio: 'CV领域专家，羽毛球校队出身。希望在俱乐部找到高水平对手切磋技艺。',
    totalPoints: 1250,
    matchesPlayed: 68,
    matchesWon: 52,
    joinedAt: '2024-08-20',
  },
  {
    id: '4',
    name: '刘芳',
    nameEn: 'Liu Fang',
    companyName: '月之暗面',
    companyNameEn: 'Moonshot AI',
    jobTitle: '产品经理',
    aiSector: '对话AI产品',
    skillLevel: 'intermediate',
    bio: 'AI产品经理，负责Kimi对话产品。相信好产品和好球技都需要不断打磨和迭代。',
    totalPoints: 540,
    matchesPlayed: 28,
    matchesWon: 15,
    joinedAt: '2024-10-05',
  },
  {
    id: '5',
    name: '陈浩',
    nameEn: 'Chen Hao',
    companyName: '零一万物',
    companyNameEn: '01.AI',
    jobTitle: '联合创始人',
    aiSector: 'AGI',
    skillLevel: 'advanced',
    bio: 'AGI创业者，相信运动和创业一样需要坚持和策略。',
    totalPoints: 720,
    matchesPlayed: 38,
    matchesWon: 24,
    joinedAt: '2024-09-10',
  },
  {
    id: '6',
    name: '赵敏',
    nameEn: 'Zhao Min',
    companyName: '面壁智能',
    companyNameEn: 'MiniMax',
    jobTitle: '研发负责人',
    aiSector: '多模态AI',
    skillLevel: 'advanced',
    bio: '多模态AI专家，羽毛球高手。享受在球场上的速度与激情。',
    totalPoints: 890,
    matchesPlayed: 45,
    matchesWon: 32,
    joinedAt: '2024-09-01',
  },
  {
    id: '7',
    name: '周杰',
    nameEn: 'Zhou Jie',
    companyName: '清华大学AIR',
    companyNameEn: 'Tsinghua AIR',
    jobTitle: '博士研究生',
    aiSector: '强化学习',
    skillLevel: 'beginner',
    bio: 'AI方向博士生，研究强化学习。羽毛球新手，希望通过俱乐部活动提升技术，认识业界同行。',
    totalPoints: 180,
    matchesPlayed: 12,
    matchesWon: 4,
    joinedAt: '2024-10-12',
  },
  {
    id: '8',
    name: '吴雪',
    nameEn: 'Wu Xue',
    companyName: '百川智能',
    companyNameEn: 'Baichuan AI',
    jobTitle: '算法工程师',
    aiSector: 'NLP',
    skillLevel: 'intermediate',
    bio: 'NLP算法工程师，参与大模型训练优化。喜欢在打球中放松，用工程思维优化球技。',
    totalPoints: 480,
    matchesPlayed: 24,
    matchesWon: 12,
    joinedAt: '2024-10-08',
  },
  {
    id: '9',
    name: '郑磊',
    nameEn: 'Zheng Lei',
    companyName: '深度求索',
    companyNameEn: 'DeepSeek',
    jobTitle: '技术合伙人',
    aiSector: '强化学习',
    skillLevel: 'expert',
    bio: '强化学习专家，将RL理论应用到羽毛球战术中。',
    totalPoints: 1120,
    matchesPlayed: 58,
    matchesWon: 44,
    joinedAt: '2024-08-25',
  },
  {
    id: '10',
    name: '孙悦',
    nameEn: 'Sun Yue',
    companyName: '真格基金',
    companyNameEn: 'ZhenFund',
    jobTitle: '投资总监',
    aiSector: 'AI早期投资',
    skillLevel: 'intermediate',
    bio: '早期投资人，专注AI赛道。在球场上发现优秀项目，也享受运动带来的思维碰撞。',
    totalPoints: 560,
    matchesPlayed: 30,
    matchesWon: 16,
    joinedAt: '2024-09-28',
  },
  {
    id: '11',
    name: '马云飞',
    nameEn: 'Ma Yunfei',
    companyName: '星尘智能',
    companyNameEn: 'Stardust AI',
    jobTitle: 'CEO',
    aiSector: 'AI基础设施',
    skillLevel: 'advanced',
    bio: 'AI基础设施创业者，羽毛球是最好的减压方式。',
    totalPoints: 780,
    matchesPlayed: 40,
    matchesWon: 26,
    joinedAt: '2024-09-05',
  },
  {
    id: '12',
    name: 'Alex Chen',
    nameEn: 'Alex Chen',
    companyName: 'Recurrent AI',
    jobTitle: 'Research Lead',
    aiSector: 'Robotics AI',
    skillLevel: 'intermediate',
    bio: 'Robotics AI researcher from the US, enjoying badminton in Beijing.',
    totalPoints: 420,
    matchesPlayed: 22,
    matchesWon: 10,
    joinedAt: '2024-10-10',
  },
]

/**
 * Get rankings sorted by total points
 */
export function getRankings(members: SampleMember[]) {
  return members
    .filter((m) => m.matchesPlayed > 0)
    .map((m) => ({
      ...m,
      winRate: m.matchesPlayed > 0 ? Math.round((m.matchesWon / m.matchesPlayed) * 100) : 0,
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .map((m, index) => ({
      ...m,
      rank: index + 1,
    }))
}

/**
 * Get members by skill level
 */
export function getMembersBySkillLevel(
  members: SampleMember[],
  skillLevel: SampleMember['skillLevel']
) {
  return members.filter((m) => m.skillLevel === skillLevel)
}

/**
 * Search members by name or company
 */
export function searchMembers(members: SampleMember[], query: string) {
  const lowerQuery = query.toLowerCase()
  return members.filter(
    (m) =>
      m.name.toLowerCase().includes(lowerQuery) ||
      m.nameEn?.toLowerCase().includes(lowerQuery) ||
      m.companyName?.toLowerCase().includes(lowerQuery) ||
      m.companyNameEn?.toLowerCase().includes(lowerQuery)
  )
}
