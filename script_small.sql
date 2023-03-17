-- Database: films

DROP DATABASE IF EXISTS films;

CREATE DATABASE films
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Russian_Russia.1251'
    LC_CTYPE = 'Russian_Russia.1251'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

COMMENT ON DATABASE films
    IS 'Contains info about films and their genres';

\c films
\encoding UTF8

-- Table: public.genres

-- DROP TABLE IF EXISTS public.genres;

CREATE TABLE IF NOT EXISTS public.genres
(
    id smallint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 32767 CACHE 1 ),
    name character varying(50) NOT NULL,
    CONSTRAINT genres_pk PRIMARY KEY (id),
    CONSTRAINT name_unique UNIQUE (name)
);

COMMENT ON TABLE public.genres
    IS 'The table contains genres:
id - non-null auto incrementing identificator of genre;
genre - the name of the genre.';

-- Table: public.film

-- DROP TABLE IF EXISTS public.film;

CREATE TABLE IF NOT EXISTS public.film
(
    id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    name character varying(200) NOT NULL,
    year smallint NOT NULL,
	 CONSTRAINT film_pk PRIMARY KEY (id),
	 CONSTRAINT film_name_unique UNIQUE (name)
);

COMMENT ON TABLE public.film
    IS 'The table contains info about the film, the some columns:
id - the unique auto incrementing primary key - an id of film;
name - the name of the film;
year - release year';

-- Table: public.film_genres

-- DROP TABLE IF EXISTS public.film_genres;

CREATE TABLE IF NOT EXISTS public.film_genres
(
    film_id bigint NOT NULL,
    genres_id smallint NOT NULL,
    CONSTRAINT film_genres_pk PRIMARY KEY (film_id, genres_id),
    CONSTRAINT film_id_fk FOREIGN KEY (film_id)
        REFERENCES public.film (id) 
		ON UPDATE CASCADE 
        ON DELETE CASCADE,
    CONSTRAINT genre_id_fk FOREIGN KEY (genres_id)
        REFERENCES public.genres (id) 
		ON UPDATE CASCADE 
        ON DELETE CASCADE
);

COMMENT ON TABLE public.film_genres
    IS 'The table implements a many-to-many relationship between tables film and genres on the corresponding primary keys.';

----------------------------------------------------------------------

INSERT INTO public.genres (
name) VALUES (
'драма'::character varying)
 returning id;

INSERT INTO public.genres (
name) VALUES (
'фэнтези'::character varying)
 returning id;

INSERT INTO public.genres (
name) VALUES (
'комедия'::character varying)
 returning id;

INSERT INTO public.genres (
name) VALUES (
'криминал'::character varying)
 returning id;

INSERT INTO public.genres (
name) VALUES (
'мелодрама'::character varying)
 returning id;

INSERT INTO public.genres (
name) VALUES (
'боевик'::character varying)
 returning id;

INSERT INTO public.genres (
name) VALUES (
'триллер'::character varying)
 returning id;

INSERT INTO public.genres (
name) VALUES (
'вестерн'::character varying)
 returning id;

-------------------------------------------

INSERT INTO public.film (
name, year) VALUES (
'The Green Mile'::character varying, '1999'::smallint)
 returning id;

INSERT INTO public.film (
name, year) VALUES (
'Kill Bill'::character varying, '2003'::smallint)
 returning id;

INSERT INTO public.film (
name, year) VALUES (
'Ghost'::character varying, '1990'::smallint)
 returning id;

INSERT INTO public.film (
name, year) VALUES (
'The Shack'::character varying, '2017'::smallint)
 returning id;

----------------------------------------------

INSERT INTO public.film_genres (
film_id, genres_id) VALUES (
'1'::bigint, '1'::smallint)
 returning film_id,genres_id;

INSERT INTO public.film_genres (
film_id, genres_id) VALUES (
'1'::bigint, '2'::smallint)
 returning film_id,genres_id;

INSERT INTO public.film_genres (
film_id, genres_id) VALUES (
'1'::bigint, '4'::smallint)
 returning film_id,genres_id;

INSERT INTO public.film_genres (
film_id, genres_id) VALUES (
'2'::bigint, '1'::smallint)
 returning film_id,genres_id;

INSERT INTO public.film_genres (
film_id, genres_id) VALUES (
'2'::bigint, '4'::smallint)
 returning film_id,genres_id;

INSERT INTO public.film_genres (
film_id, genres_id) VALUES (
'2'::bigint, '6'::smallint)
 returning film_id,genres_id;

INSERT INTO public.film_genres (
film_id, genres_id) VALUES (
'2'::bigint, '7'::smallint)
 returning film_id,genres_id;

INSERT INTO public.film_genres (
film_id, genres_id) VALUES (
'3'::bigint, '1'::smallint)
 returning film_id,genres_id;

INSERT INTO public.film_genres (
film_id, genres_id) VALUES (
'3'::bigint, '2'::smallint)
 returning film_id,genres_id;

INSERT INTO public.film_genres (
film_id, genres_id) VALUES (
'3'::bigint, '5'::smallint)
 returning film_id,genres_id;

INSERT INTO public.film_genres (
film_id, genres_id) VALUES (
'3'::bigint, '7'::smallint)
 returning film_id,genres_id;

INSERT INTO public.film_genres (
film_id, genres_id) VALUES (
'4'::bigint, '1'::smallint)
 returning film_id,genres_id;

INSERT INTO public.film_genres (
film_id, genres_id) VALUES (
'4'::bigint, '2'::smallint)
 returning film_id,genres_id;
