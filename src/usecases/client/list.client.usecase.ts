import { Client } from '#domain/client/entity/client.entity.js';
import { ClientGateway } from '#domain/client/gateway/client.gateway.js';
import { Usecase } from '#usecases/usecase.js';

export interface ListClientOutputDto {
  clients: {
    id: string;
    name: string;
    email: string;
    phone: string;
  }[];
}

export class ListClientUsecase implements Usecase<void, ListClientOutputDto> {
  private constructor(private readonly clientGateway: ClientGateway) {}

  public static create(clientGateway: ClientGateway) {
    return new ListClientUsecase(clientGateway);
  }

  public async execute(): Promise<ListClientOutputDto> {
    const clients = await this.clientGateway.list();

    const output = this.presentOutput(clients);

    return output;
  }

  private presentOutput(clients: Client[]): ListClientOutputDto {
    return {
      clients: clients.map(client => {
        return {
          id: client.id,
          name: client.name,
          email: client.email,
          phone: client.phone,
        };
      }),
    };
  }
}
