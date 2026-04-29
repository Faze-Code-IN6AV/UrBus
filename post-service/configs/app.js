'use strict';

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { parse } from 'yaml';

import { dbConnection } from './db.js';
import { helmetOptions } from './helmet.configuration.js';
import { corsOptions } from './cors.configuration.js';
import { requestLimit } from './rateLimit.configuration.js';

import postRoutes from '../src/posts/post.routes.js';

const BASE_PATH = '/urbus/v1';
const swaggerDoc = parse(readFileSync('./swagger.yaml', 'utf8'));

export const initServer = async () => {
    const app = express();
    const PORT = process.env.PORT || 5001;

    app.set('trust proxy', 1);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

    try {
        await dbConnection();

        app.use(express.urlencoded({ extended: false, limit: '10mb' }));
        app.use(express.json({ limit: '10mb' }));
        app.use(cors(corsOptions));
        app.use(morgan('dev'));
        app.use(helmet(helmetOptions));
        app.use(requestLimit);

        app.use(`${BASE_PATH}/posts`, postRoutes);

        app.get(`${BASE_PATH}/health`, (req, res) => {
            res.status(200).json({
                status: 'healthy',
                service: 'UrBus Post Service'
            });
        });

        app.use((req, res) => {
            res.status(404).json({
                success: false,
                message: 'Ruta no encontrada en el servidor.'
            });
        });

        app.listen(PORT, () => {
            console.log(`Post Service ejecutándose en puerto: ${PORT}`);
            console.log(`Health: http://localhost:${PORT}${BASE_PATH}/health`);
        });

    } catch (err) {
        console.error(`Error iniciando servidor: ${err.message}`);
        process.exit(1);
    }
};