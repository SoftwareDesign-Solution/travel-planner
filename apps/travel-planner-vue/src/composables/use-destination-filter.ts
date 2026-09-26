import {
  ref,
} from 'vue';

export type DestinationSortField =
  | 'title'
  | 'country'
  | 'season';

export type SortDirection =
  | 'ascending'
  | 'descending';

export function useDestinationFilter() {
  /* State */
  const searchTerm = ref('');
  const selectedSeason = ref('');
  const selectedTags = ref<string[]>([]);
  const sortField =
    ref<DestinationSortField>('title');
  const sortDirection =
    ref<SortDirection>('ascending');

  return {
    searchTerm,
    selectedSeason,
    selectedTags,
    sortField,
    sortDirection,
  };
}