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
    email: string;
    password: string;
}