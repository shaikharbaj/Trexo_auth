import { Transport } from '@nestjs/microservices';

//Setting up transport
const myTransport: Transport = Transport.KAFKA;

export const SELF_REGISTRY_KAFKA = {
  transport: myTransport,
  options: {
    client: {
      clientId: 'auth',
      brokers: [process.env.AUTH_MICROSERVICE_BROKER],
    },
    consumer: {
      groupId: 'auth-consumer-main'
    },
  },
};

export const AUTH_MS_TO_USER_MICROSERVICE_KAFKA_REGISTRY = {
  name: 'USER_MICROSERVICE',
  transport: myTransport,
  options: {
    client: {
      clientId: 'auth-ms-to-user-ms',
      brokers: [process.env.USER_MICROSERVICE_BROKER],
    },
    consumer: {
      groupId: 'auth-ms-to-user-ms-consumer'
    },
  },
};

