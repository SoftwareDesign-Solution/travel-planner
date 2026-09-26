import { apiClient } from "../../../services/api-client";
import { Destination } from "../schemas/destination.schema";

export async function getDestinations() {
    const response = await apiClient.get<Destination[]>('/destinations');
    return response.data;
}