import { Client } from '../../domain/client/entity/client.entity.js';
import { ClientGateway } from '../../domain/client/gateway/client.gateway.js';
import { PrismaClient } from '../../../generated/prisma/index.js';

export class ClientRepositoryPrisma implements ClientGateway {
  private constructor(private readonly prismaClient: PrismaClient) {}

  public static create(prismaClient: PrismaClient) {
    return new ClientRepositoryPrisma(prismaClient);
  }

  public async save(client: Client): Promise<void> {
    const data = {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
    };

    await this.prismaClient.client.create({ data });
  }

  public async list(): Promise<Client[]> {
    const clients = await this.prismaClient.client.findMany();

    const clientList = clients.map(client => {
      const clients = Client.with({
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
      });

      return clients;
    });

    return clientList;
  }

  public async findById(id: string): Promise<Client | null> {
    const client = await this.prismaClient.client.findUnique({
      where: {
        id,
      },
    });

    if (!client) {
      throw new Error('Client not found');
    }

    const clientFound = Client.with({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
    });

    return clientFound;
  }

  public async update(client: Client): Promise<Client | null> {
    await this.prismaClient.client.update({
      where: {
        id: client.id,
      },
      data: {
        name: client.name,
        email: client.email,
        phone: client.phone,
      },
    });

    const clientUpdated = Client.with({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
    });

    return clientUpdated;
  }

  public async delete(id: string): Promise<void> {
    await this.prismaClient.client.delete({
      where: {
        id,
      },
    });
  }
}
