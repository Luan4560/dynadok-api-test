import {
  UpdateClientUsecase,
  UpdateClientInputDto,
  UpdateClientOutputDto,
} from '#usecases/client/update.client.usecase.js';
import { Route } from '../routes/route.js';
import { Request, Response } from 'express';
import { HttpMethod } from '../routes/route.js';

export class UpdateClientRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly updateClientUseService: UpdateClientUsecase,
  ) {}

  public static create(updateClientUseService: UpdateClientUsecase): UpdateClientRoute {
    return new UpdateClientRoute(
      '/clients/:clientId',
      HttpMethod.PUT,
      updateClientUseService,
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { name, email, phone } = request.body as UpdateClientInputDto;
      const { clientId } = request.params as { clientId: string };

      const input: UpdateClientInputDto = {
        id: clientId,
        name,
        email,
        phone,
      };

      const output = await this.updateClientUseService.execute(input);

      const responseBody = this.present(output);

      response.status(201).json(responseBody).send();
    };
  }

  public getPath(): string {
    return this.path;
  }

  public getMethod(): HttpMethod {
    return this.method;
  }

  private present(input: UpdateClientOutputDto): UpdateClientOutputDto {
    const response: UpdateClientOutputDto = {
      id: input.id,
      name: input.name,
      email: input.email,
      phone: input.phone,
    };

    return response;
  }
}
