import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { MODULE_CONFIG } from './module.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthHelper } from './auth.helper';

const USER_MS_TRANSPORT = MODULE_CONFIG.USER_MS.transport;

@Module({
  imports: [
    ClientsModule.register([MODULE_CONFIG.USER_MS[USER_MS_TRANSPORT]]),
    JwtModule.register({
      global: true,
      secret:
        '1ca9fe5f5318593628dfccdbfe841554df9c566c9b10fdaced2a128f4ff031e5',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthHelper],
})
export class AuthModule {}
