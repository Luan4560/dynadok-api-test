import {
  DeleteClientInputDto,
  DeleteClientUsecase,
} from '../../../../usecases/client/delete.client.usecase.js';
import { HttpMethod, Route } from '../routes/route.js';
import { Request, Response } from 'express';

export interface DeleteClientResponseDto {
  id: string;
}

export class DeleteClientRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly deleteClientUseService: DeleteClientUsecase,
  ) {}

  public static create(deleteClientUseService: DeleteClientUsecase): DeleteClientRoute {
    return new DeleteClientRoute(
      '/clients/:clientId',
      HttpMethod.DELETE,
      deleteClientUseService,
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { clientId } = request.params as { clientId: string };

      const input: DeleteClientInputDto = {
        id: clientId,
      };

      const output = await this.deleteClientUseService.execute(input);

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

  private present(input: DeleteClientResponseDto): DeleteClientResponseDto {
    const response = { id: input.id };
    return response;
  }
}
