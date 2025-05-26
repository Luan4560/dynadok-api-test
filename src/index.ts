import 'dotenv/config';
import { ApiExpress } from '#infrastructure/api/express/api.express.js';
import { CreateClientRoute } from '#infrastructure/api/express/client/create-client.express.route.js';
import { ListClientRoute } from '#infrastructure/api/express/client/list-client.express.route.js';
import { ClientRepositoryPrisma } from '#infrastructure/repositories/client.repository.prisma.js';
import { CreateClientUsecase } from '#usecases/client/create.client.usecase.js';
import { ListClientUsecase } from '#usecases/client/list.client.usecase.js';
import { PrismaClient } from './generated/prisma/index.js';

const prisma = new PrismaClient();

function main() {
  const repository = ClientRepositoryPrisma.create(prisma);

  const createClientUsecase = CreateClientUsecase.create(repository);
  const listClientUsecase = ListClientUsecase.create(repository);

  const createClient = CreateClientRoute.create(createClientUsecase);
  const listClient = ListClientRoute.create(listClientUsecase);

  const port = 8080;

  const api = ApiExpress.create([createClient, listClient]);

  api.start(port).catch(console.error);
}

main();
