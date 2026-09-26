import { useQuery } from "@pinia/colada";

import { getDestinations } from "../services/destination.service";

export function useDestinationsQuery() {
    return useQuery({
        key: ["destinations"],
        query: getDestinations
    });
};