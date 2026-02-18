-- Profiles table
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text,
  full_name text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Ideas table
CREATE TABLE public.ideas (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  raw_input text NOT NULL,
  industry text,
  target_market text,
  status text DEFAULT 'draft',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Analyses table
CREATE TABLE public.analyses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id uuid REFERENCES public.ideas(id) ON DELETE CASCADE NOT NULL,
  current_phase text,
  viability_score integer CHECK (viability_score >= 0 AND viability_score <= 100),
  market_analysis jsonb,
  strengths text[],
  weaknesses text[],
  opportunities text[],
  threats text[],
  key_metrics jsonb,
  ai_model_used text,
  created_at timestamp with time zone DEFAULT now()
);

-- Action plans table
CREATE TABLE public.action_plans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id uuid REFERENCES public.ideas(id) ON DELETE CASCADE NOT NULL,
  analysis_id uuid REFERENCES public.analyses(id) ON DELETE CASCADE,
  timeline_months integer,
  total_steps integer,
  created_at timestamp with time zone DEFAULT now()
);

-- Action steps table
CREATE TABLE public.action_steps (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  action_plan_id uuid REFERENCES public.action_plans(id) ON DELETE CASCADE NOT NULL,
  step_number integer NOT NULL,
  phase text,
  title text NOT NULL,
  description text,
  estimated_duration text,
  priority text DEFAULT 'medium',
  completed boolean DEFAULT false,
  completed_at timestamp with time zone,
  dependencies uuid[],
  resources_needed jsonb
);

-- Competitors table
CREATE TABLE public.competitors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id uuid REFERENCES public.ideas(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  strength_level text,
  market_share text,
  differentiation_notes text,
  url text
);

-- Resources table
CREATE TABLE public.resources (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id uuid REFERENCES public.ideas(id) ON DELETE CASCADE NOT NULL,
  category text NOT NULL,
  name text NOT NULL,
  description text,
  url text,
  estimated_cost decimal
);

-- Feedback sessions table
CREATE TABLE public.feedback_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id uuid REFERENCES public.ideas(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question text NOT NULL,
  ai_response text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Indexes
CREATE INDEX idx_ideas_user_id ON public.ideas(user_id);
CREATE INDEX idx_analyses_idea_id ON public.analyses(idea_id);
CREATE INDEX idx_action_plans_idea_id ON public.action_plans(idea_id);
CREATE INDEX idx_action_steps_plan_id ON public.action_steps(action_plan_id);
CREATE INDEX idx_competitors_idea_id ON public.competitors(idea_id);
CREATE INDEX idx_resources_idea_id ON public.resources(idea_id);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own ideas" ON public.ideas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own ideas" ON public.ideas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ideas" ON public.ideas
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ideas" ON public.ideas
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view analyses for own ideas" ON public.analyses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ideas 
      WHERE ideas.id = analyses.idea_id 
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view action plans for own ideas" ON public.action_plans
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.ideas 
      WHERE ideas.id = action_plans.idea_id 
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view action steps for own plans" ON public.action_steps
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.action_plans
      JOIN public.ideas ON ideas.id = action_plans.idea_id
      WHERE action_plans.id = action_steps.action_plan_id 
      AND ideas.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update action steps for own plans" ON public.action_steps
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.action_plans
      JOIN public.ideas ON ideas.id = action_plans.idea_id
      WHERE action_plans.id = action_steps.action_plan_id 
      AND ideas.user_id = auth.uid()
    )
  );

-- Similar policies for competitors, resources, feedback_sessions...

-- Trigger for auto-creating profile
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();