/**
 * Members API Route
 * 会员 API 路由
 *
 * Endpoints:
 * - GET /api/members - List all members
 * - POST /api/members - Create new member
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { memberRegistrationSchema } from '@/lib/validations/member'
import { ZodError } from 'zod'
import { MemberStatus, SkillLevel, type Prisma } from '@prisma/client'

/**
 * GET /api/members
 * 获取所有会员列表
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')
    const status = searchParams.get('status')
    const skillLevel = searchParams.get('skillLevel')

    // Build query
    const where: Prisma.MemberWhereInput = {}
    if (status && Object.values(MemberStatus).includes(status as MemberStatus)) {
      where.status = status as MemberStatus
    }
    if (skillLevel && Object.values(SkillLevel).includes(skillLevel as SkillLevel)) {
      where.skillLevel = skillLevel as SkillLevel
    }

    const members = await prisma.member.findMany({
      where,
      orderBy: { totalPoints: 'desc' },
      take: limit ? parseInt(limit) : undefined,
    })

    return NextResponse.json({
      success: true,
      data: members,
      total: members.length,
    })
  } catch (error) {
    console.error('❌ GET /api/members error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch members',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/members
 * 创建新会员
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    console.log('📝 Received member registration:', body)

    // Validate with Zod
    const validated = memberRegistrationSchema.parse(body)

    // Create member in database
    const member = await prisma.member.create({
      data: {
        name: validated.name,
        nameEn: validated.nameEn || null,
        phone: validated.phone || null,
        wechatId: validated.wechatId || null,
        email: validated.email || null,
        bio: validated.bio || null,
        companyName: validated.companyName || null,
        companyNameEn: validated.companyNameEn || null,
        jobTitle: validated.jobTitle || null,
        aiSector: validated.aiSector || null,
        companyStage: validated.companyStage || null,
        skillLevel: validated.skillLevel,
        preferredPosition: validated.preferredPosition || null,
        playStyle: validated.playStyle || null,
        // Default values
        status: 'ACTIVE',
        totalPoints: 0,
        matchesPlayed: 0,
        matchesWon: 0,
      },
    })

    console.log('✅ Member created successfully:', member.id)

    return NextResponse.json(
      {
        success: true,
        data: member,
        message: '会员注册成功',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('❌ POST /api/members error:', error)

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    // Handle Prisma errors
    if (error instanceof Error) {
      // Duplicate phone or email
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          {
            success: false,
            error: '手机号或邮箱已被注册',
          },
          { status: 409 }
        )
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: '注册失败，请重试',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
