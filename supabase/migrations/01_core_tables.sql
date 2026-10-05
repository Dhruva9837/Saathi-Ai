-- ==========================================
-- STEP 1: CORE TABLES & ROW LEVEL SECURITY (RLS)
-- ==========================================

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
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
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
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
CREATE TABLE IF NOT EXISTS public.milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    order_index INT NOT NULL,
    status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'in_progress', 'completed')),
    estimated_days INT NOT NULL DEFAULT 14,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TASKS
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
    milestone_id UUID NOT NULL REFERENCES public.milestones(id) ON DELETE CASCADE,
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

-- 5. CHECKINS
CREATE TABLE IF NOT EXISTS public.checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
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
CREATE TABLE IF NOT EXISTS public.ai_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
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

-- 7. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow individual read" ON public.profiles;
CREATE POLICY "Allow individual read" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow individual update" ON public.profiles;
CREATE POLICY "Allow individual update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Allow individual insert" ON public.profiles;
CREATE POLICY "Allow individual insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Allow goal access" ON public.goals;
CREATE POLICY "Allow goal access" ON public.goals FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow milestone access" ON public.milestones;
CREATE POLICY "Allow milestone access" ON public.milestones FOR ALL USING (EXISTS (SELECT 1 FROM public.goals WHERE public.goals.id = milestones.goal_id AND public.goals.user_id = auth.uid()));

DROP POLICY IF EXISTS "Allow task access" ON public.tasks;
CREATE POLICY "Allow task access" ON public.tasks FOR ALL USING (EXISTS (SELECT 1 FROM public.goals WHERE public.goals.id = tasks.goal_id AND public.goals.user_id = auth.uid()));

DROP POLICY IF EXISTS "Allow checkin access" ON public.checkins;
CREATE POLICY "Allow checkin access" ON public.checkins FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Allow ai insight access" ON public.ai_insights;
CREATE POLICY "Allow ai insight access" ON public.ai_insights FOR ALL USING (auth.uid() = user_id);
