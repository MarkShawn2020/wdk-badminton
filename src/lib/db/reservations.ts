/**
 * 预约数据库操作
 */

import { prisma } from './prisma'
import type { Reservation, Prisma } from '@prisma/client'

/**
 * 获取所有预约
 */
export async function getReservations(options?: {
  status?: Reservation['status']
  fromDate?: Date
  toDate?: Date
  limit?: number
  offset?: number
}) {
  const where: Prisma.ReservationWhereInput = {}

  if (options?.status) {
    where.status = options.status
  }

  if (options?.fromDate || options?.toDate) {
    where.date = {}
    if (options.fromDate) {
      where.date.gte = options.fromDate
    }
    if (options.toDate) {
      where.date.lte = options.toDate
    }
  }

  return prisma.reservation.findMany({
    where,
    include: {
      organizer: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
      participants: {
        include: {
          member: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
    orderBy: { date: 'desc' },
    take: options?.limit ?? 20,
    skip: options?.offset,
  })
}

/**
 * 获取即将到来的预约
 */
export async function getUpcomingReservations(days = 7, limit = 20) {
  const now = new Date()
  const futureDate = new Date()
  futureDate.setDate(now.getDate() + days)

  return getReservations({
    fromDate: now,
    toDate: futureDate,
    limit,
  })
}

/**
 * 根据 ID 获取预约
 */
export async function getReservationById(id: string) {
  return prisma.reservation.findUnique({
    where: { id },
    include: {
      organizer: {
        select: {
          id: true,
          name: true,
          nameEn: true,
          avatarUrl: true,
          phone: true,
          wechatId: true,
        },
      },
      participants: {
        include: {
          member: {
            select: {
              id: true,
              name: true,
              nameEn: true,
              avatarUrl: true,
              skillLevel: true,
            },
          },
        },
        orderBy: { joinedAt: 'asc' },
      },
    },
  })
}

/**
 * 创建预约
 */
export async function createReservation(data: Prisma.ReservationCreateInput): Promise<Reservation> {
  return prisma.reservation.create({
    data,
  })
}

/**
 * 更新预约
 */
export async function updateReservation(
  id: string,
  data: Prisma.ReservationUpdateInput
): Promise<Reservation> {
  return prisma.reservation.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  })
}

/**
 * 加入预约（使用数据库函数，保证原子性）
 */
export async function joinReservation(reservationId: string, memberId: string) {
  try {
    const result = await prisma.$queryRaw<Array<{ join_reservation: string }>>`
      SELECT join_reservation(
        ${reservationId}::TEXT,
        ${memberId}::TEXT
      )
    `

    // 解析结果
    const jsonResult = JSON.parse(result[0].join_reservation)

    if (!jsonResult.success) {
      throw new Error('Failed to join reservation')
    }

    // 返回更新后的预约信息
    return getReservationById(reservationId)
  } catch (error) {
    // 处理数据库函数抛出的异常
    const errorMessage = error instanceof Error ? error.message : String(error)
    if (errorMessage.includes('Reservation is full')) {
      throw new Error('预约已满')
    }
    if (errorMessage.includes('Already joined')) {
      throw new Error('您已经报名了该活动')
    }
    if (errorMessage.includes('Reservation not found')) {
      throw new Error('预约不存在')
    }
    throw error
  }
}

/**
 * 取消报名
 */
export async function leaveReservation(reservationId: string, memberId: string) {
  return prisma.$transaction(async (tx) => {
    // 检查是否已报名
    const participant = await tx.reservationParticipant.findUnique({
      where: {
        reservationId_memberId: {
          reservationId,
          memberId,
        },
      },
    })

    if (!participant) {
      throw new Error('您还没有报名该活动')
    }

    // 删除参与记录
    await tx.reservationParticipant.delete({
      where: {
        reservationId_memberId: {
          reservationId,
          memberId,
        },
      },
    })

    // 更新预约人数
    const reservation = await tx.reservation.update({
      where: { id: reservationId },
      data: {
        currentParticipants: { decrement: 1 },
        status: 'OPEN', // 有人退出，状态改为开放
        updatedAt: new Date(),
      },
    })

    return reservation
  })
}

/**
 * 搜索预约
 */
export async function searchReservations(query: string, limit = 20) {
  return prisma.reservation.findMany({
    where: {
      OR: [
        { venueName: { contains: query, mode: 'insensitive' } },
        { venueAddress: { contains: query, mode: 'insensitive' } },
        { venueDistrict: { contains: query, mode: 'insensitive' } },
        { notes: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: {
      organizer: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: { date: 'desc' },
    take: limit,
  })
}

/**
 * 按场馆分组统计
 */
export async function getVenueStats() {
  return prisma.reservation.groupBy({
    by: ['venueName'],
    _count: {
      id: true,
    },
    _avg: {
      currentParticipants: true,
    },
    orderBy: {
      _count: {
        id: 'desc',
      },
    },
  })
}
