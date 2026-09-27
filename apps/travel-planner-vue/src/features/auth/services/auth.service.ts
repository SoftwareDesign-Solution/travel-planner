import { apiClient } from "../../../services/api-client";
import { type AuthResponse, authResponseSchema, type LoginData, type RegisterRequestData } from "../schemas/auth.schema";

export async function loginUser(data: LoginData): Promise<AuthResponse> {
    
    const response = await apiClient.post<AuthResponse>('/login', data);

    return authResponseSchema.parse(
        response.data
    );
    
}

export async function registerUser(data: RegisterRequestData): Promise<boolean> {

    await apiClient.post('/register', data);
    return true;
}