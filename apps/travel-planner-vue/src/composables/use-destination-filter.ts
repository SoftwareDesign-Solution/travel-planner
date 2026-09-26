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

        const matchesSeason =
          selectedSeason.value === '' ||
          destination.season === selectedSeason.value;

        const matchesTags =
          selectedTags.value.length === 0 ||
          selectedTags.value.some((selectedTag) =>
            destination.tags.includes(selectedTag),
          );

        return (
          matchesSearch &&
          matchesSeason &&
          matchesTags
        );
      }) ?? [];

    return [...filteredEntries];
  });

  /* Functions */
  function selectTag(tag: string): void {
    if (selectedTags.value.includes(tag)) {
      return;
    }

    selectedTags.value = [
      ...selectedTags.value,
      tag,
    ];
  }

  function removeTag(tag: string): void {
    selectedTags.value =
      selectedTags.value.filter(
        (selectedTag) => selectedTag !== tag,
      );
  }

  function toggleTag(tag: string): void {
    if (selectedTags.value.includes(tag)) {
      removeTag(tag);

      return;
    }

    selectTag(tag);
  }

  return {
    searchTerm,
    selectedSeason,
    selectedTags,
    sortField,
    sortDirection,

    seasons,
    tags,
    filteredDestinations,

    selectTag,
    removeTag,
    toggleTag,
  };
}