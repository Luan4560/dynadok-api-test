import express, { Express } from 'express';
import { Api } from '../api.js';
import { Route } from './routes/route.js';

export class ApiExpress implements Api {
  private app: Express;
  private routes: Route[];

  private constructor(routes: Route[]) {
    this.app = express();
    this.routes = routes;
    this.app.use(express.json());
    this.addRoutes(routes);
  }

  public static create(routes: Route[]) {
    return new ApiExpress(routes);
  }

  private addRoutes(routes: Route[]) {
    routes.forEach(route => {
      const path = route.getPath();
      const method = route.getMethod();
      const handler = route.getHandler();

      this.app[method](path, handler);
    });
  }

  public start(port: number): Promise<void> {
    return new Promise(resolve => {
      this.app.listen(port, () => {
        console.log(`Server is running on port ${String(port)}`);
        this.listRoutes();
        resolve();
      });
    });
  }

  private listRoutes() {
    console.log('\nRegistered Routes:');
    this.routes.forEach(route => {
      console.log(`${route.getMethod().toUpperCase()} ${route.getPath()}`);
    });
    console.log('\n');
  }
}
