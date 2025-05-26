import { Request, Response } from 'express';
import {
  ListClientOutputDto,
  ListClientUsecase,
} from '../../../../usecases/client/list.client.usecase.js';
import { HttpMethod, Route } from '../routes/route.js';

export class ListClientRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly listClientService: ListClientUsecase,
  ) {}

  public static create(listClientService: ListClientUsecase) {
    return new ListClientRoute('/clients', HttpMethod.GET, listClientService);
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const output = await this.listClientService.execute();

      const responseBody = this.present(output);

      response.status(200).json(responseBody).send();
    };
  }

  public getPath(): string {
    return this.path;
  }

  public getMethod(): HttpMethod {
    return this.method;
  }

  private present(input: ListClientOutputDto): ListClientOutputDto {
    return {
      clients: input.clients.map(client => {
        return {
          id: client.id,
          name: client.name,
          email: client.email,
          phone: client.phone,
        };
      }),
    };
  }
}
