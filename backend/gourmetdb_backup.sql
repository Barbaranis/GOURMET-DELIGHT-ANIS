--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

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
-- Name: enum_reservations_statut; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_reservations_statut AS ENUM (
    'en_attente',
    'confirmee',
    'refusee'
);


ALTER TYPE public.enum_reservations_statut OWNER TO postgres;

--
-- Name: enum_utilisateurs_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_utilisateurs_role AS ENUM (
    'admin',
    'maitre_hotel',
    'chef_cuisine',
    'responsable_salle',
    'gestionnaire_contenu',
    'responsable_avis',
    'responsable_communication'
);


ALTER TYPE public.enum_utilisateurs_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: avis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.avis (
    id_avis integer NOT NULL,
    commentaire text NOT NULL,
    note integer NOT NULL,
    date timestamp with time zone,
    id_utilisateur integer NOT NULL,
    valide boolean DEFAULT false
);


ALTER TABLE public.avis OWNER TO postgres;

--
-- Name: avis_id_avis_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.avis_id_avis_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.avis_id_avis_seq OWNER TO postgres;

--
-- Name: avis_id_avis_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.avis_id_avis_seq OWNED BY public.avis.id_avis;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id_categorie integer NOT NULL,
    nom character varying(100) NOT NULL,
    description text
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: COLUMN categories.nom; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.categories.nom IS 'Nom de la catégorie (Entrées, Plats, Desserts, etc.)';


--
-- Name: categories_id_categorie_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_categorie_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_categorie_seq OWNER TO postgres;

--
-- Name: categories_id_categorie_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_categorie_seq OWNED BY public.categories.id_categorie;


--
-- Name: chefs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chefs (
    id_chef integer NOT NULL,
    specialite character varying(100) NOT NULL,
    experience integer,
    bio text
);


ALTER TABLE public.chefs OWNER TO postgres;

--
-- Name: COLUMN chefs.experience; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.chefs.experience IS 'Nombre d’années d’expérience';


--
-- Name: chefs_id_chef_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chefs_id_chef_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chefs_id_chef_seq OWNER TO postgres;

--
-- Name: chefs_id_chef_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chefs_id_chef_seq OWNED BY public.chefs.id_chef;


--
-- Name: contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contacts (
    id_contact integer NOT NULL,
    nom character varying(50) NOT NULL,
    prenom character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    telephone character varying(20),
    message text NOT NULL,
    date_envoi timestamp with time zone NOT NULL
);


ALTER TABLE public.contacts OWNER TO postgres;

--
-- Name: contacts_id_contact_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contacts_id_contact_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contacts_id_contact_seq OWNER TO postgres;

--
-- Name: contacts_id_contact_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contacts_id_contact_seq OWNED BY public.contacts.id_contact;


--
-- Name: plats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plats (
    id_plat integer NOT NULL,
    nom character varying(100) NOT NULL,
    description text,
    prix double precision NOT NULL,
    image_url character varying(255),
    id_categorie integer NOT NULL
);


ALTER TABLE public.plats OWNER TO postgres;

--
-- Name: plats_id_plat_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.plats_id_plat_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.plats_id_plat_seq OWNER TO postgres;

--
-- Name: plats_id_plat_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.plats_id_plat_seq OWNED BY public.plats.id_plat;


--
-- Name: reservations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reservations (
    id_reservation integer NOT NULL,
    nom character varying(50) NOT NULL,
    prenom character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    telephone character varying(20),
    date date NOT NULL,
    heure time without time zone NOT NULL,
    nb_personnes integer NOT NULL,
    message text,
    statut public.enum_reservations_statut DEFAULT 'en_attente'::public.enum_reservations_statut,
    id_utilisateur integer
);


ALTER TABLE public.reservations OWNER TO postgres;

--
-- Name: reservations_id_reservation_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reservations_id_reservation_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reservations_id_reservation_seq OWNER TO postgres;

--
-- Name: reservations_id_reservation_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reservations_id_reservation_seq OWNED BY public.reservations.id_reservation;


--
-- Name: utilisateurs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.utilisateurs (
    id_utilisateur integer NOT NULL,
    nom character varying(50),
    prenom character varying(50),
    email character varying(100) NOT NULL,
    mot_de_passe character varying(255) NOT NULL,
    role public.enum_utilisateurs_role NOT NULL,
    telephone character varying(20)
);


ALTER TABLE public.utilisateurs OWNER TO postgres;

--
-- Name: utilisateurs_id_utilisateur_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.utilisateurs_id_utilisateur_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.utilisateurs_id_utilisateur_seq OWNER TO postgres;

--
-- Name: utilisateurs_id_utilisateur_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.utilisateurs_id_utilisateur_seq OWNED BY public.utilisateurs.id_utilisateur;


--
-- Name: avis id_avis; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avis ALTER COLUMN id_avis SET DEFAULT nextval('public.avis_id_avis_seq'::regclass);


--
-- Name: categories id_categorie; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id_categorie SET DEFAULT nextval('public.categories_id_categorie_seq'::regclass);


--
-- Name: chefs id_chef; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chefs ALTER COLUMN id_chef SET DEFAULT nextval('public.chefs_id_chef_seq'::regclass);


--
-- Name: contacts id_contact; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts ALTER COLUMN id_contact SET DEFAULT nextval('public.contacts_id_contact_seq'::regclass);


--
-- Name: plats id_plat; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plats ALTER COLUMN id_plat SET DEFAULT nextval('public.plats_id_plat_seq'::regclass);


--
-- Name: reservations id_reservation; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations ALTER COLUMN id_reservation SET DEFAULT nextval('public.reservations_id_reservation_seq'::regclass);


--
-- Name: utilisateurs id_utilisateur; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs ALTER COLUMN id_utilisateur SET DEFAULT nextval('public.utilisateurs_id_utilisateur_seq'::regclass);


--
-- Data for Name: avis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.avis (id_avis, commentaire, note, date, id_utilisateur, valide) FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id_categorie, nom, description) FROM stdin;
1	Entrée	Plats légers pour commencer le repas
2	Plat principal	Plats principaux raffinés
3	Dessert	Douceurs sucrées pour finir
4	Boisson	Sélection de boissons fines
\.


--
-- Data for Name: chefs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chefs (id_chef, specialite, experience, bio) FROM stdin;
\.


--
-- Data for Name: contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contacts (id_contact, nom, prenom, email, telephone, message, date_envoi) FROM stdin;
\.


--
-- Data for Name: plats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plats (id_plat, nom, description, prix, image_url, id_categorie) FROM stdin;
20	Filet de bœuf Rossini	 Filet de bœuf poêlé sur son lit de risotto crémeux au parmesan, nappé d’un jus corsé au vin rouge et surmonté d’une tranche de foie gras poêlé et copeaux de truffe noire.	43	./src/uploads/1752484951810.png	2
21	Sphère Chocolat Blanc & Framboise	Délicate sphère de chocolat blanc garnie d’un cœur framboise, posée sur un crumble croustillant, coulis acidulé et framboises fraîches. Fleurs comestibles en décor.	15	./src/uploads/1752486003123.png	3
22	 Tartare de saumon gravlax à la rose & perles de yuzu	Délicat tartare de saumon mariné façon gravlax, infusé à la rose et relevé d’une touche de poivre Timut. Servi sur un lit de crème de betterave onctueuse, parsemé de perles de yuzu et de pétales cristallisés.	26	./src/uploads/1752486033437.png	1
23	Strawberry Daiquiri	Un cocktail élégant à base de fraises fraîches, de rhum blanc premium et de jus de citron vert pressé, subtilement sucré au sirop de sucre de canne. Servi très frais dans un verre givré, orné d’une fraise entière et d’une touche de feuille de menthe pour une présentation raffinée et gourmande.	14.5	./src/uploads/1752486631631.jpg	4
25	Velours de Cognac aux Épices	Un mélange élégant de cognac millésimé infusé aux épices douces (cannelle, cardamome, clou de girofle) et adouci par une touche de sirop d’érable fumé. Servi tiède dans un verre en cristal avec une fine zeste d’orange flambé pour exalter les arômes.	18.3	./src/uploads/1752487198711.jpg	4
26	Café	Issu de plantations d’altitude soigneusement sélectionnées, notre café d’exception révèle des arômes intenses et profonds. 100% naturel et torréfié artisanalement en micro-lot, il offre une amertume élégante et une longueur en bouche rare. Une expérience sensorielle puissante, hommage aux origines brutes et nobles du café gastronomique.	14	1752821975831.jpg	4
\.


--
-- Data for Name: reservations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reservations (id_reservation, nom, prenom, email, telephone, date, heure, nb_personnes, message, statut, id_utilisateur) FROM stdin;
\.


--
-- Data for Name: utilisateurs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.utilisateurs (id_utilisateur, nom, prenom, email, mot_de_passe, role, telephone) FROM stdin;
1	Admin	Test	admin@example.com	$2b$10$QZFO7boVYze1BmOx.5W1GubLQ/xfh2.TYkl9QOn3R2jVYzKc/ncni	admin	\N
2	CHEF	1	chefgourmet@test.com	$2b$10$xKxfNbCc8KLRG3ps97F0qOwvBIYl0R8nnfKrX9YD1Iuca9DbEapEe	chef_cuisine	\N
3	CHEF	1	chefgourmet@gourmet.com	$2b$10$YfTvVQkV7ykvbysUYqCKCeVn9gkIqkrQQr4D5svyss2bcqb.FgQEy	chef_cuisine	\N
4	Avis	1	avis@test.com	$2b$10$qIGhb.wVR2KlBgqo4sBh3.j81EeabIwayL6KYYwVZGQiywUFVLAa6	responsable_avis	\N
5	salle	salle	salle@gourmet.com	$2b$10$laQkjAZYRZTOFJ.Gc9iPvOV0u0vrZRVsc1jz9rFQfggtr/jE/e8E2	responsable_salle	\N
\.


--
-- Name: avis_id_avis_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.avis_id_avis_seq', 1, false);


--
-- Name: categories_id_categorie_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_categorie_seq', 4, true);


--
-- Name: chefs_id_chef_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chefs_id_chef_seq', 1, false);


--
-- Name: contacts_id_contact_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contacts_id_contact_seq', 1, false);


--
-- Name: plats_id_plat_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.plats_id_plat_seq', 26, true);


--
-- Name: reservations_id_reservation_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reservations_id_reservation_seq', 1, false);


--
-- Name: utilisateurs_id_utilisateur_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.utilisateurs_id_utilisateur_seq', 5, true);


--
-- Name: avis avis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avis
    ADD CONSTRAINT avis_pkey PRIMARY KEY (id_avis);


--
-- Name: categories categories_nom_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_nom_key UNIQUE (nom);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id_categorie);


--
-- Name: chefs chefs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chefs
    ADD CONSTRAINT chefs_pkey PRIMARY KEY (id_chef);


--
-- Name: contacts contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contacts
    ADD CONSTRAINT contacts_pkey PRIMARY KEY (id_contact);


--
-- Name: plats plats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plats
    ADD CONSTRAINT plats_pkey PRIMARY KEY (id_plat);


--
-- Name: reservations reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_pkey PRIMARY KEY (id_reservation);


--
-- Name: utilisateurs utilisateurs_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_email_key UNIQUE (email);


--
-- Name: utilisateurs utilisateurs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilisateurs
    ADD CONSTRAINT utilisateurs_pkey PRIMARY KEY (id_utilisateur);


--
-- Name: avis avis_id_utilisateur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.avis
    ADD CONSTRAINT avis_id_utilisateur_fkey FOREIGN KEY (id_utilisateur) REFERENCES public.utilisateurs(id_utilisateur) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: plats plats_id_categorie_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plats
    ADD CONSTRAINT plats_id_categorie_fkey FOREIGN KEY (id_categorie) REFERENCES public.categories(id_categorie) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reservations reservations_id_utilisateur_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_id_utilisateur_fkey FOREIGN KEY (id_utilisateur) REFERENCES public.utilisateurs(id_utilisateur) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

