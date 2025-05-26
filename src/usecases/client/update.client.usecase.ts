import { Client } from '#domain/client/entity/client.entity.js';
import { ClientGateway } from '#domain/client/gateway/client.gateway.js';
import { Usecase } from '#usecases/usecase.js';

export interface UpdateClientInputDto {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface UpdateClientOutputDto {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export class UpdateClientUsecase
  implements Usecase<UpdateClientOutputDto, UpdateClientInputDto>
{
  private constructor(private readonly clientGateway: ClientGateway) {}

  public static create(clientGateway: ClientGateway) {
    return new UpdateClientUsecase(clientGateway);
  }

  public async execute({
    id,
    name,
    email,
    phone,
  }: UpdateClientInputDto): Promise<UpdateClientOutputDto> {
    const client = Client.with({
      id,
      name,
      email,
      phone,
    });

    await this.clientGateway.update(client);

    const output = this.presentOutput(client);

    return output;
  }

  private presentOutput(client: Client): UpdateClientOutputDto {
    const output: UpdateClientOutputDto = {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
    };

    return output;
  }
}
