export type LoginTypes = {
  email?: string | null;
  password?: string | null;
};

export type LoginReponseTypes = {
  token: string;
  user: {
    id: number | null;
    firstName: string | null;
    lastName: string | null;
    middleName: string | null;
    age: number | null;
    roleId: number | null;
    genderId: number | null;
    emailAddress: string | null;
    phoneNumber: string | null;
    isVerifiedNumber: false;
    isVerifiedEmail: true;
    driverId: number | null;
    createdDate: string | null;
  };
};

export type EmailVerifyTypes = {
  email?: string | null;
};

export type CreateTypes = {
  firstName: string | null;
  lastName: string | null;
  middleName: string | null;
  age: number | null;
  genderId: number | null;
  emailAddress: string | null;
  phoneNumber: string | null;
  otp: string | null;
  password: string | null;
};

export type CreateResponseTypes = {
    password: number | null;
    id: number | null;
    firstName: string | null;
    lastName: string | null;
    middleName: string | null;
    age: number | null;
    roleId: number | null;
    genderId: number | null;
    emailAddress: string | null;
    phoneNumber: string | null;
    isVerifiedNumber: false;
    isVerifiedEmail: true;
    driverId: number | null;
    createdDate: string | null;
};
