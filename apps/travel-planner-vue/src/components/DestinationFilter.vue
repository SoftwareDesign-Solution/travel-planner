<script setup lang="ts">
/* Imports */
import { computed } from 'vue';

import { DestinationSortField, SortDirection } from '../composables/use-destination-filter';

/* Constants */

/* Interfaces / Types */

/* Props */
const props = defineProps<{
  seasons: string[];
  tags: string[];
}>();

/* Models */
const searchTerm = defineModel<string>(
  'searchTerm',
  {
    required: true,
  },
);

const selectedSeason = defineModel<string>(
  'selectedSeason',
  {
    required: true,
  },
);

const selectedTags = defineModel<string[]>(
  'selectedTags',
  {
    required: true,
  },
);

const sortField =
  defineModel<DestinationSortField>(
    'sortField',
    {
      required: true,
    },
  );

const sortDirection =
  defineModel<SortDirection>(
    'sortDirection',
    {
      required: true,
    },
  );

/* Emits */

/* Slots */

/* Composables */

/* State */

/* Computed Properties */
const availableTags = computed(() => {
  return props.tags.filter(
    (tag) => !selectedTags.value.includes(tag),
  );
});

const hasActiveFilters = computed(() => {
  return (
    searchTerm.value.trim() !== '' ||
    selectedSeason.value !== '' ||
    selectedTags.value.length > 0
  );
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

function toggleSortDirection(): void {
  sortDirection.value =
    sortDirection.value === 'ascending'
      ? 'descending'
      : 'ascending';
}

function resetFilters(): void {
  searchTerm.value = '';
  selectedSeason.value = '';
  selectedTags.value = [];
}

/* Watchers */

/* Lifecycle Hooks */

/* Expose */
</script>

<template>
  <div
    class="flex flex-col gap-4 rounded-xl border border-line bg-white px-6 py-5"
  >
    <div
      class="grid items-end gap-4 md:grid-cols-[1.6fr_1fr_1fr_auto]"
    >
      <label class="flex flex-col gap-1.5">
        <span class="label-cap">
          Suche
        </span>

        <input
          v-model="searchTerm"
          type="search"
          class="field text-sm"
          placeholder="Name oder Beschreibung"
        >
      </label>

      <label class="flex flex-col gap-1.5">
        <span class="label-cap">
          Saison
        </span>

        <select
          v-model="selectedSeason"
          class="field text-sm"
        >
          <option value="">
            Alle Saisons
          </option>

          <option
            v-for="season in seasons"
            :key="season"
            :value="season"
          >
            {{ season }}
          </option>
        </select>
      </label>

      <label class="flex flex-col gap-1.5">
        <span class="label-cap">
          Sortierung
        </span>

        <select
          v-model="sortField"
          class="field text-sm"
        >
          <option value="title">
            Name
          </option>

          <option value="country">
            Land
          </option>

          <option value="season">
            Saison
          </option>
        </select>
      </label>

      <button
        type="button"
        class="rounded-lg border border-field bg-white px-4 py-3 font-mono text-sm"
        :aria-label="
          sortDirection === 'ascending'
            ? 'Absteigend sortieren'
            : 'Aufsteigend sortieren'
        "
        @click="toggleSortDirection"
      >
        {{
          sortDirection === 'ascending'
            ? 'A↓'
            : 'A↑'
        }}
      </button>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <span class="label-cap mr-1">
        Typen
      </span>

      <button
        v-for="tag in availableTags"
        :key="tag"
        type="button"
        class="chip"
        :aria-pressed="false"
        @click="selectTag(tag)"
      >
        {{ tag }}
      </button>

      <button
        v-for="tag in selectedTags"
        :key="tag"
        type="button"
        class="rounded-full bg-coral px-3 py-1.5 text-[13px] font-medium text-white"
        :aria-label="`${tag} entfernen`"
        :aria-pressed="true"
        @click="removeTag(tag)"
      >
        {{ tag }} ✕
      </button>

      <button
        v-if="hasActiveFilters"
        type="button"
        class="ml-auto text-[13px] font-medium text-ink-soft underline hover:text-ink"
        @click="resetFilters"
      >
        Filter zurücksetzen
      </button>
    </div>
  </div>
</template>