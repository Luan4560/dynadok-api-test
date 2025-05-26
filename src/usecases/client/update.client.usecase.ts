/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Client } from '../../domain/client/entity/client.entity.js';
import { ClientGateway } from '../../domain/client/gateway/client.gateway.js';
import { Usecase } from '../usecase.js';
import { setRedis } from '../../infrastructure/cache/redisConfig.js';

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
  implements Usecase<UpdateClientInputDto, UpdateClientOutputDto>
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
    const client = await this.clientGateway.findById(id);

    if (!client) {
      throw new Error('Client not found');
    }

    const clientToUpdate = Client.with({ id, name, email, phone });
    const updatedClient = await this.clientGateway.update(clientToUpdate);

    if (!updatedClient) {
      throw new Error('Failed to update client');
    }

    try {
      await setRedis(`client-${id}`, JSON.stringify(updatedClient));
    } catch (error: unknown) {
      console.error('Failed to update cache:', error);
    }

    const output = this.presentOutput({
      id: updatedClient.id,
      name: updatedClient.name,
      email: updatedClient.email,
      phone: updatedClient.phone,
    });

    return output;
  }

  private presentOutput(client: UpdateClientOutputDto): UpdateClientOutputDto {
    return {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
    };
  }
}
