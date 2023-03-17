//Подготовить строку для запросов GET
function makeQueryString(req, tableName) {

    let paramsString = JSON.stringify(req.params);
    const paramsArray = Object.entries(req.params);
    
    let queryString = `SELECT * FROM ` + tableName + ` `;

    if (paramsString.match(/id|name|year/) ) { 
        queryString += `WHERE `;
        for (let i = 0; i < paramsArray.length; ++i) {

            if ( i != 0) {
                queryString += `AND `;
            }

            if (paramsArray[i][0].match(/id/)) {
                queryString += `${paramsArray[i][0]}=${paramsArray[i][1]} `;
            } 
            
            else if (paramsArray[i][0].match(/name/)) {
                if (paramsArray[i][0].match(/like/)) {
                    queryString += `${paramsArray[i][0]} '${paramsArray[i][1]}' `;
                }
                else { queryString += `${paramsArray[i][0]}=${paramsArray[i][1]} `; }
            } 
            
            else if (paramsArray[i][0].match(/year/)) {
                queryString += `${paramsArray[i][0]}=${paramsArray[i][1]} `;
            }
        }
    }
    queryString += `;`;
    return queryString;
}


//Подготовить строку для запросов DELETE
function queryStringForDeletion(tableName, id, name) {
    let queryString = `DELETE FROM ` + tableName + ` WHERE `;

    if (id) {
        queryString += `id = ${id} `;
        if (name) {
            queryString += `AND name = '${name}' returning *;`;
        }
        else { queryString += `returning *;`; }
    } else {
        queryString += `name = '${name}' returning *;`;
    }
    return queryString;
}


async function writeFilmsToDB(req, res, film, filmNumber, result, db) {
    
    const {name, year, genres} = film;
    if (name == undefined || year == undefined || genres == undefined) {
        return;
    }
    const arrayGenres = genres.split(',');
    let newFilm, addedGenre;

    newFilm = await db.query(`INSERT INTO film (
        name, year) VALUES ($1, $2) returning *;`, [name, year]);   
    
    result['film_'+ filmNumber] = newFilm.rows;
    
    for (let i = 0; i < arrayGenres.length; ++i) {
        addedGenre = await db.query(`INSERT INTO film_genres (
            film_id, genres_id) VALUES ($1, $2) returning *;`, 
            [newFilm.rows[0].id, arrayGenres[i]]);   
        
            result['film' + filmNumber + '_genre' + (i + 1)] = addedGenre.rows;
    }
}


async function updateFilmData(req, res, result, db) {
    const {id, name, year, genres} = req.body;
    if (id == undefined || name == undefined || year == undefined || genres == undefined) {
        return;
    }
    const arrayGenres = genres.split(',');
    let addedGenre;
    
    let updatedFilm = await db.query(`UPDATE film set name = $1, year = $2 WHERE id = $3 returning *;`,
            [name, year, id]);   
    result.film = updatedFilm.rows;
    
    const queryString = `DELETE FROM film_genres WHERE film_id = ${updatedFilm.rows[0].id} 
                         AND genres_id NOT IN (` + genres +`);`;
    await db.query(queryString);   
    
    for (let i = 0; i < arrayGenres.length; ++i) {
        const queryString = `INSERT INTO film_genres (
            film_id, genres_id) VALUES (${updatedFilm.rows[0].id}, ${arrayGenres[i]}) 
            ON CONFLICT (film_id, genres_id) DO NOTHING returning *;`;
        addedGenre = await db.query(queryString);   
        
        if (addedGenre.rows.length != 0) {
            result['genre_' + (i + 1)] = addedGenre.rows;
        }
    }
}


async function deleteFilmFromDB(req, res, result, db) {
    
    const {id, name} = req.body;
    if (id == undefined && name == undefined) {
       return;
    }
    let queryString = queryStringForDeletion('film', id, name);
    let removedFilm;

    removedFilm = await db.query(queryString);   
    if (removedFilm.rows.length == 0) {
        return;
    } 

    result.removed_film = removedFilm.rows;
    queryString = `DELETE FROM film_genres WHERE film_id = ${removedFilm.rows[0].id} returning *;`;
    let removedGenres;
    removedGenres = await db.query(queryString);   
 
    if (removedGenres.rows.length != 0) {
        result.removed_film_genres = removedGenres.rows;
    }
}



async function writeGenresToDB(req, res, genre, genreNumber, result, db) {
    
    const {name} = genre;
    if (genre == undefined) {
        return;
    }
    let newGenre;

    newGenre = await db.query(`INSERT INTO genres (name) VALUES ($1) ON CONFLICT (name) DO NOTHING returning *;`, [name]);   
  
    if (newGenre.rows.length != 0) {
        result['genre_'+ genreNumber] = newGenre.rows;
    }
}


async function updateGenreData(req, res, result, db) {
    const {id, name} = req.body;
    
    if (name == undefined || id == undefined) {
        return;
    }

    let updatedGenre;
    updatedGenre = await db.query(`UPDATE genres set name = $1 WHERE id = $2  returning *;`,
        [name, id]);   
  
    if (updatedGenre.rows.length != 0) {
        result.genre = updatedGenre.rows;
    }
}


async function deleteGenreFromDB(req, res, result, db) {
    const {id, name} = req.body;
    if (id == undefined && name == undefined) {
       return;
    }
    let removedGenre;
    let queryString = queryStringForDeletion('genres', id, name);
    
    removedGenre = await db.query(queryString);   
    if (removedGenre.rows.length == 0) {
        return;
    }
    result.removed_genre = removedGenre.rows;
    
    queryString = `DELETE FROM film_genres WHERE genres_id = ${removedGenre.rows[0].id} returning *;`;
    let removedGenres = await db.query(queryString);   
    
    if (removedGenres.rows.length != 0) {
        result.removed_film_genres = removedGenres.rows;
    }
}

module.exports = {
    makeQueryString,
    writeFilmsToDB,
    updateFilmData,
    deleteFilmFromDB,
    writeGenresToDB,
    updateGenreData,
    deleteGenreFromDB
}