const db = require('../db');
const prepareData = require('./prepare-data');


//GET-запрос к film; может содержать параметры после ?
//, разделенные с помощью &, 
//знак = после ключа (с модификаторами вида <, >, like) обязателен;
//для id и year можно писать: /films?id=3&year>=1999
//или films?id>=2&year=2010, или films?id=2&year<=2010
//для name можно писать: name=The Shack или name like=%The Shack%
const getFilms = async (req, res) => {
    let queryString = prepareData.makeQueryString(req, 'film'); 
    let films;   
    try {
        films = await db.query(queryString);   
    }
    catch (err) {
        res.send(err);
        return;
    } 
    res.send(films.rows);
}


//POST-запрос к film; может содержать 1 или несколько фильмов
//id жанров передаются как значения для ключа "genres" в строке через запятую
const createFilms = async (req, res) => {
    let result = {};
    if (req.body == undefined) {
        res.send('');
        return;
    }
    try {
        if (req.body.length === undefined) {
            await prepareData.writeFilmsToDB(req, res, req.body, 1, result, db);
        }
        else {
            let filmNumber = 1;
            for (let film of req.body) {
                await prepareData.writeFilmsToDB(req, res, film, filmNumber, result, db);
                ++filmNumber;
            }
        }
    }
    catch (err) {
        res.send(err);
        return;
    }
    res.send(result);
}

//PUT-запрос к film; обновляется только 1 фильм.
//Вначале неподходящие жанры удаляются из film_genres,
//затем недостающие жанры добавляются
const updateFilm = async (req, res) => {
    let result = {};
    try {
        await prepareData.updateFilmData(req, res, result, db);
    }
    catch (err) {
        res.send(err);    
        return;
    }
    res.send(result);
}

//DELETE-запрос к фильм; удаляется 1 фильм.
//На удаление передается id и(или) name.
const deleteFilm = async (req, res) => {
    let result = {};
    try {
        await prepareData.deleteFilmFromDB(req, res, result, db);
    }
    catch (err) {
        res.send(err);
        return;
    }
    res.send(result);
}

//GET-запрос к genres;
//можно задать id и name - так же, как и в GET для films
const getGenres = async (req, res) => {
    let queryString = prepareData.makeQueryString(req, 'genres'); 
    let genres;   
    try {
        genres = await db.query(queryString);   
    }
    catch (err) {
        res.send(err);
        return;
    } 
    res.send(genres.rows);
}

//POST-запрос к genres; может содержать 1 или несколько жанров
const createGenres = async (req, res) => {
    let result = {};
    
    if (req.body == undefined) {
        res.send('');
        return;
    }

    if (req.body.length === undefined) {
        await prepareData. writeGenresToDB(req, res, req.body, 1, result, db);
    }
    else {
        let genreNumber = 1;
        for (let genre of req.body) {
            await prepareData.writeGenresToDB(req, res, genre, genreNumber, result, db);
            ++genreNumber;
        }
    }   
    res.send(result);
}

//PUT-запрос к genres; 
//одинаковые названия жанров не допускаются
const updateGenre = async (req, res) => {
    let result = {};
    try {
        await prepareData.updateGenreData(req, res, result, db);
    }
    catch (err) {
        res.send(err);
        return;
    }
    res.send(result);
}

//DELETE-запрос к genres; удаляется 1 жанр.
//На удаление передается id и(или) name.
const deleteGenre = async (req, res) => {
    let result = {};
    try {
        await prepareData.deleteGenreFromDB(req, res, result, db);
    }
    catch(err) {
        res.send(err);
        return;
    }
    res.send(result);
}


module.exports = {
    getFilms,
    createFilms,
    updateFilm,
    deleteFilm,
    getGenres,
    createGenres,
    updateGenre,
    deleteGenre
}