-- Enable UUID generation and Vector extension for AI semantic memory
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. PROFILES (Extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT 'Learner',
    email TEXT,
    avatar_url TEXT,
    streak_days INT NOT NULL DEFAULT 1,
    total_xp INT NOT NULL DEFAULT 0,
    level INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger to automatically create a profile record when a user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', 'Learner'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

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

-- 6. AI INSIGHTS & ADAPTATION LOGS
CREATE TABLE IF NOT EXISTS ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    insight_type TEXT NOT NULL, -- 'adaptation_proposal', 'weekly_review', 'concept_reinforcement'
    trigger_reason TEXT,
    previous_daily_target_minutes INT,
    proposed_daily_target_minutes INT,
    rescheduled_tasks_count INT DEFAULT 0,
    key_changes_summary TEXT[] DEFAULT '{}',
    coach_encouragement TEXT,
    is_applied BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. AI SEMANTIC MEMORY (pgvector for contextual recall)
CREATE TABLE IF NOT EXISTS ai_memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding VECTOR(1536), -- Standard embedding dimension (OpenAI / Gemini)
    memory_type TEXT NOT NULL CHECK (memory_type IN ('weak_area', 'blocker', 'achievement', 'study_preference', 'reflection')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Vector Similarity Search RPC Function for AI Context Retrieval
CREATE OR REPLACE FUNCTION match_ai_memories (
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT,
  p_user_id UUID,
  p_goal_id UUID DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  memory_type TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ai_memories.id,
    ai_memories.content,
    ai_memories.memory_type,
    ai_memories.metadata,
    1 - (ai_memories.embedding <=> query_embedding) AS similarity
  FROM ai_memories
  WHERE ai_memories.user_id = p_user_id
    AND (p_goal_id IS NULL OR ai_memories.goal_id = p_goal_id)
    AND 1 - (ai_memories.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

-- INDEXES for Fast Queries
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_milestones_goal_id ON milestones(goal_id);
CREATE INDEX IF NOT EXISTS idx_tasks_goal_id ON tasks(goal_id);
CREATE INDEX IF NOT EXISTS idx_tasks_milestone_id ON tasks(milestone_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_checkins_goal_date ON checkins(goal_id, checkin_date);
CREATE INDEX IF NOT EXISTS idx_ai_memories_user_id ON ai_memories(user_id);

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_memories ENABLE ROW LEVEL SECURITY;

-- Profiles Policy
DROP POLICY IF EXISTS "Users can view and update their own profile" ON profiles;
CREATE POLICY "Users can view and update their own profile" ON profiles
    FOR ALL USING (auth.uid() = id);

-- Goals Policy
DROP POLICY IF EXISTS "Users can manage their own goals" ON goals;
CREATE POLICY "Users can manage their own goals" ON goals
    FOR ALL USING (auth.uid() = user_id);

-- Milestones Policy
DROP POLICY IF EXISTS "Users can manage milestones of their goals" ON milestones;
CREATE POLICY "Users can manage milestones of their goals" ON milestones
    FOR ALL USING (EXISTS (SELECT 1 FROM goals WHERE goals.id = milestones.goal_id AND goals.user_id = auth.uid()));

-- Tasks Policy
DROP POLICY IF EXISTS "Users can manage tasks of their goals" ON tasks;
CREATE POLICY "Users can manage tasks of their goals" ON tasks
    FOR ALL USING (EXISTS (SELECT 1 FROM goals WHERE goals.id = tasks.goal_id AND goals.user_id = auth.uid()));

-- Checkins Policy
DROP POLICY IF EXISTS "Users can manage their checkins" ON checkins;
CREATE POLICY "Users can manage their checkins" ON checkins
    FOR ALL USING (auth.uid() = user_id);

-- AI Insights Policy
DROP POLICY IF EXISTS "Users can manage their ai insights" ON ai_insights;
CREATE POLICY "Users can manage their ai insights" ON ai_insights
    FOR ALL USING (auth.uid() = user_id);

-- AI Memories Policy
DROP POLICY IF EXISTS "Users can manage their ai memories" ON ai_memories;
CREATE POLICY "Users can manage their ai memories" ON ai_memories
    FOR ALL USING (auth.uid() = user_id);
