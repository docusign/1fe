import express from 'express';
import cookieParser from 'cookie-parser';
import combinedMiddleware from './middlewares';

const initializeRoutes = () => {

}

export const magicBoxServer = () => {
    const app = express();
    app.use(cookieParser());
    app.use(combinedMiddleware);
    initializeRoutes();

    return app;
}