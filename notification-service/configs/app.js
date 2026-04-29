'use strict'

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import notificationRoutes from '../src/notifications/notification.routes.js';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { parse } from 'yaml';

const BASE_PATH = '/urbus/v1';
const swaggerDoc = parse(readFileSync('./swagger.yaml', 'utf8'));

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(cors());
    app.use(morgan('dev'));
    app.use(helmet());
};

const routes = (app) => {
    app.use(`${BASE_PATH}/notifications`, notificationRoutes);

    app.get(`${BASE_PATH}/health`, (req, res) => {
        res.status(200).json({
            status: 'healthy',
            service: 'UrBus Notification Service'
        });
    });
};

export const initServer = async () => {
    const app = express();
    const PORT = process.env.PORT || 5000;
    app.set('trust proxy', 1);

    try {
        middlewares(app);
        routes(app);

        app.use(
            `${BASE_PATH}/swagger`,
            swaggerUi.serve,
            swaggerUi.setup(swaggerDoc)
        );

        app.use((req, res) => {
            res.status(404).json({
                success: false,
                message: 'Ruta no encontrada en el servidor.'
            });
        });

        app.listen(PORT, () => {
            console.log(`Servicio ejecutándose en puerto: ${PORT}`);
            console.log(`Health Check: http://localhost:${PORT}${BASE_PATH}/health`);
            console.log(`Swagger: http://localhost:${PORT}${BASE_PATH}/swagger`);
        });

    } catch (err) {
        console.error(`Error al iniciar el servidor: ${err.message}`);
        process.exit(1);
    }
};
