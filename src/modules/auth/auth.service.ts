import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
  UnauthorizedException,
} from "@nestjs/common";
import { ClientKafka, ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { MODULE_CONFIG } from "./module.config";
import { USER_MS_PATTERN } from "./pattern";
import { AuthHelper } from "./auth.helper";
import { AdminLoginBody, BuyerLoginBody } from "./types";

@Injectable()
export class AuthService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject("USER_MICROSERVICE")
    private readonly userClient: ClientKafka | ClientProxy | any,
    @Inject(AuthHelper) private readonly authHelper: AuthHelper
  ) {}
  async onModuleInit() {
    if (MODULE_CONFIG.USER_MS.transport === "KAFKA") {
      this.userClient.subscribeToResponseOf("findUserByConditionForLogin");
      this.userClient.subscribeToResponseOf("verifyUserPermission");
      this.userClient.subscribeToResponseOf("findBuyerForLogin");
    }
  }

  async onModuleDestroy() {
    if (MODULE_CONFIG.USER_MS.transport === "KAFKA") {
      this.userClient.close();
    }
  }

  /**
   * @description
   * Function to admin user details for login
   */
  async findAdminUserForLogin(emailId: string) {
    return lastValueFrom(
      this.userClient.send(
        USER_MS_PATTERN[MODULE_CONFIG.USER_MS.transport].findAdminUserForLogin,
        {
          data: {
            email_id: emailId,
          },
        }
      )
    );
  }

  /**
   * @description
   * Function to user details for login
   */
  async findUserByConditionForLogin(payload: any) {
    return lastValueFrom(
      this.userClient.send(
        USER_MS_PATTERN[MODULE_CONFIG.USER_MS.transport]
          .findUserByConditionForLogin,
        {
          email: payload.email,
          OR: [{ user_type: "ADMIN" }, { user_type: "SUBADMIN" }],
        }
      )
    );
  }

  /**
   * @description
   * Function to verify user permission
   */
  async verifyUserPermission(payload: any) {
    return lastValueFrom(
      this.userClient.send(
        USER_MS_PATTERN[MODULE_CONFIG.USER_MS.transport].verifyUserPermission,
        {
          data: {
            auth: payload.auth,
            permission: payload.permission,
          },
        }
      )
    );
  }

  /**
   * @description
   * Function to handel admin login
   */
  async adminLogin(payload: AdminLoginBody) {
    try {
      const user: any = await this.findAdminUserForLogin(payload.email);
      if (!user) {
        throw new NotFoundException("User with this email id does not exist.");
      }
      const isPasswordMatch = this.authHelper.isPasswordValid(
        payload.password,
        user.auth.password
      );
      if (!isPasswordMatch) {
        throw new UnauthorizedException("Invalid credentials");
      }
      if (user.status === "PENDING") {
        throw new ForbiddenException(
          "Your account is pending for activation, Please contact administrator."
        );
      } else if (user.status === "INACTIVE") {
        throw new ForbiddenException(
          "Your account is not activated yet, Please contact administrator."
        );
      } else if (user.status === "SUSPENDED") {
        throw new ForbiddenException(
          "Your account is suspended, Please contact administrator."
        );
      } else if (user.status === "BLOCKED") {
        throw new ForbiddenException(
          "Your account is blocked, Please contact administrator."
        );
      } else {
        const accessToken = await this.authHelper.generateToken({
          id: user?.id,
          email: user?.email,
        });
        return {
          status: true,
          message: "Login successfull.",
          data: {
            accessToken: accessToken,
          },
        };
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to verify access token
   */
  async verifyAccessToken(token: string) {
    try {
      return await this.authHelper.validate(token);
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to verify permission
   */
  async veriryPermission(payload: any) {
    try {
      return await this.verifyUserPermission(payload);
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to find buyer details for login.
   */
  async findBuyerForLogin(emailId: string) {
    return lastValueFrom(
      this.userClient.send(
        USER_MS_PATTERN[MODULE_CONFIG.USER_MS.transport].findBuyerForLogin,
        {
          data: {
            email_id: emailId,
          },
        }
      )
    );
  }

  /**
   * @description
   * Function to handel buyer login
   */
  async buyerLogin(payload: BuyerLoginBody) {
    try {
      const buyer: any = await this.findBuyerForLogin(payload.email);
      if (!buyer) {
        throw new NotFoundException("Buyer with this email id does not exist.");
      }
      const isPasswordMatch = this.authHelper.isPasswordValid(
        payload.password,
        buyer.auth.password
      );
      if (!isPasswordMatch) {
        throw new UnauthorizedException("Invalid credentials");
      }
      if (buyer.status === "PENDING") {
        throw new ForbiddenException(
          "Your account is pending for activation, Please contact administrator."
        );
      } else if (buyer.status === "INACTIVE") {
        throw new ForbiddenException(
          "Your account is not activated yet, Please contact administrator."
        );
      } else if (buyer.status === "SUSPENDED") {
        throw new ForbiddenException(
          "Your account is suspended, Please contact administrator."
        );
      } else if (buyer.status === "BLOCKED") {
        throw new ForbiddenException(
          "Your account is blocked, Please contact administrator."
        );
      } else {
        const accessToken = await this.authHelper.generateToken({
          id: buyer?.id,
          email: buyer?.email,
        });
        return {
          status: true,
          message: "Login successfull.",
          data: {
            accessToken: accessToken,
          },
        };
      }
    } catch (error) {
      throw error;
    }
  }
}
