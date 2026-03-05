'use strict'

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import notificationRoutes from '../src/notifications/notification.routes.js';

const BASE_PATH = '/urbus/v1';

export const initServer = async () => {
    const app = express();
    const PORT = process.env.PORT || 5000;

    app.set('trust proxy', 1);

    // Middlewares
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(cors());
    app.use(morgan('dev'));
    app.use(helmet());

    // Routes
    app.use(`${BASE_PATH}/notifications`, notificationRoutes);

    app.get(`${BASE_PATH}/health`, (req, res) => {
        res.status(200).json({
            status: 'healthy',
            service: 'UrBus Notification Service'
        });
    });

    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: 'Ruta no encontrada en el servidor.'
        });
    });

    // Start server
    app.listen(PORT, () => {
        console.log(`Servicio de notificación ejecutándose en puertot: ${PORT}`);
        console.log(`Health Check: http://localhost:${PORT}${BASE_PATH}/health`);
    });
};