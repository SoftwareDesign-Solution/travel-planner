import { apiClient } from "../../../services/api-client";
import { Destination } from "../schemas/destination.schema";

export async function getDestinations() {
    const response = await apiClient.get<Destination[]>('/destinations');
    return response.data;
}

export async function getDestinationBySlug(slug: string) {
    const response = await apiClient.get<Destination[]>(`/destinations?slug=${slug}`)
    const destinations = response.data;
    return destinations[0] ?? null;
}