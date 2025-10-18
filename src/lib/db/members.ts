/**
 * 会员数据库操作
 */

import { prisma } from './prisma'
import type { Member, Prisma, TransactionType } from '@prisma/client'

/**
 * 获取所有活跃会员
 */
export async function getActiveMembers(options?: {
  limit?: number
  offset?: number
  skillLevel?: Member['skillLevel']
  companyName?: string
}) {
  const where: Prisma.MemberWhereInput = {
    status: 'ACTIVE',
  }

  if (options?.skillLevel) {
    where.skillLevel = options.skillLevel
  }

  if (options?.companyName) {
    where.companyName = {
      contains: options.companyName,
      mode: 'insensitive',
    }
  }

  return prisma.member.findMany({
    where,
    orderBy: { totalPoints: 'desc' },
    take: options?.limit ?? 50,
    skip: options?.offset,
  })
}

/**
 * 根据 ID 获取会员
 */
export async function getMemberById(id: string) {
  return prisma.member.findUnique({
    where: { id },
    include: {
      pointTransactions: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      organizedReservations: {
        orderBy: { date: 'desc' },
        take: 5,
      },
      reservationParticipations: {
        include: {
          reservation: true,
        },
        orderBy: { joinedAt: 'desc' },
        take: 10,
      },
    },
  })
}

/**
 * 根据 userId 获取会员
 */
export async function getMemberByUserId(userId: string) {
  return prisma.member.findUnique({
    where: { userId },
  })
}

/**
 * 创建会员
 */
export async function createMember(data: Prisma.MemberCreateInput): Promise<Member> {
  return prisma.member.create({
    data,
  })
}

/**
 * 更新会员信息
 */
export async function updateMember(id: string, data: Prisma.MemberUpdateInput): Promise<Member> {
  return prisma.member.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  })
}

/**
 * 搜索会员
 */
export async function searchMembers(query: string, limit = 20) {
  return prisma.member.findMany({
    where: {
      status: 'ACTIVE',
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { nameEn: { contains: query, mode: 'insensitive' } },
        { companyName: { contains: query, mode: 'insensitive' } },
        { companyNameEn: { contains: query, mode: 'insensitive' } },
      ],
    },
    orderBy: { totalPoints: 'desc' },
    take: limit,
  })
}

/**
 * 获取排名
 */
export async function getRankings(limit = 50) {
  // 使用视图查询
  return prisma.$queryRaw<
    Array<{
      id: string
      name: string
      nameEn: string | null
      avatarUrl: string | null
      companyName: string | null
      skillLevel: string
      totalPoints: number
      matchesPlayed: number
      matchesWon: number
      winRate: number
      rank: number
    }>
  >`
    SELECT * FROM rankings
    LIMIT ${limit}
  `
}

/**
 * 添加积分（使用数据库函数）
 */
export async function addPoints(
  memberId: string,
  points: number,
  reason: string,
  transactionType: TransactionType,
  options?: {
    matchId?: string
    adminId?: string
  }
) {
  await prisma.$executeRaw`
    SELECT add_points(
      ${memberId}::TEXT,
      ${points}::INTEGER,
      ${reason}::TEXT,
      ${transactionType}::"TransactionType",
      ${options?.matchId ?? null}::TEXT,
      ${options?.adminId ?? null}::TEXT
    )
  `

  // 返回更新后的会员信息
  return getMemberById(memberId)
}
