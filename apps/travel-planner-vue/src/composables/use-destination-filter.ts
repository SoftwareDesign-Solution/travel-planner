import {
  computed,
  type MaybeRefOrGetter,
  ref,
  toValue,
} from 'vue';

import type {
  BaseDestination,
} from '../schemas/base-destination.schema';

export type DestinationSortField =
  | 'title'
  | 'country'
  | 'season';

export type SortDirection =
  | 'ascending'
  | 'descending';

export function useDestinationFilter<
  T extends BaseDestination,
>(
  destinations: MaybeRefOrGetter<
    readonly T[] | undefined
  >,
) {
  /* State */
  const searchTerm = ref('');
  const selectedSeason = ref('');
  const selectedTags = ref<string[]>([]);
  const sortField =
    ref<DestinationSortField>('title');
  const sortDirection =
    ref<SortDirection>('ascending');

  /* Computed Properties */
  const seasons = computed<string[]>(() => {
    const destinationSeasons =
      toValue(destinations)?.map(
        (destination) => destination.season,
      ) ?? [];

    return Array.from(
      new Set(destinationSeasons),
    ).sort((firstSeason, secondSeason) =>
      firstSeason.localeCompare(
        secondSeason,
        'de',
      ),
    );
  });

  const tags = computed<string[]>(() => {
    const destinationTags =
      toValue(destinations)?.flatMap(
        (destination) => destination.tags,
      ) ?? [];

    return Array.from(
      new Set(destinationTags),
    ).sort((firstTag, secondTag) =>
      firstTag.localeCompare(
        secondTag,
        'de',
      ),
    );
  });

    const filteredDestinations = computed<T[]>(() => {
    const normalizedSearchTerm =
      searchTerm.value
        .trim()
        .toLocaleLowerCase('de');

    const filteredEntries =
      toValue(destinations)?.filter((destination) => {
        const matchesSearch =
          normalizedSearchTerm === '' ||
          destination.title
            .toLocaleLowerCase('de')
            .includes(normalizedSearchTerm) ||
          destination.description
            .toLocaleLowerCase('de')
            .includes(normalizedSearchTerm) ||
          destination.country
            .toLocaleLowerCase('de')
            .includes(normalizedSearchTerm);

        return matchesSearch;
      }) ?? [];

    return [...filteredEntries];
  });

  return {
    searchTerm,
    selectedSeason,
    selectedTags,
    sortField,
    sortDirection,

    seasons,
    tags,
    filteredDestinations,
  };
}