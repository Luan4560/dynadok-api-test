import { ListClientByIdUsecase } from '../../../../usecases/client/list.client.id.usecase.js';
import { ListClientByIdOutputDto } from '../../../../usecases/client/list.client.id.usecase.js';
import { Route, HttpMethod } from '../routes/route.js';
import { Request, Response } from 'express';

export class ListClientByIdRoute implements Route {
  private constructor(
    private readonly path: string,
    private readonly method: HttpMethod,
    private readonly listClientByIdUseService: ListClientByIdUsecase,
  ) {}

  public static create(listClientByIdUseService: ListClientByIdUsecase) {
    return new ListClientByIdRoute(
      '/clients/:clientId',
      HttpMethod.GET,
      listClientByIdUseService,
    );
  }

  public getHandler() {
    return async (request: Request, response: Response) => {
      const { clientId } = request.params as { clientId: string };

      const output = await this.listClientByIdUseService.execute({ id: clientId });

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

  private present(input: ListClientByIdOutputDto): ListClientByIdOutputDto {
    return {
      id: input.id,
      name: input.name,
      email: input.email,
      phone: input.phone,
    };
  }
}
