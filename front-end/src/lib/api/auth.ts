import { UserType } from "@/lib/schemas/user";
import { get, post } from "@/lib/http/fetcher";
import {
  ChangePasswordType,
  LoginResponseType,
  LoginType,
  MessageResponseType,
  OtpResponseType,
  RegisterType,
  ResetPassType,
  SendOtpType,
  VerifyOtpType,
} from "../schemas/auth";

const domainApi = "/api/v1/auth";

export const AuthApi = {
  signup: (payload: RegisterType) =>
    post<UserType>(`${domainApi}/signup`, payload),

  login: (payload: LoginType) =>
    post<LoginResponseType>(`${domainApi}/login`, payload),

  refreshToken: () => post<LoginResponseType>(`${domainApi}/refresh`),

  logout: () => post<void>(`${domainApi}/logout`),

  sendOtp: (payload: SendOtpType) =>
    post<MessageResponseType>(`${domainApi}/otp/send-otp`, payload),

  verifyOtp: (payload: VerifyOtpType) =>
    post<OtpResponseType>(`${domainApi}/otp/verify`, payload),

  changePassword: (payload: ChangePasswordType) =>
    post<MessageResponseType>(`${domainApi}/user/change-password`, payload),

  resetPass: (payload: ResetPassType) =>
    post<MessageResponseType>(`${domainApi}/user/reset-password`, payload),

  verifyPhone: () => post<MessageResponseType>(`${domainApi}/user/verify`),

  getUserInfo: () => get<UserType>(`${domainApi}/me`),
};
