
-- Add columns to tasks table
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS essential boolean NOT NULL DEFAULT false;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'geral';

-- Rewards table
CREATE TABLE public.rewards (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  points_required integer NOT NULL,
  type text NOT NULL DEFAULT 'individual',
  active boolean NOT NULL DEFAULT true
);
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Rewards are publicly readable" ON public.rewards FOR SELECT USING (true);
CREATE POLICY "Rewards are publicly insertable" ON public.rewards FOR INSERT WITH CHECK (true);
CREATE POLICY "Rewards are publicly updatable" ON public.rewards FOR UPDATE USING (true);

-- Redemptions table
CREATE TABLE public.redemptions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reward_id uuid NOT NULL REFERENCES public.rewards(id),
  date timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'pendente',
  points_spent integer NOT NULL
);
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Redemptions are publicly readable" ON public.redemptions FOR SELECT USING (true);
CREATE POLICY "Redemptions are publicly insertable" ON public.redemptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Redemptions are publicly updatable" ON public.redemptions FOR UPDATE USING (true);
CREATE POLICY "Redemptions are publicly deletable" ON public.redemptions FOR DELETE USING (true);

-- Weekly missions table
CREATE TABLE public.weekly_missions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  description text NOT NULL,
  goal integer NOT NULL,
  current_progress integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  completed boolean NOT NULL DEFAULT false,
  week_start date NOT NULL DEFAULT CURRENT_DATE
);
ALTER TABLE public.weekly_missions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Weekly missions are publicly readable" ON public.weekly_missions FOR SELECT USING (true);
CREATE POLICY "Weekly missions are publicly insertable" ON public.weekly_missions FOR INSERT WITH CHECK (true);
CREATE POLICY "Weekly missions are publicly updatable" ON public.weekly_missions FOR UPDATE USING (true);

-- Achievements table
CREATE TABLE public.achievements (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  criteria text NOT NULL,
  unlocked boolean NOT NULL DEFAULT false,
  unlocked_at timestamptz
);
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Achievements are publicly readable" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Achievements are publicly insertable" ON public.achievements FOR INSERT WITH CHECK (true);
CREATE POLICY "Achievements are publicly updatable" ON public.achievements FOR UPDATE USING (true);

-- Insert default achievements
INSERT INTO public.achievements (name, description, criteria) VALUES
  ('3 Dias Seguidos', 'Complete 3 dias consecutivos', 'streak_3'),
  ('7 Dias Seguidos', 'Complete 7 dias consecutivos', 'streak_7'),
  ('100% Escola', 'Todas tarefas de escola aprovadas na semana', 'school_week'),
  ('10 Dias no Mês', '10 dias completos no mês', 'monthly_10');

-- Insert sample rewards
INSERT INTO public.rewards (name, points_required, type) VALUES
  ('🎮 1h extra de videogame', 100, 'individual'),
  ('🍕 Pizza no jantar', 200, 'coletiva'),
  ('🎬 Filme à escolha', 150, 'individual'),
  ('🛍️ Passeio no shopping', 300, 'coletiva'),
  ('📱 30min extra de celular', 80, 'individual');

-- Insert default weekly mission
INSERT INTO public.weekly_missions (description, goal, week_start) VALUES
  ('Complete 5 dias esta semana', 5, date_trunc('week', CURRENT_DATE)::date);
