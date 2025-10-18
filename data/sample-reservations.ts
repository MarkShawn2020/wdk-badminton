/**
 * 示例预约数据 - 用于 Phase 1 静态展示 MVP
 *
 * 在 Phase 2 实现后端后，这些数据将从 Supabase 数据库读取
 */

export interface Reservation {
  id: string
  venueName: string
  venueAddress: string
  venueDistrict?: string
  courtNumber?: string
  date: string // YYYY-MM-DD
  startTime: string // HH:mm
  endTime: string // HH:mm
  durationHours: number
  organizerId: string
  organizerName: string
  maxParticipants: number
  currentParticipants: number
  participants?: string[] // 参与者名单
  status: 'open' | 'full' | 'confirmed' | 'cancelled' | 'completed'
  totalCost?: number
  costPerPerson?: number
  paymentMethod?: string
  notes?: string
  skillLevelRequirement?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  isCompetition: boolean
}

export const sampleReservations: Reservation[] = [
  {
    id: '1',
    venueName: '五道口体育馆',
    venueAddress: '北京市海淀区成府路28号',
    venueDistrict: '海淀区',
    courtNumber: '3号场',
    date: '2025-10-20',
    startTime: '19:00',
    endTime: '21:00',
    durationHours: 2,
    organizerId: '1',
    organizerName: '张伟',
    maxParticipants: 8,
    currentParticipants: 5,
    participants: ['张伟', '李娜', '王强', '陈明', '赵敏'],
    status: 'open',
    totalCost: 240,
    costPerPerson: 30,
    paymentMethod: 'AA',
    notes: '周六晚上固定局，欢迎所有水平的球友！',
    isCompetition: false,
  },
  {
    id: '2',
    venueName: '清华大学综合体育馆',
    venueAddress: '北京市海淀区清华园1号',
    venueDistrict: '海淀区',
    courtNumber: '1号场',
    date: '2025-10-21',
    startTime: '14:00',
    endTime: '16:00',
    durationHours: 2,
    organizerId: '3',
    organizerName: '王强',
    maxParticipants: 4,
    currentParticipants: 4,
    participants: ['王强', '孙浩', '吴刚', '黄磊'],
    status: 'full',
    totalCost: 200,
    costPerPerson: 50,
    paymentMethod: 'AA',
    notes: '高水平单打练习，限高级及以上。',
    skillLevelRequirement: 'advanced',
    isCompetition: false,
  },
  {
    id: '3',
    venueName: '北京大学邱德拔体育馆',
    venueAddress: '北京市海淀区颐和园路5号',
    venueDistrict: '海淀区',
    courtNumber: '2号场',
    date: '2025-10-22',
    startTime: '18:30',
    endTime: '20:30',
    durationHours: 2,
    organizerId: '5',
    organizerName: '陈明',
    maxParticipants: 8,
    currentParticipants: 6,
    participants: ['陈明', '刘洋', '周雯', '郑晓', '林雨', '赵敏'],
    status: 'open',
    totalCost: 280,
    costPerPerson: 35,
    paymentMethod: '微信AA',
    notes: '欢迎初学者和中级球友，打球的同时也能认识更多AI圈的朋友！',
    isCompetition: false,
  },
  {
    id: '4',
    venueName: '五道口购物中心羽毛球馆',
    venueAddress: '北京市海淀区成府路华清嘉园15号',
    venueDistrict: '海淀区',
    courtNumber: '5号场',
    date: '2025-10-23',
    startTime: '20:00',
    endTime: '22:00',
    durationHours: 2,
    organizerId: '2',
    organizerName: '李娜',
    maxParticipants: 6,
    currentParticipants: 4,
    participants: ['李娜', '赵敏', '周雯', '林雨'],
    status: 'open',
    totalCost: 300,
    costPerPerson: 50,
    paymentMethod: 'AA',
    notes: '女生专场，欢迎女生球友参加！男生陪打也可以。',
    isCompetition: false,
  },
  {
    id: '5',
    venueName: '五道口体育馆',
    venueAddress: '北京市海淀区成府路28号',
    venueDistrict: '海淀区',
    courtNumber: '1号场',
    date: '2025-10-25',
    startTime: '19:00',
    endTime: '22:00',
    durationHours: 3,
    organizerId: '9',
    organizerName: '吴刚',
    maxParticipants: 12,
    currentParticipants: 10,
    participants: ['吴刚', '王强', '张伟', '孙浩', '黄磊', '陈明', '李娜', '赵敏', '周雯', '林雨'],
    status: 'open',
    totalCost: 480,
    costPerPerson: 40,
    paymentMethod: '微信AA',
    notes: '周末大型活动！打球+聚餐，欢迎所有会员参加。',
    isCompetition: false,
  },
  {
    id: '6',
    venueName: '清华大学综合体育馆',
    venueAddress: '北京市海淀区清华园1号',
    venueDistrict: '海淀区',
    courtNumber: '3号场',
    date: '2025-10-27',
    startTime: '18:00',
    endTime: '20:00',
    durationHours: 2,
    organizerId: '11',
    organizerName: '黄磊',
    maxParticipants: 8,
    currentParticipants: 3,
    participants: ['黄磊', '刘洋', '郑晓'],
    status: 'open',
    totalCost: 200,
    costPerPerson: 25,
    paymentMethod: 'AA',
    notes: '周三晚上固定局，适合中级水平球友。',
    skillLevelRequirement: 'intermediate',
    isCompetition: false,
  },
  {
    id: '7',
    venueName: '五道口体育馆',
    venueAddress: '北京市海淀区成府路28号',
    venueDistrict: '海淀区',
    courtNumber: '2号场',
    date: '2025-10-28',
    startTime: '19:00',
    endTime: '21:00',
    durationHours: 2,
    organizerId: '7',
    organizerName: '孙浩',
    maxParticipants: 8,
    currentParticipants: 8,
    participants: ['孙浩', '王强', '吴刚', '黄磊', '张伟', '陈明', '李娜', '赵敏'],
    status: 'full',
    totalCost: 320,
    costPerPerson: 40,
    paymentMethod: '微信AA',
    notes: '周末友谊赛，已满员！',
    isCompetition: true,
  },
  {
    id: '8',
    venueName: '北京大学邱德拔体育馆',
    venueAddress: '北京市海淀区颐和园路5号',
    venueDistrict: '海淀区',
    courtNumber: '4号场',
    date: '2025-10-29',
    startTime: '14:00',
    endTime: '16:00',
    durationHours: 2,
    organizerId: '12',
    organizerName: '林雨',
    maxParticipants: 6,
    currentParticipants: 2,
    participants: ['林雨', '周雯'],
    status: 'open',
    totalCost: 180,
    costPerPerson: 30,
    paymentMethod: 'AA',
    notes: '周日下午，轻松打球，适合初学者和中级水平。',
    skillLevelRequirement: 'beginner',
    isCompetition: false,
  },
]

/**
 * 按日期筛选预约
 */
export function filterByDate(reservations: Reservation[], date: string): Reservation[] {
  return reservations.filter((r) => r.date === date)
}

/**
 * 按状态筛选预约
 */
export function filterByStatus(
  reservations: Reservation[],
  status: Reservation['status']
): Reservation[] {
  return reservations.filter((r) => r.status === status)
}

/**
 * 获取即将到来的预约（未来7天）
 */
export function getUpcomingReservations(reservations: Reservation[]): Reservation[] {
  const now = new Date()
  const sevenDaysLater = new Date()
  sevenDaysLater.setDate(now.getDate() + 7)

  return reservations
    .filter((r) => {
      const reservationDate = new Date(r.date)
      return reservationDate >= now && reservationDate <= sevenDaysLater
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

/**
 * 按场馆分组
 */
export function groupByVenue(reservations: Reservation[]): Record<string, Reservation[]> {
  return reservations.reduce(
    (acc, reservation) => {
      const venue = reservation.venueName
      if (!acc[venue]) {
        acc[venue] = []
      }
      acc[venue].push(reservation)
      return acc
    },
    {} as Record<string, Reservation[]>
  )
}

/**
 * 搜索预约
 */
export function searchReservations(reservations: Reservation[], query: string): Reservation[] {
  const lowerQuery = query.toLowerCase()
  return reservations.filter(
    (r) =>
      r.venueName.toLowerCase().includes(lowerQuery) ||
      r.venueAddress.toLowerCase().includes(lowerQuery) ||
      r.organizerName.toLowerCase().includes(lowerQuery) ||
      r.notes?.toLowerCase().includes(lowerQuery)
  )
}
