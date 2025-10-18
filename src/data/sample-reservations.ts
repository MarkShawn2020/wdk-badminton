/**
 * Sample Reservations Data for WDK Badminton Club
 * 五道口AI创业羽毛球俱乐部 - 示例活动数据
 */

export interface SampleReservation {
  id: string
  venueName: string
  venueAddress: string
  venueDistrict?: string
  date: string // YYYY-MM-DD
  startTime: string // HH:mm
  endTime: string // HH:mm
  organizerId: string
  organizerName: string
  maxParticipants: number
  currentParticipants: number
  status: 'open' | 'full' | 'confirmed' | 'cancelled' | 'completed'
  costPerPerson?: number
  notes?: string
  skillLevelRequirement?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  isCompetition: boolean
}

export const sampleReservations: SampleReservation[] = [
  {
    id: 'r1',
    venueName: '五道口体育馆',
    venueAddress: '北京市海淀区成府路45号',
    venueDistrict: '海淀区',
    date: '2025-10-20',
    startTime: '19:00',
    endTime: '21:00',
    organizerId: '1',
    organizerName: '张伟',
    maxParticipants: 8,
    currentParticipants: 6,
    status: 'open',
    costPerPerson: 45,
    notes: '欢迎中高级水平球友参加。场地条件优良，有更衣室和淋浴。',
    skillLevelRequirement: 'intermediate',
    isCompetition: false,
  },
  {
    id: 'r2',
    venueName: '清华大学体育馆',
    venueAddress: '北京市海淀区清华园',
    venueDistrict: '海淀区',
    date: '2025-10-21',
    startTime: '18:30',
    endTime: '20:30',
    organizerId: '3',
    organizerName: '王强',
    maxParticipants: 12,
    currentParticipants: 12,
    status: 'full',
    costPerPerson: 50,
    notes: '高级水平友谊赛，需要一定基础。',
    skillLevelRequirement: 'advanced',
    isCompetition: true,
  },
  {
    id: 'r3',
    venueName: '北大体育馆',
    venueAddress: '北京市海淀区颐和园路5号',
    venueDistrict: '海淀区',
    date: '2025-10-22',
    startTime: '19:00',
    endTime: '21:00',
    organizerId: '5',
    organizerName: '陈浩',
    maxParticipants: 10,
    currentParticipants: 7,
    status: 'open',
    costPerPerson: 40,
    notes: '适合各种水平的球友，以娱乐为主。',
    isCompetition: false,
  },
  {
    id: 'r4',
    venueName: '中关村体育中心',
    venueAddress: '北京市海淀区中关村大街',
    venueDistrict: '海淀区',
    date: '2025-10-23',
    startTime: '20:00',
    endTime: '22:00',
    organizerId: '6',
    organizerName: '赵敏',
    maxParticipants: 8,
    currentParticipants: 5,
    status: 'open',
    costPerPerson: 55,
    notes: '夜场活动，场地照明良好。适合下班后放松。',
    isCompetition: false,
  },
  {
    id: 'r5',
    venueName: '五道口体育馆',
    venueAddress: '北京市海淀区成府路45号',
    venueDistrict: '海淀区',
    date: '2025-10-24',
    startTime: '19:00',
    endTime: '21:00',
    organizerId: '9',
    organizerName: '郑磊',
    maxParticipants: 10,
    currentParticipants: 8,
    status: 'confirmed',
    costPerPerson: 45,
    notes: '本周五固定活动，欢迎新老球友参加。',
    isCompetition: false,
  },
  {
    id: 'r6',
    venueName: '学院路体育馆',
    venueAddress: '北京市海淀区学院路',
    venueDistrict: '海淀区',
    date: '2025-10-25',
    startTime: '14:00',
    endTime: '16:00',
    organizerId: '2',
    organizerName: '李娜',
    maxParticipants: 8,
    currentParticipants: 3,
    status: 'open',
    costPerPerson: 35,
    notes: '周末下午场，适合初学者和进阶球友。可以带新朋友体验。',
    skillLevelRequirement: 'beginner',
    isCompetition: false,
  },
  {
    id: 'r7',
    venueName: '清华大学体育馆',
    venueAddress: '北京市海淀区清华园',
    venueDistrict: '海淀区',
    date: '2025-10-26',
    startTime: '09:00',
    endTime: '11:00',
    organizerId: '11',
    organizerName: '马云飞',
    maxParticipants: 12,
    currentParticipants: 10,
    status: 'open',
    costPerPerson: 50,
    notes: '周日晨练，享受运动的美好时光。场地条件一流。',
    isCompetition: false,
  },
  {
    id: 'r8',
    venueName: '北航体育馆',
    venueAddress: '北京市海淀区学院路37号',
    venueDistrict: '海淀区',
    date: '2025-10-27',
    startTime: '19:30',
    endTime: '21:30',
    organizerId: '1',
    organizerName: '张伟',
    maxParticipants: 8,
    currentParticipants: 4,
    status: 'open',
    costPerPerson: 48,
    notes: '周一晚场，开启新一周的运动节奏。',
    isCompetition: false,
  },
  {
    id: 'r9',
    venueName: '中关村体育中心',
    venueAddress: '北京市海淀区中关村大街',
    venueDistrict: '海淀区',
    date: '2025-10-28',
    startTime: '19:00',
    endTime: '21:00',
    organizerId: '3',
    organizerName: '王强',
    maxParticipants: 10,
    currentParticipants: 6,
    status: 'open',
    costPerPerson: 55,
    notes: '固定周二场，欢迎各水平球友切磋技艺。',
    isCompetition: false,
  },
  {
    id: 'r10',
    venueName: '五道口体育馆',
    venueAddress: '北京市海淀区成府路45号',
    venueDistrict: '海淀区',
    date: '2025-10-29',
    startTime: '18:00',
    endTime: '20:00',
    organizerId: '6',
    organizerName: '赵敏',
    maxParticipants: 8,
    currentParticipants: 7,
    status: 'open',
    costPerPerson: 45,
    notes: '周三羽毛球之夜，轻松愉快的氛围。',
    isCompetition: false,
  },
]

/**
 * Get upcoming reservations (未来7天的活动)
 */
export function getUpcomingReservations(reservations: SampleReservation[], days = 7) {
  const today = new Date()
  const futureDate = new Date()
  futureDate.setDate(today.getDate() + days)

  return reservations
    .filter((r) => {
      const reservationDate = new Date(r.date)
      return reservationDate >= today && reservationDate <= futureDate && r.status !== 'cancelled'
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

/**
 * Get reservations by status
 */
export function getReservationsByStatus(
  reservations: SampleReservation[],
  status: SampleReservation['status']
) {
  return reservations.filter((r) => r.status === status)
}

/**
 * Get available reservations (open and not full)
 */
export function getAvailableReservations(reservations: SampleReservation[]) {
  return reservations.filter(
    (r) => r.status === 'open' && r.currentParticipants < r.maxParticipants
  )
}

/**
 * Get reservations by venue
 */
export function getReservationsByVenue(reservations: SampleReservation[], venueName: string) {
  return reservations.filter((r) => r.venueName === venueName)
}

/**
 * Check if user can join reservation
 */
export function canJoinReservation(reservation: SampleReservation): boolean {
  return (
    reservation.status === 'open' && reservation.currentParticipants < reservation.maxParticipants
  )
}
