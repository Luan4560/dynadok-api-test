/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { ClientGateway } from '#domain/client/gateway/client.gateway.js';
import { getRedis, setRedis } from '#infrastructure/cache/redisConfig.js';

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
    try {
      const clientRedis = await getRedis(`client-${id}`);
      const clientRedisParsed = clientRedis
        ? (JSON.parse(clientRedis as string) as ListClientByIdOutputDto)
        : null;

      if (clientRedisParsed) {
        return clientRedisParsed;
      }

      const client = await this.clientGateway.findById(id);

      if (!client) {
        throw new Error('Client not found');
      }

      const output = this.presentOutput(client);

      await setRedis(`client-${id}`, JSON.stringify(output));

      return output;
    } catch {
      const client = await this.clientGateway.findById(id);

      if (!client) {
        throw new Error('Client not found');
      }

      return this.presentOutput(client);
    }
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
