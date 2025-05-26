import { ClientGateway } from '#domain/client/gateway/client.gateway.js';
import { Usecase } from '#usecases/usecase.js';
import { deleteRedis } from '#infrastructure/cache/redisConfig.js';

export interface DeleteClientInputDto {
  id: string;
}

export interface DeleteClientOutputDto {
  id: string;
}

export class DeleteClientUsecase
  implements Usecase<DeleteClientInputDto, DeleteClientOutputDto>
{
  private constructor(private readonly clientGateway: ClientGateway) {}

  public static create(clientGateway: ClientGateway) {
    return new DeleteClientUsecase(clientGateway);
  }

  public async execute({ id }: DeleteClientInputDto): Promise<DeleteClientOutputDto> {
    await this.clientGateway.delete(id);
    await deleteRedis(`client-${id}`);

    const output = this.presentOutput(id);

    return output;
  }

  private presentOutput(id: string): DeleteClientOutputDto {
    const output: DeleteClientOutputDto = {
      id,
    };

    return output;
  }
}
