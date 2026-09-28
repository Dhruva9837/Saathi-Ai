-- ==========================================
-- STEP 2: AUTH TRIGGER & AI SEMANTIC MEMORY
-- Run in Supabase SQL Editor
-- ==========================================

-- 1. Automatic User Profile Creation Trigger on Supabase Auth Signup
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

-- 2. Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS "vector";

-- 3. AI Semantic Memory Table
CREATE TABLE IF NOT EXISTS public.ai_memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding VECTOR(1536),
    memory_type TEXT NOT NULL CHECK (memory_type IN ('weak_area', 'blocker', 'achievement', 'study_preference', 'reflection')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_memories_user_id ON public.ai_memories(user_id);

ALTER TABLE public.ai_memories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their ai memories" ON public.ai_memories;
CREATE POLICY "Users can manage their ai memories" ON public.ai_memories FOR ALL USING (auth.uid() = user_id);

-- 4. Vector Match RPC Function
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
  FROM public.ai_memories
  WHERE ai_memories.user_id = p_user_id
    AND (p_goal_id IS NULL OR ai_memories.goal_id = p_goal_id)
    AND 1 - (ai_memories.embedding <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

