-- ============================================================================
-- BADMINTON CLUB DATABASE TRANSFORMATION
-- 将视频处理平台转型为羽毛球俱乐部管理系统
-- ============================================================================

-- Step 1: 备份现有表（加上 _old 后缀，保留以防万一）
ALTER TABLE IF EXISTS videos RENAME TO videos_old;
ALTER TABLE IF EXISTS user_credits RENAME TO user_credits_old;

-- ============================================================================
-- MEMBERS TABLE (会员表)
-- 存储俱乐部成员信息
-- ============================================================================
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  -- 基本信息
  name VARCHAR(100) NOT NULL,
  name_en VARCHAR(100), -- 英文名（可选）
  avatar_url TEXT,
  bio TEXT,
  phone VARCHAR(20),
  wechat_id VARCHAR(50),
  email VARCHAR(255),

  -- AI创业信息
  company_name VARCHAR(200),
  company_name_en VARCHAR(200),
  job_title VARCHAR(100),
  ai_sector VARCHAR(100), -- AI领域：CV/NLP/Robotics/etc
  company_stage VARCHAR(50), -- 公司阶段：seed/series_a/series_b/growth

  -- 羽毛球信息
  skill_level VARCHAR(20) NOT NULL DEFAULT 'beginner',
    -- beginner(初学)/intermediate(进阶)/advanced(高级)/expert(专家)
  play_style TEXT, -- 打法风格描述
  preferred_position VARCHAR(20), -- singles(单打)/doubles(双打)/both(都可以)
  achievements TEXT, -- 成就记录（JSON或纯文本）

  -- 状态与统计
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- active/inactive/suspended
  total_points INTEGER NOT NULL DEFAULT 0,
  matches_played INTEGER NOT NULL DEFAULT 0,
  matches_won INTEGER NOT NULL DEFAULT 0,

  -- 时间戳
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- 约束
  CONSTRAINT valid_status CHECK (status IN ('active', 'inactive', 'suspended')),
  CONSTRAINT valid_skill_level CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  CONSTRAINT valid_preferred_position CHECK (preferred_position IN ('singles', 'doubles', 'both') OR preferred_position IS NULL)
);

-- 索引
CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_members_skill_level ON members(skill_level);
CREATE INDEX idx_members_total_points ON members(total_points DESC);
CREATE INDEX idx_members_company_name ON members(company_name);

-- RLS 策略
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- 所有人可查看活跃会员的基本信息
CREATE POLICY "Anyone can view active members"
  ON members FOR SELECT
  USING (status = 'active');

-- 用户可以查看自己的完整信息（包括私密字段）
CREATE POLICY "Users can view their own profile"
  ON members FOR SELECT
  USING (auth.uid() = user_id);

-- 用户可以更新自己的信息
CREATE POLICY "Users can update their own profile"
  ON members FOR UPDATE
  USING (auth.uid() = user_id);

-- 用户可以创建自己的profile
CREATE POLICY "Users can insert their own profile"
  ON members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- POINT_TRANSACTIONS TABLE (积分交易记录)
-- 跟踪所有积分变动
-- ============================================================================
CREATE TABLE point_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,

  -- 积分变动
  points INTEGER NOT NULL, -- 正数=获得，负数=扣除
  balance_after INTEGER NOT NULL, -- 交易后余额

  -- 原因与关联
  reason VARCHAR(200) NOT NULL, -- 描述：赢得比赛/参加活动/管理员调整
  transaction_type VARCHAR(50) NOT NULL,
    -- match_win/match_loss/participation/admin_adjustment/season_bonus
  match_id UUID, -- 关联比赛（如果有）
  reservation_id UUID, -- 关联预约（如果有）

  -- 管理员操作
  admin_id UUID REFERENCES members(id), -- 如果是管理员操作
  admin_note TEXT,

  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- 约束
  CONSTRAINT valid_transaction_type CHECK (
    transaction_type IN (
      'match_win', 'match_loss', 'participation',
      'admin_adjustment', 'season_bonus', 'penalty'
    )
  )
);

-- 索引
CREATE INDEX idx_point_transactions_member_id ON point_transactions(member_id);
CREATE INDEX idx_point_transactions_created_at ON point_transactions(created_at DESC);
CREATE INDEX idx_point_transactions_match_id ON point_transactions(match_id) WHERE match_id IS NOT NULL;

-- RLS 策略
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;

-- 用户可以查看自己的积分记录
CREATE POLICY "Users can view their own transactions"
  ON point_transactions FOR SELECT
  USING (
    member_id IN (SELECT id FROM members WHERE user_id = auth.uid())
  );

-- 管理员可以插入积分记录（暂时允许，后续可通过函数控制）
CREATE POLICY "Authenticated users can insert transactions"
  ON point_transactions FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================================
-- RESERVATIONS TABLE (场地预约)
-- 存储羽毛球场地预约信息
-- ============================================================================
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 场地信息
  venue_name VARCHAR(200) NOT NULL,
  venue_address TEXT,
  venue_district VARCHAR(50), -- 区域：海淀/朝阳/etc
  court_number VARCHAR(20), -- 场地号：1号场/2号场

  -- 时间安排
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_hours NUMERIC(3,1) NOT NULL, -- 时长（小时）

  -- 组织者
  organizer_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,

  -- 参与者限制
  max_participants INTEGER NOT NULL DEFAULT 8,
  current_participants INTEGER NOT NULL DEFAULT 1, -- 创建者自动算1个

  -- 费用
  total_cost NUMERIC(10,2), -- 总费用（元）
  cost_per_person NUMERIC(10,2), -- 人均费用
  payment_method VARCHAR(50), -- wechat/alipay/cash/aa

  -- 状态
  status VARCHAR(20) NOT NULL DEFAULT 'open',
    -- open(开放报名)/full(已满)/confirmed(已确认)/cancelled(已取消)/completed(已完成)

  -- 备注
  notes TEXT,
  skill_level_requirement VARCHAR(20), -- 要求技能等级
  is_competition BOOLEAN DEFAULT false, -- 是否为比赛

  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- 约束
  CONSTRAINT valid_status CHECK (
    status IN ('open', 'full', 'confirmed', 'cancelled', 'completed')
  ),
  CONSTRAINT valid_participants CHECK (current_participants <= max_participants),
  CONSTRAINT valid_time CHECK (end_time > start_time),
  CONSTRAINT valid_duration CHECK (duration_hours > 0 AND duration_hours <= 24)
);

-- 索引
CREATE INDEX idx_reservations_date ON reservations(date DESC);
CREATE INDEX idx_reservations_organizer_id ON reservations(organizer_id);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_date_status ON reservations(date DESC, status);

-- RLS 策略
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- 所有人可以查看预约
CREATE POLICY "Anyone can view reservations"
  ON reservations FOR SELECT
  USING (true);

-- 认证用户可以创建预约
CREATE POLICY "Authenticated users can create reservations"
  ON reservations FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    organizer_id IN (SELECT id FROM members WHERE user_id = auth.uid())
  );

-- 组织者可以更新/删除自己的预约
CREATE POLICY "Organizers can update their reservations"
  ON reservations FOR UPDATE
  USING (
    organizer_id IN (SELECT id FROM members WHERE user_id = auth.uid())
  );

CREATE POLICY "Organizers can delete their reservations"
  ON reservations FOR DELETE
  USING (
    organizer_id IN (SELECT id FROM members WHERE user_id = auth.uid())
  );

-- ============================================================================
-- RESERVATION_PARTICIPANTS TABLE (预约参与者 - 多对多关系)
-- ============================================================================
CREATE TABLE reservation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,

  -- 支付状态
  paid BOOLEAN DEFAULT false,
  payment_amount NUMERIC(10,2),

  -- 时间戳
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- 唯一约束：每个会员每个预约只能报名一次
  UNIQUE(reservation_id, member_id)
);

-- 索引
CREATE INDEX idx_reservation_participants_reservation_id ON reservation_participants(reservation_id);
CREATE INDEX idx_reservation_participants_member_id ON reservation_participants(member_id);

-- RLS 策略
ALTER TABLE reservation_participants ENABLE ROW LEVEL SECURITY;

-- 所有人可以查看参与者列表
CREATE POLICY "Anyone can view participants"
  ON reservation_participants FOR SELECT
  USING (true);

-- 认证用户可以报名参加
CREATE POLICY "Authenticated users can join reservations"
  ON reservation_participants FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND
    member_id IN (SELECT id FROM members WHERE user_id = auth.uid())
  );

-- 用户可以取消自己的报名
CREATE POLICY "Users can cancel their participation"
  ON reservation_participants FOR DELETE
  USING (
    member_id IN (SELECT id FROM members WHERE user_id = auth.uid())
  );

-- ============================================================================
-- MATCHES TABLE (比赛记录 - 未来功能)
-- ============================================================================
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- 比赛基本信息
  match_date DATE NOT NULL,
  match_type VARCHAR(50) NOT NULL, -- singles/doubles/mixed_doubles

  -- 比分
  team_a_score INTEGER NOT NULL,
  team_b_score INTEGER NOT NULL,
  winner VARCHAR(1) NOT NULL, -- 'A' or 'B'

  -- 关联
  reservation_id UUID REFERENCES reservations(id),

  -- 积分影响
  points_awarded INTEGER, -- 获胜方每人获得的积分

  -- 状态
  status VARCHAR(20) NOT NULL DEFAULT 'completed',
  verified BOOLEAN DEFAULT false, -- 是否经过管理员验证

  -- 备注
  notes TEXT,

  -- 时间戳
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- 约束
  CONSTRAINT valid_match_type CHECK (
    match_type IN ('singles', 'doubles', 'mixed_doubles')
  ),
  CONSTRAINT valid_winner CHECK (winner IN ('A', 'B')),
  CONSTRAINT valid_scores CHECK (team_a_score >= 0 AND team_b_score >= 0)
);

-- 索引
CREATE INDEX idx_matches_match_date ON matches(match_date DESC);
CREATE INDEX idx_matches_reservation_id ON matches(reservation_id);

-- RLS 策略
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- 所有人可以查看比赛记录
CREATE POLICY "Anyone can view matches"
  ON matches FOR SELECT
  USING (true);

-- 认证用户可以创建比赛记录
CREATE POLICY "Authenticated users can create matches"
  ON matches FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================================
-- MATCH_PARTICIPANTS TABLE (比赛参与者)
-- ============================================================================
CREATE TABLE match_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,

  team CHAR(1) NOT NULL, -- 'A' or 'B'
  points_earned INTEGER DEFAULT 0, -- 该比赛获得的积分

  -- 唯一约束
  UNIQUE(match_id, member_id),

  -- 约束
  CONSTRAINT valid_team CHECK (team IN ('A', 'B'))
);

-- 索引
CREATE INDEX idx_match_participants_match_id ON match_participants(match_id);
CREATE INDEX idx_match_participants_member_id ON match_participants(member_id);

-- RLS 策略
ALTER TABLE match_participants ENABLE ROW LEVEL SECURITY;

-- 所有人可以查看参赛者
CREATE POLICY "Anyone can view match participants"
  ON match_participants FOR SELECT
  USING (true);

-- ============================================================================
-- RANKINGS VIEW (排名视图 - 实时计算)
-- ============================================================================
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
WHERE m.status = 'active'
ORDER BY m.total_points DESC, m.matches_won DESC;

-- ============================================================================
-- 辅助函数：添加积分
-- ============================================================================
CREATE OR REPLACE FUNCTION add_points(
  p_member_id UUID,
  p_points INTEGER,
  p_reason TEXT,
  p_transaction_type VARCHAR(50),
  p_match_id UUID DEFAULT NULL,
  p_admin_id UUID DEFAULT NULL
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
    member_id,
    points,
    balance_after,
    reason,
    transaction_type,
    match_id,
    admin_id
  ) VALUES (
    p_member_id,
    p_points,
    v_new_balance,
    p_reason,
    p_transaction_type,
    p_match_id,
    p_admin_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 辅助函数：加入预约（原子操作）
-- ============================================================================
CREATE OR REPLACE FUNCTION join_reservation(
  p_reservation_id UUID,
  p_member_id UUID
) RETURNS json AS $$
DECLARE
  v_max_participants INTEGER;
  v_current_participants INTEGER;
  v_result json;
BEGIN
  -- 锁定预约行，防止并发问题
  SELECT max_participants, current_participants
  INTO v_max_participants, v_current_participants
  FROM reservations
  WHERE id = p_reservation_id
  FOR UPDATE;

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
  INSERT INTO reservation_participants (reservation_id, member_id)
  VALUES (p_reservation_id, p_member_id);

  -- 更新预约人数
  UPDATE reservations
  SET current_participants = current_participants + 1,
      status = CASE
        WHEN current_participants + 1 >= max_participants THEN 'full'
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 触发器：自动更新 updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 种子数据：示例会员（供测试）
-- ============================================================================
-- 注意：实际使用时，这些数据应该通过应用层创建，这里仅作为示例

-- COMMENT: 以下是示例数据，生产环境应删除或修改
/*
INSERT INTO members (name, name_en, company_name, job_title, ai_sector, skill_level, bio, status) VALUES
('张伟', 'Wei Zhang', '智谱AI', 'Senior Engineer', 'NLP', 'advanced', '热爱羽毛球，擅长双打', 'active'),
('李娜', 'Na Li', '商汤科技', 'Product Manager', 'CV', 'intermediate', '下班后最爱打球', 'active'),
('王强', 'Qiang Wang', '百川智能', 'CTO', 'LLM', 'expert', '创业者，羽毛球发烧友', 'active'),
('刘洋', 'Yang Liu', '月之暗面', 'AI Researcher', 'Reinforcement Learning', 'beginner', '刚入门，希望多交流', 'active'),
('陈明', 'Ming Chen', '零一万物', 'Tech Lead', 'Multimodal AI', 'advanced', '周末固定局', 'active');
*/

-- ============================================================================
-- 完成通知
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Badminton club database transformation completed successfully!';
  RAISE NOTICE '📊 Tables created: members, point_transactions, reservations, reservation_participants, matches, match_participants';
  RAISE NOTICE '👁️  Views created: rankings';
  RAISE NOTICE '⚙️  Functions created: add_points, join_reservation';
  RAISE NOTICE '🔐 RLS policies enabled for all tables';
END $$;
