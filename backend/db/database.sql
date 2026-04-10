--
-- PostgreSQL database dump
--

\restrict EQKyRXeYax1kJZQWemDt1vms7xNnemwPhasnzciG6oWRZZqBRSx5n7T1ddHaaMK

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: roles; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.roles AS ENUM (
    'user',
    'admin'
);


ALTER TYPE public.roles OWNER TO postgres;

--
-- Name: transaction_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.transaction_type AS ENUM (
    'deposit',
    'withdraw',
    'transfer'
);


ALTER TYPE public.transaction_type OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bank_balance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bank_balance (
    id uuid DEFAULT gen_random_uuid() CONSTRAINT user_wallet_id_not_null NOT NULL,
    user_id uuid,
    balance numeric(12,2) DEFAULT 0 CONSTRAINT user_wallet_balance_not_null NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT balance_check CHECK ((balance >= (0)::numeric)),
    CONSTRAINT bank_balance_balance_check CHECK ((balance >= (0)::numeric))
);


ALTER TABLE public.bank_balance OWNER TO postgres;

--
-- Name: refreshtokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refreshtokens (
    id uuid DEFAULT gen_random_uuid() CONSTRAINT refreshtoken_id_not_null NOT NULL,
    user_id uuid,
    jti uuid CONSTRAINT refreshtoken_jti_not_null NOT NULL,
    created_at timestamp with time zone DEFAULT now() CONSTRAINT refreshtoken_created_at_not_null NOT NULL
);


ALTER TABLE public.refreshtokens OWNER TO postgres;

--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    type public.transaction_type,
    balance_before numeric(12,2) NOT NULL,
    balance_after numeric(12,2) NOT NULL,
    user_email text
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Name: user_wallet; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_wallet (
    id uuid DEFAULT gen_random_uuid() CONSTRAINT user_wallet_id_not_null1 NOT NULL,
    user_id uuid,
    balance numeric(12,2) DEFAULT 0 CONSTRAINT user_wallet_balance_not_null1 NOT NULL
);


ALTER TABLE public.user_wallet OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    username character varying(20) NOT NULL,
    hash text NOT NULL,
    email character varying(20) NOT NULL,
    role public.roles DEFAULT 'user'::public.roles,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    is_active boolean DEFAULT true
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: bank_balance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bank_balance (id, user_id, balance, updated_at) FROM stdin;
\.


--
-- Data for Name: refreshtokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refreshtokens (id, user_id, jti, created_at) FROM stdin;
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (id, user_id, created_at, type, balance_before, balance_after, user_email) FROM stdin;
\.


--
-- Data for Name: user_wallet; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_wallet (id, user_id, balance) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, hash, email, role, created_at, is_active) FROM stdin;
\.


--
-- Name: refreshtokens refreshtoken_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refreshtokens
    ADD CONSTRAINT refreshtoken_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: bank_balance user_wallet_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_balance
    ADD CONSTRAINT user_wallet_pkey PRIMARY KEY (id);


--
-- Name: user_wallet user_wallet_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_wallet
    ADD CONSTRAINT user_wallet_pkey1 PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: jti_refresh_tokens; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX jti_refresh_tokens ON public.refreshtokens USING btree (jti);


--
-- Name: uid_refresh_tokens; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX uid_refresh_tokens ON public.refreshtokens USING btree (user_id);


--
-- Name: refreshtokens refreshtoken_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refreshtokens
    ADD CONSTRAINT refreshtoken_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: transactions transactions_user_email_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_user_email_fkey FOREIGN KEY (user_email) REFERENCES public.users(email) ON DELETE CASCADE;


--
-- Name: transactions transactions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: bank_balance user_wallet_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bank_balance
    ADD CONSTRAINT user_wallet_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_wallet user_wallet_user_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_wallet
    ADD CONSTRAINT user_wallet_user_id_fkey1 FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict EQKyRXeYax1kJZQWemDt1vms7xNnemwPhasnzciG6oWRZZqBRSx5n7T1ddHaaMK

