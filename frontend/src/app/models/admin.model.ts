export interface Admin {
    id?: number;
    adminName: string;
}

export interface AdminLoginRequest {
    adminName: string;
    adminPassword: string;
}

export interface AdminRegisterRequest {
    adminName: string;
    adminPassword: string;
}

export interface AdminLoginResponse {
    token: string;
}

export interface AdminDashboardResponse {
    message: string;
}