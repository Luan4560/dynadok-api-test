/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Client } from '../../domain/client/entity/client.entity.js';
import { ClientGateway } from '../../domain/client/gateway/client.gateway.js';
import { setRedis } from '../../infrastructure/cache/redisConfig.js';
import { Usecase } from '../usecase.js';

export interface CreateClientInputDto {
  name: string;
  email: string;
  phone: string;
}

export interface CreateClientOutputDto {
  id: string;
}

export class CreateClientUsecase
  implements Usecase<CreateClientInputDto, CreateClientOutputDto>
{
  private constructor(private readonly clientGateway: ClientGateway) {}

  public static create(clientGateway: ClientGateway) {
    return new CreateClientUsecase(clientGateway);
  }

  public async execute({
    name,
    email,
    phone,
  }: CreateClientInputDto): Promise<CreateClientOutputDto> {
    const client = Client.create(name, email, phone);

    await this.clientGateway.save(client);

    await setRedis(`client-${client.id}`, JSON.stringify(client));

    const output = this.presentOutput(client);

    return output;
  }

  private presentOutput(client: Client): CreateClientOutputDto {
    const output: CreateClientOutputDto = {
      id: client.id,
    };

    return output;
  }
}
