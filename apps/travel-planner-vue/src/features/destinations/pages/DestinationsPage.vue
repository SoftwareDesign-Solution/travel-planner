<script setup lang="ts">
/* Imports */
import { computed, onMounted, reactive } from 'vue'

import DestinationCard from '../../../components/DestinationCard.vue';
import { getErrorMessage } from '../../../utils/get-error-message.js';
import { useDestinationsQuery } from '../composables/use-destinations-query.js';
import { Destination } from '../schemas/destination.schema';
import { getDestinations } from '../services/destination.service';

/* Constants */

/* Interfaces / Types */

/* Props */

/* Models */

/* Emits */

/* Slots */

/* Composables */
// ADVANCED: Destinations mit useQuery laden
const {
  data: destinations,
  error: destinationsError,
  status: destinationsStatus,
  asyncStatus: destinationsAsyncStatus,
  refetch: refetchDestinations,
} = useDestinationsQuery();

/* State */
// BASIC: Destinations 
//let destinations = reactive<Destination[]>([]);

/* Computed Properties */
const destinationsErrorMessage = computed(() =>
  getErrorMessage(destinationsError.value),
);

const isInitialLoading = computed(
  () =>
    destinationsStatus.value === 'pending' &&
    destinationsAsyncStatus.value === 'loading',
);

/* Functions */

/* Watchers */

/* Lifecycle Hooks */
// BASIC: Destinations im Lifecycle Hook onMounted laden
/*
onMounted(async () => {
  destinations = await getDestinations();
});
*/

/* Expose */
</script>

<template>
  <main class="flex flex-col gap-6 px-8 py-9">
    <div class="flex flex-wrap items-end justify-between gap-8">
      <div class="max-w-xl">
        <h2 class="font-display text-4xl leading-tight">
          Reiseziele entdecken
        </h2>
        <p class="mt-2 text-[15px] leading-relaxed text-ink-soft">
          Stöbern geht ohne Konto. Zum Speichern in der eigenen Wishlist meldest du dich an.
        </p>
      </div>
    </div>

    <div class="flex flex-wrap gap-2">
      <button class="chip">
        culture
      </button><button class="chip">
        history
      </button><button class="chip">
        temples
      </button>
      <button class="chip">
        beach
      </button><button class="chip">
        islands
      </button><button class="chip">
        hiking
      </button>
      <button class="chip">
        mountains
      </button><button class="chip">
        luxury
      </button><button class="chip">
        skiing
      </button>
    </div>

    <!-- Initialer Ladezustand -->
    <section 
      v-if="isInitialLoading"
      aria-live="polite"
      class="rounded-xl border border-teal-line bg-teal-soft p-6"
    >
      <p class="font-semibold text-teal-ink">
        Urlaubsziele werden geladen …
      </p>
    </section>

    <!-- Fehler beim Laden -->
    <section
      v-else-if="destinationsStatus === 'error'"
      role="alert"
      class="rounded-xl border border-error-line bg-error-soft p-6"
    >
      <h2 class="font-semibold text-error-deep">
        Urlaubsziele konnte nicht geladen werden
      </h2>

      <p class="mt-2 text-[13.5px] text-ink-soft">
        {{ destinationsErrorMessage }}
      </p>

      <button
        type="button"
        class="btn-error mt-4"
        @click="refetchDestinations()"
      >
        Erneut versuchen
      </button>
    </section>

    <!-- Ergebnis -->
    <section v-else-if="destinationsStatus === 'success'">
      <p>
        {{ destinations?.length ?? 0 }}
        {{
          destinations?.length === 1
            ? 'Reiseziel gefunden'
            : 'Reiseziele gefunden'
        }}
      </p>

      <div class="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
        <DestinationCard
          v-for="destination in destinations"
          :key="destination.id"
          :destination="destination"
        >
          <template #actions>
            <button class="btn-primary w-full py-3 text-[13px]">
              + Zur Wishlist
            </button>

            <!-- BEGIN Buttons -->
            <div class="flex gap-2 pt-1">
              <button class="flex-1 rounded-lg border border-field bg-paper py-2.5 text-[13px] font-semibold hover:bg-shell">
                Bearbeiten
              </button>
              <button class="rounded-lg border border-field bg-white px-3.5 py-2.5 text-[13px] font-medium text-coral hover:border-coral">
                Löschen
              </button>
            </div>
          </template>
        </DestinationCard>
      </div>
    </section>
  </main>
</template>