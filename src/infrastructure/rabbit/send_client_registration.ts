import amqp from 'amqplib';

const sendClientRegistration = async (clientData: {
  id: string;
  name: string;
  email: string;
}) => {
  try {
    const connection = await amqp.connect('amqp://localhost:5672');
    const channel = await connection.createChannel();

    const exchange = 'client_registrations';
    await channel.assertExchange(exchange, 'fanout', { durable: false });

    const message = JSON.stringify({
      type: 'CLIENT_REGISTERED',
      data: clientData,
      timestamp: new Date().toISOString(),
    });

    channel.publish(exchange, '', Buffer.from(message));
    console.log(` [x] Sent client registration: ${message}`);

    setTimeout(() => {
      void connection.close();
    }, 500);
  } catch (error) {
    console.error('Error sending client registration:', error);
    throw error;
  }
};

export { sendClientRegistration };
