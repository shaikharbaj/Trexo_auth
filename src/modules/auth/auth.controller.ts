import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Controller,
  ForbiddenException,
  GatewayTimeoutException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { MS_CONFIG } from 'ms.config';
import { AUTH_PATTERN } from './pattern';
import { Data } from 'src/common/decorators';
import { AdminLoginDto, BuyerLoginDto } from './dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * @description
   * Message format exception
   */
  exceptionHandler(error: any) {
    if (error instanceof BadRequestException) {
      return new RpcException({
        statusCode: 400,
        message: error.message,
      });
    } else if (error instanceof UnauthorizedException) {
      return new RpcException({
        statusCode: 401,
        message: error.message,
      });
    } else if (error instanceof ForbiddenException) {
      return new RpcException({
        statusCode: 403,
        message: error.message,
      });
    } else if (error instanceof NotFoundException) {
      return new RpcException({
        statusCode: 404,
        message: error.message,
      });
    } else if (error instanceof ConflictException) {
      return new RpcException({
        statusCode: 409,
        message: error.message,
      });
    } else if (error instanceof BadGatewayException) {
      return new RpcException({
        statusCode: 502,
        message: error.message,
      });
    } else if (error instanceof ServiceUnavailableException) {
      return new RpcException({
        statusCode: 503,
        message: error.message,
      });
    } else if (error instanceof GatewayTimeoutException) {
      return new RpcException({
        statusCode: 504,
        message: error.message,
      });
    } else {
      return new RpcException({
        statusCode: 500,
        message: 'Internal server error',
      });
    }
  }

  /**
   * @description
   * Message pattern handler to authenticate admin user
   */
  @MessagePattern(AUTH_PATTERN[MS_CONFIG.transport].adminLogin)
  async adminLogin(@Data() data: AdminLoginDto) {
    try {
      return await this.authService.adminLogin(data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to verify access token
   */
  @MessagePattern(AUTH_PATTERN[MS_CONFIG.transport].veriryAccessToken)
  async veriryAccessToken(@Data() data: any) {
    try {
      return await this.authService.verifyAccessToken(data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to verify permission
   */
  @MessagePattern(AUTH_PATTERN[MS_CONFIG.transport].veriryPermission)
  veriryPermission(@Data() data: any) {
    try {
      return this.authService.veriryPermission(data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

    /**
   * @description
   * Message pattern handler to authenticate admin user
   */
    @MessagePattern(AUTH_PATTERN[MS_CONFIG.transport].buyerLogin)
    async buyerLogin(@Data() data: BuyerLoginDto) {
      try {
        return await this.authService.buyerLogin(data);
      } catch (error) {
        throw this.exceptionHandler(error);
      }
    }
}
