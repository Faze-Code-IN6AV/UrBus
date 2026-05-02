'use strict'

import http from 'http';
import { Server } from 'socket.io';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import engine from 'ejs-mate';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { parse } from 'yaml';
import { corsOptions } from './cors.configuration.js';
import { helmetOptions } from './helmet.configuration.js';
import { requestLimit } from './rateLimit.configuration.js';
import { errorHandler } from '../middlewares/handle-errors.js';

const BASE_PATH = '/urbus/v1';
const swaggerDoc = parse(readFileSync('./swagger.yaml', 'utf8'));

// Coordenadas de Kinal y tolerancia
const kinalCoords = { lat: 14.6258, lng: -90.5360 };
const tolerance = 0.0002; // aprox 20 metros
let busArrived = false;

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));
    app.use(express.json({ limit: '10mb' }));
    app.use(cors(corsOptions));
    app.use(morgan('dev'));
    app.use(helmet(helmetOptions));
    app.use(requestLimit);
    app.engine('ejs', engine);
    app.set('view engine', 'ejs');
    app.set('views', './src/views');
    app.use(`${BASE_PATH}`, express.static('./src/public'));
};

const routes = (app) => {
    app.get(`${BASE_PATH}/health`, (req, res) => {
        res.status(200).json({
            status: 'healthy',
            service: 'UrBus Location Service'
        });
    });

    app.get(`${BASE_PATH}/`, (req, res) => {
        res.render('index');
    });
};

export const initServer = async () => {
    const app = express();
    const PORT = process.env.PORT;
    app.set('trust proxy', 1);

    try {
        app.use(`${BASE_PATH}/swagger`, swaggerUi.serve, swaggerUi.setup(swaggerDoc));
        middlewares(app);
        routes(app);
        app.use(errorHandler);

        const server = http.createServer(app);

        const io = new Server(server, { cors: { origin: "*" } });

        io.on("connection", (socket) => {
            console.log("Usuario conectado");

            socket.on("busLocation", (coords) => {
                // Reenviar ubicación a todos
                io.emit("updateBus", coords);

                // Verificar llegada a Kinal
                const distanceLat = Math.abs(coords.lat - kinalCoords.lat);
                const distanceLng = Math.abs(coords.lng - kinalCoords.lng);

                if (!busArrived && distanceLat <= tolerance && distanceLng <= tolerance) {
                    busArrived = true;
                    console.log("🚍 Bus llegó a Kinal");
                    io.emit("busArrived");
                }
            });
        });

        server.listen(PORT, () => {
            console.log(`UrBus Location Service running on port: ${PORT}`);
            console.log(`Health Check: http://localhost:${PORT}${BASE_PATH}/health`);
            console.log(`Documentation Check: http://localhost:${PORT}${BASE_PATH}/swagger`);
        });

    } catch (err) {
        console.error(`Error al iniciar el servidor: ${err.message}`);
        process.exit(1);
    }
};