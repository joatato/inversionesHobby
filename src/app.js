// server.js
import fs from 'fs/promises';
import path from 'path';
//Express
import express from 'express';
import session from 'express-session';
import { engine } from 'express-handlebars';
//-------------------------------------------------------------------------------------
//Mongoose
import mongoose from 'mongoose'
//-------------------------------------------------------------------------------------
//Config
import { config } from './config/config.js';
//-------------------------------------------------------------------------------------
//Routes
import viewsRouter from './routes/views.router.js';
import { router as sessionsRouter } from './routes/sessions.router.js';
import usersRouter from './routes/users.router.js';
import projectsRouter from './routes/projects.router.js';
//-------------------------------------------------------------------------------------
//Tools
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import cors from 'cors';
import { inicializaEstrategias } from './config/passport.config.js';
import passport from 'passport';
import __dirname from './utils/utils.js';
import cookieParser from 'cookie-parser';
//-------------------------------------------------------------------------------------

const PORT = config.app.PORT

const app = express();
const userFilePath = join(__dirname, '../user.json');
//Porque no uso el path???
//const userFilePath = path.join(__dirname, 'user.json');


app.use(express.static(path.join(__dirname, "../public")));

// ...
var corsOptions = {
    origin: '*', // Reemplazar con dominio
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));


// Configuración de sesiones
app.use(
    session({
        secret: process.env.TOKEN_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

app.engine('handlebars', engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

inicializaEstrategias()
app.use(passport.initialize())

app.use('/', viewsRouter);
app.use('/api/sessions', sessionsRouter)
app.use('/api/users', usersRouter)
app.use('/api/projects', projectsRouter)

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.ywbl7gx.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`
/* name=${process.env.DBNAME} */
const option = { useNewUrlParser: true, useUnifiedTopology: true }
mongoose.connect(uri, option)
    .then(() => console.log('Base de datos conectada'))
    .catch(e => console.log('error db: ', e))



server.on('error', (error) => console.log(error));