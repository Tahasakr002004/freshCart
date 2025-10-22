export interface User {
    firstName: string;
    lastName: string;
    email: string;
}

export interface UserLoginRequest {
    email: string;
    password: string;
}

export interface UserRegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}


export interface UserLoginResponse {
  token: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}