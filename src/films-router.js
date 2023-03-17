const Router = require('../framework/router');
const controller = require('./films-controller');
const router = new Router;

router.post('/films', controller.createFilms);
router.get('/films', controller.getFilms);
router.put('/films', controller.updateFilm);
router.delete('/films', controller.deleteFilm);

router.post('/genres', controller.createGenres);
router.get('/genres', controller.getGenres);
router.put('/genres', controller.updateGenre);
router.delete('/genres', controller.deleteGenre);


module.exports = router