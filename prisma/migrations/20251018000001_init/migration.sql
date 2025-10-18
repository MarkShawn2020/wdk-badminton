-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "PreferredPosition" AS ENUM ('SINGLES', 'DOUBLES', 'BOTH');

-- CreateEnum
CREATE TYPE "CompanyStage" AS ENUM ('SEED', 'SERIES_A', 'SERIES_B', 'SERIES_C', 'GROWTH', 'MATURE');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('MATCH_WIN', 'MATCH_LOSS', 'PARTICIPATION', 'ADMIN_ADJUSTMENT', 'SEASON_BONUS', 'PENALTY');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('OPEN', 'FULL', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('WECHAT', 'ALIPAY', 'CASH', 'AA');

-- CreateEnum
CREATE TYPE "MatchType" AS ENUM ('SINGLES', 'DOUBLES', 'MIXED_DOUBLES');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('PENDING', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "members" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "name" VARCHAR(100) NOT NULL,
    "name_en" VARCHAR(100),
    "avatar_url" TEXT,
    "bio" TEXT,
    "phone" VARCHAR(20),
    "wechat_id" VARCHAR(50),
    "email" VARCHAR(255),
    "company_name" VARCHAR(200),
    "company_name_en" VARCHAR(200),
    "job_title" VARCHAR(100),
    "ai_sector" VARCHAR(100),
    "company_stage" "CompanyStage",
    "skill_level" "SkillLevel" NOT NULL DEFAULT 'BEGINNER',
    "play_style" TEXT,
    "preferred_position" "PreferredPosition",
    "achievements" TEXT,
    "status" "MemberStatus" NOT NULL DEFAULT 'ACTIVE',
    "total_points" INTEGER NOT NULL DEFAULT 0,
    "matches_played" INTEGER NOT NULL DEFAULT 0,
    "matches_won" INTEGER NOT NULL DEFAULT 0,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_active_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "point_transactions" (
    "id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "balance_after" INTEGER NOT NULL,
    "reason" VARCHAR(200) NOT NULL,
    "transaction_type" "TransactionType" NOT NULL,
    "match_id" TEXT,
    "reservation_id" TEXT,
    "admin_id" TEXT,
    "admin_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "point_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "id" TEXT NOT NULL,
    "venue_name" VARCHAR(200) NOT NULL,
    "venue_address" TEXT,
    "venue_district" VARCHAR(50),
    "court_number" VARCHAR(20),
    "date" DATE NOT NULL,
    "start_time" VARCHAR(5) NOT NULL,
    "end_time" VARCHAR(5) NOT NULL,
    "duration_hours" DECIMAL(3,1) NOT NULL,
    "organizer_id" TEXT NOT NULL,
    "max_participants" INTEGER NOT NULL DEFAULT 8,
    "current_participants" INTEGER NOT NULL DEFAULT 1,
    "total_cost" DECIMAL(10,2),
    "cost_per_person" DECIMAL(10,2),
    "payment_method" "PaymentMethod",
    "status" "ReservationStatus" NOT NULL DEFAULT 'OPEN',
    "notes" TEXT,
    "skill_level_requirement" "SkillLevel",
    "is_competition" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservation_participants" (
    "id" TEXT NOT NULL,
    "reservation_id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "payment_amount" DECIMAL(10,2),
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reservation_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "match_date" DATE NOT NULL,
    "match_type" "MatchType" NOT NULL,
    "team_a_score" INTEGER NOT NULL,
    "team_b_score" INTEGER NOT NULL,
    "winner" VARCHAR(1) NOT NULL,
    "reservation_id" TEXT,
    "points_awarded" INTEGER,
    "status" "MatchStatus" NOT NULL DEFAULT 'COMPLETED',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_participants" (
    "id" TEXT NOT NULL,
    "match_id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "team" VARCHAR(1) NOT NULL,
    "points_earned" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "match_participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "members_user_id_key" ON "members"("user_id");

-- CreateIndex
CREATE INDEX "members_user_id_idx" ON "members"("user_id");

-- CreateIndex
CREATE INDEX "members_status_idx" ON "members"("status");

-- CreateIndex
CREATE INDEX "members_skill_level_idx" ON "members"("skill_level");

-- CreateIndex
CREATE INDEX "members_total_points_idx" ON "members"("total_points" DESC);

-- CreateIndex
CREATE INDEX "members_company_name_idx" ON "members"("company_name");

-- CreateIndex
CREATE INDEX "point_transactions_member_id_idx" ON "point_transactions"("member_id");

-- CreateIndex
CREATE INDEX "point_transactions_created_at_idx" ON "point_transactions"("created_at" DESC);

-- CreateIndex
CREATE INDEX "point_transactions_match_id_idx" ON "point_transactions"("match_id");

-- CreateIndex
CREATE INDEX "point_transactions_transaction_type_idx" ON "point_transactions"("transaction_type");

-- CreateIndex
CREATE INDEX "reservations_date_idx" ON "reservations"("date" DESC);

-- CreateIndex
CREATE INDEX "reservations_organizer_id_idx" ON "reservations"("organizer_id");

-- CreateIndex
CREATE INDEX "reservations_status_idx" ON "reservations"("status");

-- CreateIndex
CREATE INDEX "reservations_date_status_idx" ON "reservations"("date" DESC, "status");

-- CreateIndex
CREATE UNIQUE INDEX "reservation_participants_reservation_id_member_id_key" ON "reservation_participants"("reservation_id", "member_id");

-- CreateIndex
CREATE INDEX "reservation_participants_reservation_id_idx" ON "reservation_participants"("reservation_id");

-- CreateIndex
CREATE INDEX "reservation_participants_member_id_idx" ON "reservation_participants"("member_id");

-- CreateIndex
CREATE INDEX "matches_match_date_idx" ON "matches"("match_date" DESC);

-- CreateIndex
CREATE INDEX "matches_reservation_id_idx" ON "matches"("reservation_id");

-- CreateIndex
CREATE INDEX "matches_status_idx" ON "matches"("status");

-- CreateIndex
CREATE UNIQUE INDEX "match_participants_match_id_member_id_key" ON "match_participants"("match_id", "member_id");

-- CreateIndex
CREATE INDEX "match_participants_match_id_idx" ON "match_participants"("match_id");

-- CreateIndex
CREATE INDEX "match_participants_member_id_idx" ON "match_participants"("member_id");

-- AddForeignKey
ALTER TABLE "point_transactions" ADD CONSTRAINT "point_transactions_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "point_transactions" ADD CONSTRAINT "point_transactions_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "point_transactions" ADD CONSTRAINT "point_transactions_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_participants" ADD CONSTRAINT "reservation_participants_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservation_participants" ADD CONSTRAINT "reservation_participants_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_participants" ADD CONSTRAINT "match_participants_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "match_participants" ADD CONSTRAINT "match_participants_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateView: rankings (实时排名视图)
CREATE OR REPLACE VIEW rankings AS
SELECT
  m.id,
  m.user_id,
  m.name,
  m.name_en,
  m.avatar_url,
  m.company_name,
  m.skill_level,
  m.total_points,
  m.matches_played,
  m.matches_won,
  CASE
    WHEN m.matches_played > 0
    THEN ROUND((m.matches_won::NUMERIC / m.matches_played::NUMERIC) * 100, 1)
    ELSE 0
  END as win_rate,
  ROW_NUMBER() OVER (ORDER BY m.total_points DESC, m.matches_won DESC) as rank
FROM members m
WHERE m.status = 'ACTIVE'
ORDER BY m.total_points DESC, m.matches_won DESC;

-- Function: 添加积分
CREATE OR REPLACE FUNCTION add_points(
  p_member_id TEXT,
  p_points INTEGER,
  p_reason TEXT,
  p_transaction_type "TransactionType",
  p_match_id TEXT DEFAULT NULL,
  p_admin_id TEXT DEFAULT NULL
) RETURNS void AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  -- 更新会员总积分
  UPDATE members
  SET total_points = total_points + p_points,
      updated_at = NOW()
  WHERE id = p_member_id
  RETURNING total_points INTO v_new_balance;

  -- 记录积分交易
  INSERT INTO point_transactions (
    id,
    member_id,
    points,
    balance_after,
    reason,
    transaction_type,
    match_id,
    admin_id
  ) VALUES (
    gen_random_uuid()::TEXT,
    p_member_id,
    p_points,
    v_new_balance,
    p_reason,
    p_transaction_type,
    p_match_id,
    p_admin_id
  );
END;
$$ LANGUAGE plpgsql;

-- Function: 加入预约（原子操作）
CREATE OR REPLACE FUNCTION join_reservation(
  p_reservation_id TEXT,
  p_member_id TEXT
) RETURNS json AS $$
DECLARE
  v_max_participants INTEGER;
  v_current_participants INTEGER;
  v_status "ReservationStatus";
  v_result json;
BEGIN
  -- 锁定预约行，防止并发问题
  SELECT max_participants, current_participants, status
  INTO v_max_participants, v_current_participants, v_status
  FROM reservations
  WHERE id = p_reservation_id
  FOR UPDATE;

  -- 检查预约是否存在
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Reservation not found';
  END IF;

  -- 检查是否已满
  IF v_current_participants >= v_max_participants THEN
    RAISE EXCEPTION 'Reservation is full';
  END IF;

  -- 检查是否已经报名
  IF EXISTS (
    SELECT 1 FROM reservation_participants
    WHERE reservation_id = p_reservation_id AND member_id = p_member_id
  ) THEN
    RAISE EXCEPTION 'Already joined this reservation';
  END IF;

  -- 添加参与者
  INSERT INTO reservation_participants (id, reservation_id, member_id)
  VALUES (gen_random_uuid()::TEXT, p_reservation_id, p_member_id);

  -- 更新预约人数和状态
  UPDATE reservations
  SET current_participants = current_participants + 1,
      status = CASE
        WHEN current_participants + 1 >= max_participants THEN 'FULL'::ReservationStatus
        ELSE status
      END,
      updated_at = NOW()
  WHERE id = p_reservation_id;

  -- 返回结果
  SELECT json_build_object(
    'success', true,
    'current_participants', current_participants + 1,
    'max_participants', v_max_participants
  ) INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;
