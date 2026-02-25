
-- Tabela de tarefas-modelo
CREATE TABLE public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  points INTEGER NOT NULL,
  weekdays TEXT NOT NULL DEFAULT 'all', -- 'weekdays' ou 'all'
  emoji TEXT NOT NULL DEFAULT '📋',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tasks are publicly readable" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Tasks are publicly insertable" ON public.tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Tasks are publicly updatable" ON public.tasks FOR UPDATE USING (true);
CREATE POLICY "Tasks are publicly deletable" ON public.tasks FOR DELETE USING (true);

-- Tabela de tarefas diárias (instâncias)
CREATE TABLE public.daily_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'waiting', 'approved')),
  completed_at TIMESTAMP WITH TIME ZONE,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Daily tasks are publicly readable" ON public.daily_tasks FOR SELECT USING (true);
CREATE POLICY "Daily tasks are publicly insertable" ON public.daily_tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Daily tasks are publicly updatable" ON public.daily_tasks FOR UPDATE USING (true);
CREATE POLICY "Daily tasks are publicly deletable" ON public.daily_tasks FOR DELETE USING (true);

CREATE UNIQUE INDEX idx_daily_tasks_task_date ON public.daily_tasks(task_id, date);

-- Tabela de dados do jogador
CREATE TABLE public.player_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  avatar TEXT NOT NULL DEFAULT '🦸',
  current_streak INTEGER NOT NULL DEFAULT 0,
  best_streak INTEGER NOT NULL DEFAULT 0,
  total_points INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.player_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Player data is publicly readable" ON public.player_data FOR SELECT USING (true);
CREATE POLICY "Player data is publicly insertable" ON public.player_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Player data is publicly updatable" ON public.player_data FOR UPDATE USING (true);

-- Tabela de configurações (PIN da mãe)
CREATE TABLE public.app_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings are publicly readable" ON public.app_settings FOR SELECT USING (true);
CREATE POLICY "Settings are publicly updatable" ON public.app_settings FOR UPDATE USING (true);
CREATE POLICY "Settings are publicly insertable" ON public.app_settings FOR INSERT WITH CHECK (true);

-- Inserir tarefas padrão
INSERT INTO public.tasks (name, points, weekdays, emoji, sort_order) VALUES
  ('Tarefa da escola', 20, 'weekdays', '📚', 1),
  ('Banho manhã', 10, 'all', '🚿', 2),
  ('Banho noite', 10, 'all', '🛁', 3),
  ('Escovar dentes manhã', 5, 'all', '🪥', 4),
  ('Escovar dentes noite', 5, 'all', '🪥', 5),
  ('Arrumar quarto', 15, 'all', '🛏️', 6),
  ('Lavar louça', 15, 'all', '🍽️', 7),
  ('Guardar louça', 10, 'all', '🗄️', 8),
  ('Encher garrafas', 10, 'all', '🧴', 9);

-- Inserir dados iniciais do jogador
INSERT INTO public.player_data (avatar) VALUES ('🦸');

-- Inserir PIN padrão (1234)
INSERT INTO public.app_settings (key, value) VALUES ('mom_pin', '1234');
