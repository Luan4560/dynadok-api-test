/* eslint-disable @typescript-eslint/no-unsafe-call */
import amqp from 'amqplib';
import { Client } from '../../domain/client/entity/client.entity.js';
import { ClientRepositoryPrisma } from '../repositories/client.repository.prisma.js';
import { PrismaClient } from '../../../generated/prisma/index.js';
import { setRedis } from '../cache/redisConfig.js';

const prisma = new PrismaClient();
const clientRepository = ClientRepositoryPrisma.create(prisma);

const receiveClientRegistrations = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost:5672');
    const channel = await connection.createChannel();

    const exchange = 'client_registrations';
    await channel.assertExchange(exchange, 'fanout', { durable: false });

    const queue = await channel.assertQueue('', { exclusive: true });
    console.log(
      ` [*] Waiting for client registrations in queue ${queue.queue}. To exit press CTRL+C`,
    );

    await channel.bindQueue(queue.queue, exchange, '');

    void channel.consume(
      queue.queue,
      msg => {
        void (async () => {
          if (msg) {
            const content = JSON.parse(msg.content.toString()) as {
              type: string;
              data: { id: string; name: string; email: string; phone: string };
              timestamp: string;
            };
            console.log(` [x] Received client registration:`, content);

            try {
              const client = Client.with({
                id: content.data.id,
                name: content.data.name,
                email: content.data.email,
                phone: content.data.phone,
              });

              await clientRepository.save(client);

              await setRedis(`client-${client.id}`, JSON.stringify(client));

              console.log(
                ` [✓] Successfully processed client registration for ${client.name}`,
              );
            } catch (error: unknown) {
              console.error('Error processing client registration:', error);
            }

            channel.ack(msg);
          }
        })();
      },
      { noAck: false },
    );
  } catch (error) {
    console.error('Error in client registration consumer:', error);
    throw error;
  }
};

// Start consuming messages
receiveClientRegistrations().catch(console.error);
