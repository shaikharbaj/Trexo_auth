import { Transport } from '@nestjs/microservices';

const myTransport: Transport = Transport.TCP;

export const SELF_REGISTRY_TCP = {
  transport: myTransport,
  options: {
    host: '0.0.0.0',
    port: parseInt(process.env.AUTH_MICROSERVICE_PORT),
  },
};

export const USER_MICROSERVICE_TCP_REGISTRY = {
  name: 'USER_MICROSERVICE',
  options: {
    host: '0.0.0.0',
    port: parseInt(process.env.USER_MICROSERVICE_PORT),
  },
};
