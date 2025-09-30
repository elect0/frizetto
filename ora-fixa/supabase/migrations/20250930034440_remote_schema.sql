
\restrict EhrPIBggWJV0hrlvj4R3jkVcdDQHq6WRoEyIcfCNx1Jro7F3pq25MS7NCzgjqBl


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."get_available_slots"("p_date" "date", "p_duration_minutes" integer) RETURNS TABLE("available_slot" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$-- Începutul blocului de cod al funcției
DECLARE
    v_start_time TIME;
    v_end_time TIME;
    v_is_active BOOLEAN;

BEGIN
   SELECT
        so.start_time,
        so.end_time,
        so.is_active
    INTO 
        v_start_time,
        v_end_time,
        v_is_active
    FROM
        public.schedule_overrides so
    WHERE
        so.date = p_date;

    IF NOT FOUND THEN
        SELECT
            ws.start_time,
            ws.end_time,
            ws.is_active
        INTO 
            v_start_time,
            v_end_time,
            v_is_active
        FROM
            public.work_schedules ws
        WHERE
            ws.day_of_week = EXTRACT(ISODOW FROM p_date);
    END IF;

    IF v_is_active = false OR v_is_active IS NULL THEN
        RETURN; 
    END IF;

    RETURN QUERY
        SELECT 
            TO_CHAR(potential_slot.slot, 'HH24:MI')
        FROM 
            generate_series(
                p_date + v_start_time,
                p_date + v_end_time - make_interval(mins => p_duration_minutes),
                '30 minutes'::interval
            ) AS potential_slot(slot)
        
        LEFT JOIN public.appointments a ON
            tsrange(
                potential_slot.slot::timestamp, 
                (potential_slot.slot + make_interval(mins => p_duration_minutes))::timestamp
            )
            && 
            tsrange(
                a.start_time::timestamp, 
                a.end_time::timestamp
            )
            AND a.status <> 'anulata'
            AND CAST(a.start_time AS DATE) = p_date

    WHERE a.id IS NULL
    ORDER BY 1;

END;


ALTER FUNCTION "public"."get_available_slots"("p_date" "date", "p_duration_minutes" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_client_stats"("p_user_id" "uuid") RETURNS TABLE("total_visits" bigint, "total_spent" numeric, "noshow_count" bigint)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_total_visits bigint;
    v_total_spent numeric;
    v_noshow_count bigint;
BEGIN
    SELECT
        COUNT(*),
        COALESCE(SUM(s.price), 0)
    INTO
        v_total_visits,
        v_total_spent
    FROM 
        public.appointments a
    JOIN 
        public.services s ON a.service_id = s.id
    WHERE
        a.user_id = p_user_id AND
        a.status = 'finalizata';

    SELECT
        COUNT(*)
    INTO
        v_noshow_count
    FROM
        public.appointments a
    WHERE
        a.user_id = p_user_id AND
        a.status = 'neprezentat';

    -- Pasul 3: Returnăm toate cele trei valori calculate
    RETURN QUERY SELECT v_total_visits, v_total_spent, v_noshow_count;
END;
$$;


ALTER FUNCTION "public"."get_client_stats"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_clients_count"("p_search_term" "text") RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
    RETURN (
        SELECT CAST(COUNT(*) as integer) 
        FROM profiles
        WHERE full_name ILIKE '%' || p_search_term || '%'
    );
END;
$$;


ALTER FUNCTION "public"."get_clients_count"("p_search_term" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_clients_with_stats"("p_search_term" "text", "p_sort_column" "text", "p_sort_order" "text", "p_page_size" integer, "p_page_number" integer) RETURNS TABLE("id" "uuid", "full_name" "text", "email" "text", "phone" "text", "last_visit" timestamp with time zone, "total_visits" bigint, "total_spent" numeric, "noshow_count" bigint, "status" "text", "created_at" timestamp with time zone, "client_notes" "text", "is_banned" boolean)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
    RETURN QUERY
        WITH client_stats AS (
            SELECT
                a.user_id,
                MAX(a.start_time) FILTER (WHERE a.status = 'finalizata') AS last_visit,
                COUNT(*) FILTER (WHERE a.status = 'finalizata') AS total_visits,
                COALESCE(SUM(s.price) FILTER (WHERE a.status = 'finalizata'), 0) AS total_spent,
                COUNT(*) FILTER (WHERE a.status = 'neprezentat') AS noshow_count
            FROM
                appointments a
            JOIN
                services s ON a.service_id = s.id
            GROUP BY
                a.user_id
        )
        SELECT
            p.id,
            p.full_name,
            p.email,
            p.phone,
            cs.last_visit,
            COALESCE(cs.total_visits, 0) as total_visits,
            COALESCE(cs.total_spent, 0) as total_spent,
            COALESCE(cs.noshow_count, 0) as noshow_count,
            CASE
                WHEN COALESCE(cs.noshow_count, 0) >= 2 and COALESCE(cs.total_visits, 0) < 10 THEN 'Riscant'
                WHEN COALESCE(cs.total_visits, 0) > 10 THEN 'Diamant'
                WHEN COALESCE(cs.total_visits, 0) > 7 THEN 'Aur'
                WHEN COALESCE(cs.total_visits, 0) > 5 THEN 'Argint'
                ELSE 'Client Nou'
            END AS status,
            p.created_at,
            p.notes,
            p.is_banned
        FROM
            profiles p
        LEFT JOIN
            client_stats cs ON p.id = cs.user_id
        WHERE
            p.full_name ILIKE '%' || p_search_term || '%'
        ORDER BY
            CASE WHEN p_sort_column = 'last_visit' AND p_sort_order = 'asc' THEN cs.last_visit END ASC,
            CASE WHEN p_sort_column = 'last_visit' AND p_sort_order = 'desc' THEN cs.last_visit END DESC,
            CASE WHEN p_sort_column = 'total_visits' AND p_sort_order = 'asc' THEN COALESCE(cs.total_visits, 0) END ASC,
            CASE WHEN p_sort_column = 'total_visits' AND p_sort_order = 'desc' THEN COALESCE(cs.total_visits, 0) END DESC,
            CASE WHEN p_sort_column = 'total_spent' AND p_sort_order = 'asc' THEN COALESCE(cs.total_spent, 0) END ASC,
            CASE WHEN p_sort_column = 'total_spent' AND p_sort_order = 'desc' THEN COALESCE(cs.total_spent, 0) END DESC,
            p.created_at DESC
        -- Aplicăm paginarea la final
        LIMIT p_page_size
        OFFSET (p_page_number - 1) * p_page_size;
END;
$$;


ALTER FUNCTION "public"."get_clients_with_stats"("p_search_term" "text", "p_sort_column" "text", "p_sort_order" "text", "p_page_size" integer, "p_page_number" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_dashboard_stats"("p_date" "date") RETURNS TABLE("total_revenue" numeric, "revenue_change_pct" "text", "new_clients_count" integer, "new_clients_change_pct" "text", "noshow_count" integer, "noshow_change_pct" "text")
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_current_month_start timestamptz := date_trunc('month', p_date);
    v_current_month_end timestamptz := v_current_month_start + interval '1 month';
    v_current_revenue numeric;
    v_current_new_clients int;
    v_current_no_shows int;
    
    v_previous_month_start timestamptz := v_current_month_start - interval '1 month';
    v_previous_month_end timestamptz := v_current_month_start;
    v_previous_revenue numeric;
    v_previous_new_clients int;
    v_previous_no_shows int;

BEGIN
    SELECT COALESCE(SUM(s.price), 0) INTO v_current_revenue FROM public.appointments a JOIN public.services s ON a.service_id = s.id WHERE a.status = 'finalizata' AND a.start_time >= v_current_month_start AND a.start_time < v_current_month_end;
    SELECT count(*) INTO v_current_new_clients FROM public.profiles WHERE created_at >= v_current_month_start AND created_at < v_current_month_end;
    SELECT count(*) INTO v_current_no_shows FROM public.appointments WHERE status = 'neprezentat' AND start_time >= v_current_month_start AND start_time < v_current_month_end;

    SELECT COALESCE(SUM(s.price), 0) INTO v_previous_revenue FROM public.appointments a JOIN public.services s ON a.service_id = s.id WHERE a.status = 'finalizata' AND a.start_time >= v_previous_month_start AND a.start_time < v_previous_month_end;
    SELECT count(*) INTO v_previous_new_clients FROM public.profiles WHERE created_at >= v_previous_month_start AND created_at < v_previous_month_end;
    SELECT count(*) INTO v_previous_no_shows FROM public.appointments WHERE status = 'neprezentat' AND start_time >= v_previous_month_start AND start_time < v_previous_month_end;

    RETURN QUERY 
        SELECT
            v_current_revenue AS total_revenue,
            CASE 
                WHEN v_previous_revenue = 0 AND v_current_revenue > 0 THEN '+100.00'
                WHEN v_previous_revenue = 0 THEN '0.00' -- Am scos '+' pentru zero, e mai curat
                ELSE to_char(((v_current_revenue - v_previous_revenue) / v_previous_revenue) * 100, 'FMS999.00')
            END AS revenue_change_pct,
            
            v_current_new_clients AS new_clients_count,
            CASE 
                WHEN v_previous_new_clients = 0 AND v_current_new_clients > 0 THEN '+100.00'
                WHEN v_previous_new_clients = 0 THEN '0.00'
                ELSE to_char(((v_current_new_clients::numeric - v_previous_new_clients::numeric) / v_previous_new_clients::numeric) * 100, 'FMS999.00')
            END AS new_clients_change_pct,

            v_current_no_shows AS noshow_count,
            CASE 
                WHEN v_previous_no_shows = 0 AND v_current_no_shows > 0 THEN '+100.00'
                WHEN v_previous_no_shows = 0 THEN '0.00'
                ELSE to_char(((v_current_no_shows::numeric - v_previous_no_shows::numeric) / v_previous_no_shows::numeric) * 100, 'FMS999.00')
            END AS noshow_change_pct;
END;
$$;


ALTER FUNCTION "public"."get_dashboard_stats"("p_date" "date") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_service_popularity"() RETURNS TABLE("service_id" bigint, "service_name" "text", "service_description" "text", "service_price" numeric, "service_duration_minutes" smallint, "bookings_this_month" bigint)
    LANGUAGE "sql"
    AS $$


SELECT
    s.id AS service_id,
    s.name AS service_name,    
    s.description AS service_description,
    s.price AS service_price,
    s.duration_minutes AS service_duration_minutes,
    
    COUNT(a.id) AS bookings_this_month
FROM
    public.services s

LEFT JOIN public.appointments a ON s.id = a.service_id
    AND a.created_at >= date_trunc('month', now())
    AND a.created_at < date_trunc('month', now()) + interval '1 month'

GROUP BY s.id, s.name

ORDER BY bookings_this_month DESC;

$$;


ALTER FUNCTION "public"."get_service_popularity"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_stats"("p_user_id" "uuid") RETURNS TABLE("total_visits" bigint, "total_spent" numeric)
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
    RETURN QUERY
        SELECT
            COUNT(*) AS total_visits,
            
            COALESCE(SUM(s.price), 0) AS total_spent
        FROM 
            public.appointments a
        JOIN 
            public.services s ON a.service_id = s.id
        WHERE
            a.user_id = p_user_id AND
            a.status = 'finalizata';

END;
$$;


ALTER FUNCTION "public"."get_user_stats"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_weekly_revenue"() RETURNS TABLE("date" "date", "lei" numeric)
    LANGUAGE "sql"
    AS $$
    SELECT
        calendar.day::date AS date,
        
        COALESCE(SUM(s.price), 0) AS lei
    FROM
        generate_series(
            CURRENT_DATE - INTERVAL '6 days',
            CURRENT_DATE,
            '1 day'::interval
        ) AS calendar(day)

    LEFT JOIN public.appointments a ON CAST(a.start_time AS DATE) = calendar.day 
                                    AND a.status = 'finalizata'
    
    LEFT JOIN public.services s ON a.service_id = s.id

    GROUP BY calendar.day
    ORDER BY calendar.day;
$$;


ALTER FUNCTION "public"."get_weekly_revenue"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."sync_full_name_to_auth"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  UPDATE auth.users
  SET raw_user_meta_data = raw_user_meta_data || jsonb_build_object('full_name', NEW.full_name)
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."sync_full_name_to_auth"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."appointments" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "service_id" bigint NOT NULL,
    "start_time" timestamp with time zone,
    "end_time" timestamp with time zone,
    "status" "text" DEFAULT 'confirmata'::"text",
    "client_notes" "text",
    "reminder_set_at" timestamp with time zone
);


ALTER TABLE "public"."appointments" OWNER TO "postgres";


ALTER TABLE "public"."appointments" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."appointments_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone,
    "full_name" "text",
    "phone" "text",
    "is_admin" boolean DEFAULT false,
    "email" "text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "favorite_service_id" bigint,
    "notify_email_confirmation" boolean DEFAULT true NOT NULL,
    "notify_sms_reminder" boolean DEFAULT true NOT NULL,
    "marketing_opt_in" boolean DEFAULT false NOT NULL,
    "is_banned" boolean DEFAULT false
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."schedule_overrides" (
    "id" bigint NOT NULL,
    "date" "date" NOT NULL,
    "start_time" time without time zone NOT NULL,
    "end_time" time without time zone NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL
);


ALTER TABLE "public"."schedule_overrides" OWNER TO "postgres";


ALTER TABLE "public"."schedule_overrides" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."schedule_overrides_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."services" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "price" numeric NOT NULL,
    "duration_minutes" smallint NOT NULL
);


ALTER TABLE "public"."services" OWNER TO "postgres";


ALTER TABLE "public"."services" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."services_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."work_schedules" (
    "id" bigint NOT NULL,
    "day_of_week" smallint,
    "start_time" time without time zone,
    "end_time" time without time zone,
    "is_active" boolean DEFAULT true
);


ALTER TABLE "public"."work_schedules" OWNER TO "postgres";


ALTER TABLE "public"."work_schedules" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."work_schedules_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "public"."appointments"
    ADD CONSTRAINT "appointments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schedule_overrides"
    ADD CONSTRAINT "schedule_overrides_date_key" UNIQUE ("date");



ALTER TABLE ONLY "public"."schedule_overrides"
    ADD CONSTRAINT "schedule_overrides_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."services"
    ADD CONSTRAINT "services_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."work_schedules"
    ADD CONSTRAINT "work_schedules_day_of_week_key" UNIQUE ("day_of_week");



ALTER TABLE ONLY "public"."work_schedules"
    ADD CONSTRAINT "work_schedules_pkey" PRIMARY KEY ("id");



CREATE INDEX "index_upcoming_appointments" ON "public"."appointments" USING "btree" ("start_time") WHERE ("reminder_set_at" IS NULL);



CREATE OR REPLACE TRIGGER "on_profile_update_sync_auth" AFTER UPDATE ON "public"."profiles" FOR EACH ROW WHEN (("old"."full_name" IS DISTINCT FROM "new"."full_name")) EXECUTE FUNCTION "public"."sync_full_name_to_auth"();



ALTER TABLE ONLY "public"."appointments"
    ADD CONSTRAINT "appointments_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id");



ALTER TABLE ONLY "public"."appointments"
    ADD CONSTRAINT "appointments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_favorite_service_id_fkey" FOREIGN KEY ("favorite_service_id") REFERENCES "public"."services"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Admins can update any appointments" ON "public"."appointments" FOR UPDATE USING ((( SELECT "profiles"."is_admin"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = ( SELECT "auth"."uid"() AS "uid"))) = true)) WITH CHECK ((( SELECT "profiles"."is_admin"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = ( SELECT "auth"."uid"() AS "uid"))) = true));



CREATE POLICY "Enable delete for admins" ON "public"."services" FOR DELETE USING ((( SELECT "profiles"."is_admin"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = ( SELECT "auth"."uid"() AS "uid"))) = true));



CREATE POLICY "Enable delete schedule overrides for admins" ON "public"."schedule_overrides" FOR DELETE USING ((( SELECT "profiles"."is_admin"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = ( SELECT "auth"."uid"() AS "uid"))) = true));



CREATE POLICY "Enable insert for admin users only" ON "public"."schedule_overrides" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "profiles"."is_admin"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = ( SELECT "auth"."uid"() AS "uid"))) = true));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."appointments" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."work_schedules" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "profiles"."is_admin"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = ( SELECT "auth"."uid"() AS "uid"))) = true));



CREATE POLICY "Enable insert of admin users" ON "public"."services" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "profiles"."is_admin"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = ( SELECT "auth"."uid"() AS "uid"))) = true));



CREATE POLICY "Enable read access for all admins" ON "public"."schedule_overrides" FOR SELECT USING ((( SELECT "profiles"."is_admin"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = ( SELECT "auth"."uid"() AS "uid"))) = true));



CREATE POLICY "Enable read access for all users" ON "public"."appointments" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."services" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."work_schedules" FOR SELECT USING ((( SELECT "profiles"."is_admin"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = ( SELECT "auth"."uid"() AS "uid"))) = true));



CREATE POLICY "Enable update for admin users only" ON "public"."schedule_overrides" FOR UPDATE USING ((( SELECT "profiles"."is_admin"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = ( SELECT "auth"."uid"() AS "uid"))) = true)) WITH CHECK ((( SELECT "profiles"."is_admin"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = ( SELECT "auth"."uid"() AS "uid"))) = true));



CREATE POLICY "Enable update for admins" ON "public"."services" FOR UPDATE USING ((( SELECT "profiles"."is_admin"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = ( SELECT "auth"."uid"() AS "uid"))) = true)) WITH CHECK ((( SELECT "profiles"."is_admin"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = ( SELECT "auth"."uid"() AS "uid"))) = true));



CREATE POLICY "Enable update for users based on email" ON "public"."work_schedules" FOR UPDATE USING ((( SELECT "profiles"."is_admin"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = ( SELECT "auth"."uid"() AS "uid"))) = true)) WITH CHECK ((( SELECT "profiles"."is_admin"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = ( SELECT "auth"."uid"() AS "uid"))) = true));



CREATE POLICY "Manage profile updates" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (((( SELECT "profiles_1"."is_admin"
   FROM "public"."profiles" "profiles_1"
  WHERE ("profiles_1"."id" = "auth"."uid"())) = true) OR ("id" = ( SELECT "auth"."uid"() AS "uid"))));



CREATE POLICY "Users can update their own appointments" ON "public"."appointments" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



ALTER TABLE "public"."appointments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."schedule_overrides" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."services" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."work_schedules" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";







# supabase/config.toml[functions.send-reminders]# This is a standard cron expression.# "*/30 * * * *" means "at every 30th minute".# Runs at 12:00, 12:30, 1:00, 1:30, etc.schedule = "*/30 * * * *"














































































































































GRANT ALL ON FUNCTION "public"."get_available_slots"("p_date" "date", "p_duration_minutes" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_available_slots"("p_date" "date", "p_duration_minutes" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_available_slots"("p_date" "date", "p_duration_minutes" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_client_stats"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_client_stats"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_client_stats"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_clients_count"("p_search_term" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_clients_count"("p_search_term" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_clients_count"("p_search_term" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_clients_with_stats"("p_search_term" "text", "p_sort_column" "text", "p_sort_order" "text", "p_page_size" integer, "p_page_number" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_clients_with_stats"("p_search_term" "text", "p_sort_column" "text", "p_sort_order" "text", "p_page_size" integer, "p_page_number" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_clients_with_stats"("p_search_term" "text", "p_sort_column" "text", "p_sort_order" "text", "p_page_size" integer, "p_page_number" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_dashboard_stats"("p_date" "date") TO "anon";
GRANT ALL ON FUNCTION "public"."get_dashboard_stats"("p_date" "date") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_dashboard_stats"("p_date" "date") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_service_popularity"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_service_popularity"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_service_popularity"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_stats"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_stats"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_stats"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_weekly_revenue"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_weekly_revenue"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_weekly_revenue"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."sync_full_name_to_auth"() TO "anon";
GRANT ALL ON FUNCTION "public"."sync_full_name_to_auth"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."sync_full_name_to_auth"() TO "service_role";















GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."appointments" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."appointments" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."appointments" TO "service_role";



GRANT ALL ON SEQUENCE "public"."appointments_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."appointments_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."appointments_id_seq" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."profiles" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE ON TABLE "public"."profiles" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."profiles" TO "service_role";



GRANT UPDATE("updated_at") ON TABLE "public"."profiles" TO "authenticated";



GRANT UPDATE("full_name") ON TABLE "public"."profiles" TO "authenticated";



GRANT UPDATE("phone") ON TABLE "public"."profiles" TO "authenticated";



GRANT UPDATE("notes") ON TABLE "public"."profiles" TO "authenticated";



GRANT UPDATE("notify_email_confirmation") ON TABLE "public"."profiles" TO "authenticated";



GRANT UPDATE("notify_sms_reminder") ON TABLE "public"."profiles" TO "authenticated";



GRANT UPDATE("is_banned") ON TABLE "public"."profiles" TO "authenticated";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."schedule_overrides" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."schedule_overrides" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."schedule_overrides" TO "service_role";



GRANT ALL ON SEQUENCE "public"."schedule_overrides_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."schedule_overrides_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."schedule_overrides_id_seq" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."services" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."services" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."services" TO "service_role";



GRANT ALL ON SEQUENCE "public"."services_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."services_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."services_id_seq" TO "service_role";



GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."work_schedules" TO "anon";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."work_schedules" TO "authenticated";
GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLE "public"."work_schedules" TO "service_role";



GRANT ALL ON SEQUENCE "public"."work_schedules_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."work_schedules_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."work_schedules_id_seq" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT SELECT,INSERT,REFERENCES,DELETE,TRIGGER,TRUNCATE,UPDATE ON TABLES TO "service_role";






























\unrestrict EhrPIBggWJV0hrlvj4R3jkVcdDQHq6WRoEyIcfCNx1Jro7F3pq25MS7NCzgjqBl

RESET ALL;
