export const RoutePath = {
  // auth routes
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  verifyForgotPassword: "/forgot-password/verify",
  resetPassword: "/reset-password",
  // main route
  home: "/",
  // user account routes
  user: "/account",
  userProfile: "/account/profile",
  userSettings: "/account/settings",
  // service routes
  spaService: "/services/spa",
  // admin routes
  adminDashboard: "/admin",
  adminUsers: "/admin/users",
  adminServices: "/admin/services",
  adminProducts: "/admin/pets",
} as const;
