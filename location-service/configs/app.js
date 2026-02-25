'use strict'

import http from 'http';
import { Server } from 'socket.io';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import engine from 'ejs-mate';
import { corsOptions } from './cors.configuration.js';
import { helmetOptions } from './helmet.configuration.js';
import { requestLimit } from './rateLimit.configuration.js';
import { errorHandler } from '../middlewares/handle-errors.js';

const BASE_PATH = '/UrBus/v1'

const middlewares = (app) => {
    app.use(express.urlencoded({extended: false, limit: '10mb'}));
    app.use(express.json({limit: '10mb'}));
    app.use(cors(corsOptions));
    app.use(morgan('dev'));
    app.use(helmet(helmetOptions));
    app.use(requestLimit);
    app.engine('ejs', engine);
    app.set('view engine', 'ejs');
    app.set('views', './src/views'); //Ruta para las vistas
    app.use(`${BASE_PATH}`, express.static('./src/public')); //Ruta para los archivos estáticos (CSS, JS, imágenes)
};

//Rutas
const routes = (app) => {
    app.get(`${BASE_PATH}/health`, (req, res) => {
        res.status(200).json({
            status: 'healthy',
            service: 'UrBus Admin Server'
        });
    });

    app.get(`${BASE_PATH}/`, (req, res) => {
        res.render('index');
    });
}

//Inicialización del servidor
export const initServer = async () => {
    const app = express();
    const PORT = process.env.PORT;
    app.set('trust proxy', 1);

    try{
        middlewares(app);
        routes(app);

        app.use(errorHandler);

        // Creamos el servidor HTTP
        const server = http.createServer(app);

        // Inicializamos socket.io
        const io = new Server(server, {
            cors: {
                origin: "*"
            }
        });

        // Evento de conexión
        io.on("connection", (socket) => {
            console.log("Usuario conectado");

            socket.on("busLocation", (data) => {
                // Enviar ubicación del bus a todos menos al que la envió
                io.emit("updateBus", data);
            });
        });

        // Ahora escuchamos con server.listen
        server.listen(PORT, () => {
            console.log(`UrBus's Admin Server running on port: ${PORT}`);
            console.log(`Health Check: http://localhost:${PORT}${BASE_PATH}/health`)
        });

    }catch(err){
        console.error(`Error al iniciar el servidor: ${err.message}`);
        process.exit(1);
    }
}