const PORT = process.env.PORT || 5000;

const Application = require('./framework/application');
const userRouter = require('./src/films-router');
const jsonParser = require('./framework/parseJson');
const parseUrl = require('./framework/parseUrl');

const app = new Application();

app.use(jsonParser);
app.use(parseUrl('http://localhost:' + PORT));

app.addRouter(userRouter);

app.listen(PORT, ()=> { console.log(`Server starts on PORT ${PORT}`); });
