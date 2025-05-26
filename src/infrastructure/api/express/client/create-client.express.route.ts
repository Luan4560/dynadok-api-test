import {
  CreateClientInputDto,
  CreateClientUsecase,
} from '#usecases/client/create.client.usecase.js';
import { Request, Response } from 'express';
import { HttpMethod, Route } from '../routes/route.js';

export interface CreateClientResponseDto {
  id: string;
}

export class CreateClientRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly createClientUseService: CreateClientUsecase,
  ) {}

  public static create(createClientUseService: CreateClientUsecase): CreateClientRoute {
    return new CreateClientRoute('/clients', HttpMethod.POST, createClientUseService);
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { name, email, phone } = request.body as CreateClientInputDto;

      const input: CreateClientInputDto = {
        name,
        email,
        phone,
      };

      const output = await this.createClientUseService.execute(input);

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

  private present(input: CreateClientResponseDto): CreateClientResponseDto {
    const response = { id: input.id };
    return response;
  }
}
