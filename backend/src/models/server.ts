import express from 'express';
import connection from '../db/connection';
import routesAplicaciones from '../routes/link.routes';
import routesDefault from '../routes/default.routes';
import routesUser from '../routes/user.routes';
import cors from 'cors';

class Server {
    private app: express.Application;
    private port: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '3001';
        this.listen();
        this.connectDB();
        this.midlewares();
        this.routes();
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('servidor corriendo en el puerto', this.port);
        })
    }

    connectDB() {
        connection.connect((err) => {
            if(err) {
                console.log(err)
            } else {
                console.log('Base de datos conectada exitosamente!!!')
            }
        })
    }

    routes() {
        this.app.use('/', routesDefault);
        this.app.use('/api/aplicaciones', routesAplicaciones);
        this.app.use('/api/usuarios', routesUser)
    }

    midlewares() {
        this.app.use(cors({
            origin: 'http://localhost:5173',
            credentials: true,
        }));
        this.app.use(express.json());
    }
}

export default Server;