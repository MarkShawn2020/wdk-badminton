/**
 * 示例会员数据 - 用于 Phase 1 静态展示 MVP
 *
 * 在 Phase 2 实现后端后，这些数据将从 Supabase 数据库读取
 */

export interface Member {
  id: string
  name: string
  nameEn?: string
  avatarUrl?: string
  companyName?: string
  companyNameEn?: string
  jobTitle?: string
  aiSector?: string
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  totalPoints: number
  matchesPlayed: number
  matchesWon: number
  bio?: string
  wechatId?: string
  preferredPosition?: 'singles' | 'doubles' | 'both'
}

export const sampleMembers: Member[] = [
  {
    id: '1',
    name: '张伟',
    nameEn: 'Wei Zhang',
    avatarUrl: '/avatars/default-male.jpg',
    companyName: '智谱AI',
    companyNameEn: 'Zhipu AI',
    jobTitle: 'Senior Engineer',
    aiSector: 'NLP & LLM',
    skillLevel: 'advanced',
    totalPoints: 1250,
    matchesPlayed: 45,
    matchesWon: 28,
    bio: '热爱羽毛球，擅长双打配合。喜欢进攻型打法，周末固定打球。',
    preferredPosition: 'doubles',
  },
  {
    id: '2',
    name: '李娜',
    nameEn: 'Na Li',
    avatarUrl: '/avatars/default-female.jpg',
    companyName: '商汤科技',
    companyNameEn: 'SenseTime',
    jobTitle: 'Product Manager',
    aiSector: 'Computer Vision',
    skillLevel: 'intermediate',
    totalPoints: 980,
    matchesPlayed: 32,
    matchesWon: 18,
    bio: '下班后最爱打球，希望能多认识喜欢羽毛球的朋友。',
    preferredPosition: 'both',
  },
  {
    id: '3',
    name: '王强',
    nameEn: 'Qiang Wang',
    avatarUrl: '/avatars/default-male.jpg',
    companyName: '百川智能',
    companyNameEn: 'Baichuan AI',
    jobTitle: 'CTO & Co-founder',
    aiSector: 'Foundation Models',
    skillLevel: 'expert',
    totalPoints: 1580,
    matchesPlayed: 67,
    matchesWon: 48,
    bio: '创业者，羽毛球发烧友。打球10年+，喜欢竞技，也享受交流。',
    preferredPosition: 'singles',
  },
  {
    id: '4',
    name: '刘洋',
    nameEn: 'Yang Liu',
    avatarUrl: '/avatars/default-male.jpg',
    companyName: '月之暗面',
    companyNameEn: 'Moonshot AI',
    jobTitle: 'AI Researcher',
    aiSector: 'Reinforcement Learning',
    skillLevel: 'beginner',
    totalPoints: 320,
    matchesPlayed: 15,
    matchesWon: 6,
    bio: '刚入门羽毛球，希望多练习多交流，提升技术。',
    preferredPosition: 'doubles',
  },
  {
    id: '5',
    name: '陈明',
    nameEn: 'Ming Chen',
    avatarUrl: '/avatars/default-male.jpg',
    companyName: '零一万物',
    companyNameEn: '01.AI',
    jobTitle: 'Tech Lead',
    aiSector: 'Multimodal AI',
    skillLevel: 'advanced',
    totalPoints: 1120,
    matchesPlayed: 41,
    matchesWon: 25,
    bio: '周末固定局组织者，欢迎大家一起来打球！',
    preferredPosition: 'doubles',
  },
  {
    id: '6',
    name: '赵敏',
    nameEn: 'Min Zhao',
    avatarUrl: '/avatars/default-female.jpg',
    companyName: '面壁智能',
    companyNameEn: 'MiniMax',
    jobTitle: 'ML Engineer',
    aiSector: 'Audio & Video Generation',
    skillLevel: 'intermediate',
    totalPoints: 850,
    matchesPlayed: 28,
    matchesWon: 15,
    bio: '喜欢羽毛球，也喜欢认识新朋友。',
    preferredPosition: 'doubles',
  },
  {
    id: '7',
    name: '孙浩',
    nameEn: 'Hao Sun',
    avatarUrl: '/avatars/default-male.jpg',
    companyName: 'Minimax',
    companyNameEn: 'Minimax',
    jobTitle: 'Research Scientist',
    aiSector: 'Text-to-Video',
    skillLevel: 'advanced',
    totalPoints: 1380,
    matchesPlayed: 52,
    matchesWon: 33,
    bio: '专注单打，也喜欢双打。技术流，注重战术配合。',
    preferredPosition: 'both',
  },
  {
    id: '8',
    name: '周雯',
    nameEn: 'Wen Zhou',
    avatarUrl: '/avatars/default-female.jpg',
    companyName: '昆仑万维',
    companyNameEn: 'Kunlun',
    jobTitle: 'Data Scientist',
    aiSector: 'Recommendation Systems',
    skillLevel: 'intermediate',
    totalPoints: 720,
    matchesPlayed: 25,
    matchesWon: 12,
    bio: '羽毛球爱好者，欢迎约球！',
    preferredPosition: 'doubles',
  },
  {
    id: '9',
    name: '吴刚',
    nameEn: 'Gang Wu',
    avatarUrl: '/avatars/default-male.jpg',
    companyName: '深度求索',
    companyNameEn: 'DeepSeek',
    jobTitle: 'Senior Engineer',
    aiSector: 'Deep Learning Infrastructure',
    skillLevel: 'expert',
    totalPoints: 1620,
    matchesPlayed: 71,
    matchesWon: 52,
    bio: '喜欢快节奏的比赛，双打为主。周三晚上固定局。',
    preferredPosition: 'doubles',
  },
  {
    id: '10',
    name: '郑晓',
    nameEn: 'Xiao Zheng',
    avatarUrl: '/avatars/default-female.jpg',
    companyName: 'Stepfun',
    companyNameEn: 'Stepfun',
    jobTitle: 'Product Lead',
    aiSector: 'AI Applications',
    skillLevel: 'beginner',
    totalPoints: 280,
    matchesPlayed: 12,
    matchesWon: 4,
    bio: '新手上路，希望多学习！',
    preferredPosition: 'doubles',
  },
  {
    id: '11',
    name: '黄磊',
    nameEn: 'Lei Huang',
    avatarUrl: '/avatars/default-male.jpg',
    companyName: '星尘智能',
    companyNameEn: 'Stardust AI',
    jobTitle: 'Founder & CEO',
    aiSector: 'AI Agents',
    skillLevel: 'advanced',
    totalPoints: 1450,
    matchesPlayed: 58,
    matchesWon: 38,
    bio: '创业者，通过羽毛球放松和社交。喜欢竞技也喜欢交流。',
    preferredPosition: 'both',
  },
  {
    id: '12',
    name: '林雨',
    nameEn: 'Yu Lin',
    avatarUrl: '/avatars/default-female.jpg',
    companyName: 'Recurrent AI',
    companyNameEn: 'Recurrent AI',
    jobTitle: 'Research Engineer',
    aiSector: 'Reasoning & Planning',
    skillLevel: 'intermediate',
    totalPoints: 890,
    matchesPlayed: 30,
    matchesWon: 17,
    bio: '技术+羽毛球，双重热爱！',
    preferredPosition: 'doubles',
  },
]

/**
 * 根据技能等级筛选会员
 */
export function filterBySkillLevel(members: Member[], skillLevel: Member['skillLevel']): Member[] {
  return members.filter((m) => m.skillLevel === skillLevel)
}

/**
 * 根据公司筛选会员
 */
export function filterByCompany(members: Member[], company: string): Member[] {
  return members.filter((m) => m.companyName?.toLowerCase().includes(company.toLowerCase()))
}

/**
 * 搜索会员（按名字或公司）
 */
export function searchMembers(members: Member[], query: string): Member[] {
  const lowerQuery = query.toLowerCase()
  return members.filter(
    (m) =>
      m.name.toLowerCase().includes(lowerQuery) ||
      m.nameEn?.toLowerCase().includes(lowerQuery) ||
      m.companyName?.toLowerCase().includes(lowerQuery)
  )
}

/**
 * 获取积分排名
 */
export function getRankings(members: Member[]) {
  return members
    .map((member) => ({
      ...member,
      winRate:
        member.matchesPlayed > 0 ? Math.round((member.matchesWon / member.matchesPlayed) * 100) : 0,
    }))
    .sort((a, b) => {
      // 先按总积分排序
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints
      }
      // 如果积分相同，按胜场排序
      return b.matchesWon - a.matchesWon
    })
    .map((member, index) => ({
      ...member,
      rank: index + 1,
    }))
}
