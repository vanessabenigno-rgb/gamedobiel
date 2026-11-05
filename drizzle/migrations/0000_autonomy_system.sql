CREATE TYPE public.app_role AS ENUM ('responsavel','filho');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read profiles" ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
CREATE OR REPLACE FUNCTION public.is_member() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid())
$$;
CREATE OR REPLACE FUNCTION public.is_mom() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'responsavel')
$$;
CREATE OR REPLACE FUNCTION public.fortaleza_today() RETURNS date LANGUAGE sql STABLE AS $$
  SELECT (now() AT TIME ZONE 'America/Fortaleza')::date
$$;

-- First account = responsavel, second = filho, later = no access
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, username) VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email,'@',1)));
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role='responsavel') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'responsavel');
  ELSIF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role='filho') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'filho');
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.screen_time_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  base_minutes integer NOT NULL DEFAULT 60,
  max_extra_minutes integer NOT NULL DEFAULT 120,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.screen_time_settings TO authenticated;
GRANT ALL ON public.screen_time_settings TO service_role;
ALTER TABLE public.screen_time_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read settings" ON public.screen_time_settings FOR SELECT TO authenticated USING (public.is_member());
CREATE POLICY "mom write settings" ON public.screen_time_settings FOR ALL TO authenticated USING (public.is_mom()) WITH CHECK (public.is_mom());
INSERT INTO public.screen_time_settings DEFAULT VALUES;

CREATE TABLE public.initiative_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  emoji text NOT NULL DEFAULT '✨',
  minutes integer NOT NULL DEFAULT 10,
  max_per_day integer NOT NULL DEFAULT 1,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.initiative_activities TO authenticated;
GRANT ALL ON public.initiative_activities TO service_role;
ALTER TABLE public.initiative_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read activities" ON public.initiative_activities FOR SELECT TO authenticated USING (public.is_member());
CREATE POLICY "mom write activities" ON public.initiative_activities FOR ALL TO authenticated USING (public.is_mom()) WITH CHECK (public.is_mom());
INSERT INTO public.initiative_activities (name, emoji, minutes, sort_order) VALUES
 ('Encher garrafas de água','💧',10,1),('Retirar o lixo','🗑️',15,2),('Lavar a louça sem cobrança','🍽️',20,3),
 ('Guardar a louça espontaneamente','🗄️',10,4),('Organizar o quarto espontaneamente','🛏️',15,5),('Identificar e resolver outra necessidade','💡',15,6);

CREATE TABLE public.initiative_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  activity_id uuid NOT NULL REFERENCES public.initiative_activities(id) ON DELETE RESTRICT,
  log_date date NOT NULL DEFAULT public.fortaleza_today(),
  description text,
  minutes integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pendente',
  mom_note text,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.initiative_logs TO authenticated;
GRANT ALL ON public.initiative_logs TO service_role;
ALTER TABLE public.initiative_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read logs" ON public.initiative_logs FOR SELECT TO authenticated USING (public.is_mom() OR user_id = auth.uid());
CREATE POLICY "kid inserts own logs" ON public.initiative_logs FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND public.has_role(auth.uid(),'filho'));
CREATE POLICY "update logs" ON public.initiative_logs FOR UPDATE TO authenticated USING (public.is_mom() OR (user_id = auth.uid() AND status = 'correcao'));
CREATE POLICY "mom delete logs" ON public.initiative_logs FOR DELETE TO authenticated USING (public.is_mom());

CREATE OR REPLACE FUNCTION public.initiative_log_guard() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE act record; cnt int;
BEGIN
  IF TG_OP = 'INSERT' THEN
    SELECT * INTO act FROM public.initiative_activities WHERE id = NEW.activity_id AND active;
    IF act IS NULL THEN RAISE EXCEPTION 'Atividade indisponível'; END IF;
    NEW.log_date := public.fortaleza_today();
    NEW.minutes := act.minutes;
    NEW.status := 'pendente';
    NEW.mom_note := NULL; NEW.reviewed_at := NULL;
    SELECT count(*) INTO cnt FROM public.initiative_logs WHERE user_id = NEW.user_id AND activity_id = NEW.activity_id AND log_date = NEW.log_date AND status <> 'recusado';
    IF cnt >= act.max_per_day THEN RAISE EXCEPTION 'Limite diário desta atividade já atingido'; END IF;
    IF EXISTS (SELECT 1 FROM public.initiative_logs WHERE user_id = NEW.user_id AND activity_id = NEW.activity_id AND created_at > now() - interval '30 minutes') THEN
      RAISE EXCEPTION 'Aguarde um pouco antes de registrar esta atividade de novo';
    END IF;
  ELSIF NOT public.is_mom() THEN
    -- kid can only edit description/activity of a log returned for correction
    NEW.status := 'pendente'; NEW.minutes := OLD.minutes; NEW.log_date := OLD.log_date; NEW.user_id := OLD.user_id;
    NEW.reviewed_at := OLD.reviewed_at; NEW.mom_note := OLD.mom_note; NEW.activity_id := OLD.activity_id;
  ELSE
    IF NEW.status IS DISTINCT FROM OLD.status THEN NEW.reviewed_at := now(); END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER initiative_log_guard BEFORE INSERT OR UPDATE ON public.initiative_logs FOR EACH ROW EXECUTE FUNCTION public.initiative_log_guard();

CREATE TABLE public.school_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  log_date date NOT NULL DEFAULT public.fortaleza_today(),
  done_activities text,
  pending_tasks text,
  subjects text,
  difficulties text,
  needs_help boolean NOT NULL DEFAULT false,
  has_pending boolean NOT NULL DEFAULT false,
  validation text NOT NULL DEFAULT 'aguardando',
  mom_note text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, log_date)
);
GRANT SELECT, INSERT, UPDATE ON public.school_logs TO authenticated;
GRANT ALL ON public.school_logs TO service_role;
ALTER TABLE public.school_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read school" ON public.school_logs FOR SELECT TO authenticated USING (public.is_mom() OR user_id = auth.uid());
CREATE POLICY "kid insert school" ON public.school_logs FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND public.has_role(auth.uid(),'filho'));
CREATE POLICY "update school" ON public.school_logs FOR UPDATE TO authenticated USING (public.is_mom() OR user_id = auth.uid());

CREATE TABLE public.daily_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  log_date date NOT NULL DEFAULT public.fortaleza_today(),
  school_ok boolean NOT NULL DEFAULT false,
  initiatives text,
  pending text,
  improve text,
  validated boolean NOT NULL DEFAULT false,
  mom_note text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, log_date)
);
GRANT SELECT, INSERT, UPDATE ON public.daily_checkins TO authenticated;
GRANT ALL ON public.daily_checkins TO service_role;
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read checkin" ON public.daily_checkins FOR SELECT TO authenticated USING (public.is_mom() OR user_id = auth.uid());
CREATE POLICY "kid insert checkin" ON public.daily_checkins FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND public.has_role(auth.uid(),'filho'));
CREATE POLICY "update checkin" ON public.daily_checkins FOR UPDATE TO authenticated USING (public.is_mom() OR user_id = auth.uid());

-- Kid edits of school/checkin: force date to today and keep mom's validation fields
CREATE OR REPLACE FUNCTION public.kid_record_guard() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  NEW.updated_at := now();
  IF NOT public.is_mom() THEN
    IF TG_OP = 'INSERT' THEN
      NEW.log_date := public.fortaleza_today();
      IF TG_TABLE_NAME = 'school_logs' THEN NEW.validation := 'aguardando'; ELSE NEW.validated := false; END IF;
      NEW.mom_note := NULL;
    ELSE
      IF OLD.log_date <> public.fortaleza_today() THEN RAISE EXCEPTION 'Só é possível editar o registro de hoje'; END IF;
      NEW.log_date := OLD.log_date; NEW.user_id := OLD.user_id; NEW.mom_note := OLD.mom_note;
      IF TG_TABLE_NAME = 'school_logs' THEN NEW.validation := 'aguardando'; ELSE NEW.validated := false; END IF;
    END IF;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER school_guard BEFORE INSERT OR UPDATE ON public.school_logs FOR EACH ROW EXECUTE FUNCTION public.kid_record_guard();
CREATE TRIGGER checkin_guard BEFORE INSERT OR UPDATE ON public.daily_checkins FOR EACH ROW EXECUTE FUNCTION public.kid_record_guard();

CREATE TABLE public.screen_time_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  log_date date NOT NULL DEFAULT public.fortaleza_today(),
  minutes integer NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.screen_time_usage TO authenticated;
GRANT ALL ON public.screen_time_usage TO service_role;
ALTER TABLE public.screen_time_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read usage" ON public.screen_time_usage FOR SELECT TO authenticated USING (public.is_member());
CREATE POLICY "mom write usage" ON public.screen_time_usage FOR ALL TO authenticated USING (public.is_mom()) WITH CHECK (public.is_mom());

CREATE TABLE public.reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  log_date date NOT NULL DEFAULT public.fortaleza_today(),
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reminders TO authenticated;
GRANT ALL ON public.reminders TO service_role;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read reminders" ON public.reminders FOR SELECT TO authenticated USING (public.is_member());
CREATE POLICY "mom write reminders" ON public.reminders FOR ALL TO authenticated USING (public.is_mom()) WITH CHECK (public.is_mom());

-- Lock down existing tables (data preserved)
DROP POLICY IF EXISTS "Tasks are publicly deletable" ON public.tasks;
DROP POLICY IF EXISTS "Tasks are publicly insertable" ON public.tasks;
DROP POLICY IF EXISTS "Tasks are publicly readable" ON public.tasks;
DROP POLICY IF EXISTS "Tasks are publicly updatable" ON public.tasks;
CREATE POLICY "members read tasks" ON public.tasks FOR SELECT TO authenticated USING (public.is_member());
CREATE POLICY "mom write tasks" ON public.tasks FOR ALL TO authenticated USING (public.is_mom()) WITH CHECK (public.is_mom());

DROP POLICY IF EXISTS "Daily tasks are publicly deletable" ON public.daily_tasks;
DROP POLICY IF EXISTS "Daily tasks are publicly insertable" ON public.daily_tasks;
DROP POLICY IF EXISTS "Daily tasks are publicly readable" ON public.daily_tasks;
DROP POLICY IF EXISTS "Daily tasks are publicly updatable" ON public.daily_tasks;
CREATE POLICY "members read daily" ON public.daily_tasks FOR SELECT TO authenticated USING (public.is_member());
CREATE POLICY "members insert daily" ON public.daily_tasks FOR INSERT TO authenticated WITH CHECK (public.is_member() AND status = 'pending');
CREATE POLICY "members update daily" ON public.daily_tasks FOR UPDATE TO authenticated USING (public.is_member());
CREATE POLICY "mom delete daily" ON public.daily_tasks FOR DELETE TO authenticated USING (public.is_mom());
CREATE OR REPLACE FUNCTION public.daily_task_guard() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_mom() THEN
    IF NOT (OLD.status = 'pending' AND NEW.status = 'waiting') THEN RAISE EXCEPTION 'Somente a responsável pode aprovar'; END IF;
    NEW.approved_at := OLD.approved_at; NEW.task_id := OLD.task_id; NEW.date := OLD.date;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER daily_task_guard BEFORE UPDATE ON public.daily_tasks FOR EACH ROW EXECUTE FUNCTION public.daily_task_guard();
ALTER TABLE public.daily_tasks ADD COLUMN IF NOT EXISTS spontaneous boolean NOT NULL DEFAULT false;

DROP POLICY IF EXISTS "Settings are publicly insertable" ON public.app_settings;
DROP POLICY IF EXISTS "Settings are publicly readable" ON public.app_settings;
DROP POLICY IF EXISTS "Settings are publicly updatable" ON public.app_settings;
CREATE POLICY "mom settings" ON public.app_settings FOR ALL TO authenticated USING (public.is_mom()) WITH CHECK (public.is_mom());

DROP POLICY IF EXISTS "Player data is publicly insertable" ON public.player_data;
DROP POLICY IF EXISTS "Player data is publicly readable" ON public.player_data;
DROP POLICY IF EXISTS "Player data is publicly updatable" ON public.player_data;
CREATE POLICY "members read player" ON public.player_data FOR SELECT TO authenticated USING (public.is_member());
CREATE POLICY "mom write player" ON public.player_data FOR ALL TO authenticated USING (public.is_mom()) WITH CHECK (public.is_mom());

DROP POLICY IF EXISTS "Rewards are publicly deletable" ON public.rewards;
DROP POLICY IF EXISTS "Rewards are publicly insertable" ON public.rewards;
DROP POLICY IF EXISTS "Rewards are publicly readable" ON public.rewards;
DROP POLICY IF EXISTS "Rewards are publicly updatable" ON public.rewards;
CREATE POLICY "mom rewards" ON public.rewards FOR ALL TO authenticated USING (public.is_mom()) WITH CHECK (public.is_mom());
DROP POLICY IF EXISTS "Redemptions are publicly deletable" ON public.redemptions;
DROP POLICY IF EXISTS "Redemptions are publicly insertable" ON public.redemptions;
DROP POLICY IF EXISTS "Redemptions are publicly readable" ON public.redemptions;
DROP POLICY IF EXISTS "Redemptions are publicly updatable" ON public.redemptions;
CREATE POLICY "mom redemptions" ON public.redemptions FOR ALL TO authenticated USING (public.is_mom()) WITH CHECK (public.is_mom());
DROP POLICY IF EXISTS "Achievements are publicly insertable" ON public.achievements;
DROP POLICY IF EXISTS "Achievements are publicly readable" ON public.achievements;
DROP POLICY IF EXISTS "Achievements are publicly updatable" ON public.achievements;
CREATE POLICY "mom achievements" ON public.achievements FOR ALL TO authenticated USING (public.is_mom()) WITH CHECK (public.is_mom());
DROP POLICY IF EXISTS "Weekly missions are publicly insertable" ON public.weekly_missions;
DROP POLICY IF EXISTS "Weekly missions are publicly readable" ON public.weekly_missions;
DROP POLICY IF EXISTS "Weekly missions are publicly updatable" ON public.weekly_missions;
CREATE POLICY "mom missions" ON public.weekly_missions FOR ALL TO authenticated USING (public.is_mom()) WITH CHECK (public.is_mom());

GRANT SELECT, INSERT, UPDATE, DELETE ON public.tasks, public.daily_tasks, public.app_settings, public.player_data, public.rewards, public.redemptions, public.achievements, public.weekly_missions TO authenticated;
GRANT ALL ON public.tasks, public.daily_tasks, public.app_settings, public.player_data, public.rewards, public.redemptions, public.achievements, public.weekly_missions TO service_role;