/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { ClientGateway } from '#domain/client/gateway/client.gateway.js';
import { getRedis } from '#infrastructure/cache/redisConfig.js';

import { Usecase } from '#usecases/usecase.js';
import { Client } from 'generated/prisma/index.js';

export interface ListClientByIdInputDto {
  id: string;
}

export interface ListClientByIdOutputDto {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export class ListClientByIdUsecase
  implements Usecase<ListClientByIdInputDto, ListClientByIdOutputDto>
{
  private constructor(private readonly clientGateway: ClientGateway) {}

  public static create(clientGateway: ClientGateway) {
    return new ListClientByIdUsecase(clientGateway);
  }

  public async execute({ id }: ListClientByIdInputDto): Promise<ListClientByIdOutputDto> {
    const clientRedis = await getRedis(`client-${id}`);
    const clientRedisParsed = clientRedis
      ? (JSON.parse(clientRedis as string) as ListClientByIdOutputDto)
      : null;

    const client = await this.clientGateway.findById(id);
    if (!client) {
      throw new Error('Client not found');
    }

    const output = this.presentOutput(clientRedisParsed ?? client);

    return output;
  }

  private presentOutput(client: Client): ListClientByIdOutputDto {
    return {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
    };
  }
}
