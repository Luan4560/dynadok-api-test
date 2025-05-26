import { Request, Response } from 'express';

export type HttpMethod = 'get' | 'post' | 'put' | 'delete';

export const HttpMethod = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
} as const;

export interface Route {
  getHandler(): (request: Request, response: Response) => Promise<void>;
  getPath(): string;
  getMethod(): HttpMethod;
}
