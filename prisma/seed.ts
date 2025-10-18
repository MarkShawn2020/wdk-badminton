/**
 * Prisma Database Seed Script
 * 数据库种子脚本 - 填充示例数据
 *
 * Usage:
 * npx prisma db seed
 */

import {
  PrismaClient,
  SkillLevel,
  MemberStatus,
  ReservationStatus,
  Member,
  Reservation,
} from '@prisma/client'
import { sampleMembers } from '../src/data/sample-members'
import { sampleReservations } from '../src/data/sample-reservations'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...\n')

  // Clear existing data
  console.log('🗑️  Clearing existing data...')
  await prisma.reservationParticipant.deleteMany()
  await prisma.pointTransaction.deleteMany()
  await prisma.matchParticipant.deleteMany()
  await prisma.match.deleteMany()
  await prisma.reservation.deleteMany()
  await prisma.member.deleteMany()
  console.log('✅ Cleared old data\n')

  // Seed members
  console.log('👥 Seeding members...')
  const createdMembers: Member[] = []
  for (const member of sampleMembers) {
    const created = await prisma.member.create({
      data: {
        name: member.name,
        nameEn: member.nameEn || null,
        companyName: member.companyName || null,
        companyNameEn: member.companyNameEn || null,
        jobTitle: member.jobTitle || null,
        aiSector: member.aiSector || null,
        skillLevel: member.skillLevel.toUpperCase() as SkillLevel,
        bio: member.bio || null,
        totalPoints: member.totalPoints,
        matchesPlayed: member.matchesPlayed,
        matchesWon: member.matchesWon,
        status: 'ACTIVE' as MemberStatus,
      },
    })
    createdMembers.push(created)
    console.log(`  ✓ ${created.name} (${created.skillLevel})`)
  }
  console.log(`✅ Created ${createdMembers.length} members\n`)

  // Seed reservations
  console.log('🏟️  Seeding reservations...')
  const createdReservations: Reservation[] = []
  for (const reservation of sampleReservations) {
    // Find organizer by name
    const organizer = createdMembers.find((m) => m.name === reservation.organizerName)
    if (!organizer) {
      console.warn(`  ⚠️  Organizer not found: ${reservation.organizerName}`)
      continue
    }

    const created = await prisma.reservation.create({
      data: {
        venueName: reservation.venueName,
        venueAddress: reservation.venueAddress || null,
        venueDistrict: reservation.venueDistrict || null,
        date: new Date(reservation.date),
        startTime: reservation.startTime,
        endTime: reservation.endTime,
        durationHours: 2.0, // Calculate based on time difference
        organizerId: organizer.id,
        maxParticipants: reservation.maxParticipants,
        currentParticipants: reservation.currentParticipants,
        status: reservation.status.toUpperCase() as ReservationStatus,
        costPerPerson: reservation.costPerPerson || null,
        notes: reservation.notes || null,
        skillLevelRequirement:
          reservation.skillLevelRequirement?.toUpperCase() as SkillLevel | null,
        isCompetition: reservation.isCompetition,
      },
    })
    createdReservations.push(created)
    console.log(`  ✓ ${created.venueName} (${created.date.toISOString().split('T')[0]})`)
  }
  console.log(`✅ Created ${createdReservations.length} reservations\n`)

  // Add some sample participants to reservations
  console.log('🤝 Adding participants to reservations...')
  let participantCount = 0
  for (const reservation of createdReservations) {
    // Add 2-5 random members as participants
    const participantNum = Math.floor(Math.random() * 4) + 2
    const shuffled = [...createdMembers].sort(() => Math.random() - 0.5)
    const participants = shuffled.slice(0, Math.min(participantNum, createdMembers.length))

    for (const participant of participants) {
      await prisma.reservationParticipant.create({
        data: {
          reservationId: reservation.id,
          memberId: participant.id,
          paid: Math.random() > 0.3, // 70% paid
        },
      })
      participantCount++
    }
  }
  console.log(`✅ Added ${participantCount} participant entries\n`)

  console.log('🎉 Seed completed successfully!\n')
  console.log('📊 Summary:')
  console.log(`  • Members: ${createdMembers.length}`)
  console.log(`  • Reservations: ${createdReservations.length}`)
  console.log(`  • Participants: ${participantCount}`)
  console.log('\n💡 Next steps:')
  console.log('  1. Run: npx prisma studio')
  console.log('  2. Visit: http://localhost:5555')
  console.log('  3. Explore your data!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
