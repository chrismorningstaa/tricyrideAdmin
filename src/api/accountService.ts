import axiosInstance from "./_axiosInstance";
import {
  LoginTypes,
  LoginReponseTypes,
  CreateTypes,
  CreateResponseTypes,
  EmailVerifyTypes,
} from "../types/account";

export async function apiEmailVerify(data: EmailVerifyTypes) {
  return axiosInstance.post<EmailVerifyTypes>(
    "/account/user/email/verify",
    data
  );
}

export async function apiUserLogin(data: LoginTypes) {
  return axiosInstance.post<LoginReponseTypes>("/account/user/login", data);
}

export async function apiCreateUser(data: CreateTypes) {
  return axiosInstance.post<CreateResponseTypes>(
    "/account/user/create",
    data
  );
}
