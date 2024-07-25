export const AUTH_PATTERN = {
  TCP: {
    veriryAccessToken: {
      role: "veriryAccessToken",
      cmd: "verify-access-token",
    },
    veriryPermission: {
      role: "veriryPermission",
      cmd: "verify-permission",
    },
    adminLogin: { role: "adminLogin", cmd: "admin-login" },
    buyerLogin: { role: "buyerLogin", cmd: "buyer_login" },
  },
  KAFKA: {
    veriryAccessToken: "veriryAccessToken",
    veriryPermission: "veriryPermission",
    adminLogin: "adminLogin",
    buyerLogin: "buyerLogin",
  },
  REDIS: {},
  RABBITMQ: {},
};

export const USER_MS_PATTERN = {
  TCP: {
    findAdminUserForLogin: {
      role: "findAdminUserForLogin",
      cmd: "find-admin-user-for-login",
    },
    findBuyerForLogin: {
      role: "findBuyerForLogin",
      cmd: "find-buyer-for-login",
    },
    findUserByConditionForLogin: {
      role: "findUserByConditionForLogin",
      cmd: "find-user-by-condition-for-login",
    },
    verifyUserPermission: {
      role: "verifyUserPermission",
      cmd: "verify-user-permission",
    },
  },
  KAFKA: {
    findAdminUserForLogin: "findAdminUserForLogin",
    findUserByConditionForLogin: "findUserByConditionForLogin",
    verifyUserPermission: "verifyUserPermission",
    findBuyerForLogin: "findBuyerForLogin",
  },
  REDIS: {},
  RABBITMQ: {},
};
