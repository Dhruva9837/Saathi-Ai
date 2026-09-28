-- ==========================================
-- STEP 1: CORE TABLES & ROW LEVEL SECURITY (RLS)
-- Paste and run this in Supabase SQL Editor first
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT 'Learner',
    email TEXT,
    avatar_url TEXT,
    streak_days INT NOT NULL DEFAULT 1,
    total_xp INT NOT NULL DEFAULT 0,
    level INT NOT NULL DEFAULT 1,
    coach_persona TEXT NOT NULL DEFAULT 'supportive',
    adaptation_sensitivity TEXT NOT NULL DEFAULT 'balanced',
    daily_reminders BOOLEAN NOT NULL DEFAULT TRUE,
    sound_effects BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. GOALS
CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    deadline DATE NOT NULL,
    current_level TEXT NOT NULL CHECK (current_level IN ('beginner', 'intermediate', 'advanced')),
    daily_minutes_target INT NOT NULL DEFAULT 60,
    preferred_schedule TEXT NOT NULL CHECK (preferred_schedule IN ('morning', 'afternoon', 'evening', 'flexible')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    category TEXT NOT NULL DEFAULT 'coding',
    weak_areas TEXT[] DEFAULT '{}',
    strong_areas TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. MILESTONES
CREATE TABLE IF NOT EXISTS milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INT NOT NULL,
    status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'in_progress', 'completed')),
    estimated_days INT NOT NULL DEFAULT 14,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TASKS
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    milestone_id UUID NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    estimated_minutes INT NOT NULL DEFAULT 30,
    actual_minutes INT,
    due_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'missed', 'adapted')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    topic TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    was_adapted BOOLEAN NOT NULL DEFAULT FALSE,
    adaptation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. DAILY CHECK-INS
CREATE TABLE IF NOT EXISTS checkins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    checkin_date DATE NOT NULL DEFAULT CURRENT_DATE,
    completed_task_ids UUID[] DEFAULT '{}',
    actual_minutes_spent INT NOT NULL DEFAULT 0,
    perceived_difficulty INT NOT NULL CHECK (perceived_difficulty BETWEEN 1 AND 5),
    mood TEXT NOT NULL DEFAULT 'good' CHECK (mood IN ('great', 'good', 'neutral', 'struggling', 'burnt_out')),
    confidence_score INT NOT NULL CHECK (confidence_score BETWEEN 1 AND 5),
    blockers TEXT,
    reflection_notes TEXT,
    ai_feedback_summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. AI INSIGHTS
CREATE TABLE IF NOT EXISTS ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    insight_type TEXT NOT NULL,
    trigger_reason TEXT,
    previous_daily_target_minutes INT,
    proposed_daily_target_minutes INT,
    rescheduled_tasks_count INT DEFAULT 0,
    key_changes_summary TEXT[] DEFAULT '{}',
    coach_encouragement TEXT,
    is_applied BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_milestones_goal_id ON milestones(goal_id);
CREATE INDEX IF NOT EXISTS idx_tasks_goal_id ON tasks(goal_id);
CREATE INDEX IF NOT EXISTS idx_tasks_milestone_id ON tasks(milestone_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_checkins_goal_date ON checkins(goal_id, checkin_date);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can view and update their own profile" ON profiles;
CREATE POLICY "Users can view and update their own profile" ON profiles FOR ALL USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can manage their own goals" ON goals;
CREATE POLICY "Users can manage their own goals" ON goals FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage milestones of their goals" ON milestones;
CREATE POLICY "Users can manage milestones of their goals" ON milestones FOR ALL USING (EXISTS (SELECT 1 FROM goals WHERE goals.id = milestones.goal_id AND goals.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can manage tasks of their goals" ON tasks;
CREATE POLICY "Users can manage tasks of their goals" ON tasks FOR ALL USING (EXISTS (SELECT 1 FROM goals WHERE goals.id = tasks.goal_id AND goals.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users can manage their checkins" ON checkins;
CREATE POLICY "Users can manage their checkins" ON checkins FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their ai insights" ON ai_insights;
CREATE POLICY "Users can manage their ai insights" ON ai_insights FOR ALL USING (auth.uid() = user_id);
