import { USER_MICROSERVICE_TCP_REGISTRY } from 'src/constant/tcp.registry';
import { AUTH_MS_TO_USER_MICROSERVICE_KAFKA_REGISTRY } from 'src/constant/kafka.registry';

export const MODULE_CONFIG = {
  USER_MS: {
    transport: process.env.USER_MICROSERVICE_TRANSPORT,
    TCP: USER_MICROSERVICE_TCP_REGISTRY,
    KAFKA: AUTH_MS_TO_USER_MICROSERVICE_KAFKA_REGISTRY,
    REDIS: {},
    RABBITMQ: {},
  },
};
