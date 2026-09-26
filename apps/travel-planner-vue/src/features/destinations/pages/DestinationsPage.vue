<script setup lang="ts">
/* Imports */
import { onMounted, reactive } from 'vue'

import DestinationCard from '../../../components/DestinationCard.vue';
import { Destination } from '../schemas/destination.schema';
import { getDestinations } from '../services/destination.service';

/* Constants */

/* Interfaces / Types */

/* Props */

/* Models */

/* Emits */

/* Slots */

/* Composables */

/* State */
// BASIC: Destinations 
let destinations = reactive<Destination[]>([]);

/* Computed Properties */

/* Functions */

/* Watchers */

/* Lifecycle Hooks */
// BASIC: Destinations im Lifecycle Hook onMounted laden
onMounted(async () => {
  destinations = await getDestinations();
});

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
  </main>
</template>