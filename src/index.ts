import 'dotenv/config';
import { ApiExpress } from './infrastructure/api/express/api.express.js';
import { CreateClientRoute } from './infrastructure/api/express/client/create-client.express.route.js';
import { ListClientRoute } from './infrastructure/api/express/client/list-client.express.route.js';
import { ClientRepositoryPrisma } from './infrastructure/repositories/client.repository.prisma.js';
import { CreateClientUsecase } from './usecases/client/create.client.usecase.js';
import { ListClientUsecase } from './usecases/client/list.client.usecase.js';
import { PrismaClient } from '../generated/prisma/index.js';
import { DeleteClientUsecase } from './usecases/client/delete.client.usecase.js';
import { DeleteClientRoute } from './infrastructure/api/express/client/delete-client.express.route.js';
import { UpdateClientUsecase } from './usecases/client/update.client.usecase.js';
import { UpdateClientRoute } from './infrastructure/api/express/client/update-client.express.route.js';
import { ListClientByIdRoute } from './infrastructure/api/express/client/list-client-by-id.express.route.js';
import { ListClientByIdUsecase } from './usecases/client/list.client.id.usecase.js';

const prisma = new PrismaClient();

function main() {
  const repository = ClientRepositoryPrisma.create(prisma);

  const createClientUsecase = CreateClientUsecase.create(repository);
  const listClientUsecase = ListClientUsecase.create(repository);
  const deleteClientUsecase = DeleteClientUsecase.create(repository);
  const updateClientUsecase = UpdateClientUsecase.create(repository);
  const listClientByIdUsecase = ListClientByIdUsecase.create(repository);

  const createClient = CreateClientRoute.create(createClientUsecase);
  const listClient = ListClientRoute.create(listClientUsecase);
  const deleteClient = DeleteClientRoute.create(deleteClientUsecase);
  const updateClient = UpdateClientRoute.create(updateClientUsecase);
  const listClientById = ListClientByIdRoute.create(listClientByIdUsecase);

  const port = 4000;

  const api = ApiExpress.create([
    createClient,
    listClient,
    deleteClient,
    updateClient,
    listClientById,
  ]);

  api.start(port).catch(console.error);
}

main();
