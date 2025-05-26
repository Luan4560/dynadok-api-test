import { Client } from '../entity/client.entity.js';

export interface ClientGateway {
  save(client: Client): Promise<void>;

  list(): Promise<Client[]>;

  findById(id: string): Promise<Client | null>;

  update(client: Client): Promise<Client | null>;

  delete(id: string): Promise<void>;
}
