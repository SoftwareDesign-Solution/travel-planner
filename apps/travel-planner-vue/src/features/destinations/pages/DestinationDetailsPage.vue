<script setup lang="ts">
/* Imports */
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

import { Destination } from '../schemas/destination.schema';
import { getDestinationBySlug } from '../services/destination.service';
import { MONTH_LABELS, MONTH_NAMES, ratingBarStyle } from '../utils/monthly-rating';

/* Constants */

/* Interfaces / Types */

/* Props */

/* Models */

/* Emits */

/* Slots */

/* Composables */
const route = useRoute();

/* State */
let destination = ref<Destination|null>();

/* Computed Properties */
const slug = computed(() => String(route.params.slug));

/* Functions */

/* Watchers */

/* Lifecycle Hooks */
onMounted(async () => {
  destination.value = await getDestinationBySlug(slug.value);
});

/* Expose */
</script>

<template>
  <main>
    <div class="slot relative h-90">
      <img
        :src="destination?.imageUrl"
        :alt="`${destination?.title}`"
        class="absolute inset-0 h-full w-full object-cover"
      >
    </div>
    <div class="grid gap-10 bg-shell px-8 py-9 md:grid-cols-[1fr_360px]">
      <div class="flex flex-col gap-7">
        <div>
          <div class="mb-2.5 flex items-center gap-2.5">
            <span class="rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">{{ destination?.season }}</span>
            <span 
              v-for="tag in destination?.tags"
              :key="tag"
              class="tag"
            >{{ tag }}</span>
          </div>
          <h2 class="font-display text-[46px] leading-tight">
            {{ destination?.title }}, {{ destination?.country }}
          </h2>
          <p class="mt-3 max-w-160 text-[16px] leading-relaxed text-ink-soft">
            {{ destination?.description }}
          </p>
        </div>

        <div class="grid grid-cols-4 gap-px overflow-hidden rounded-xl border border-line bg-line">
          <div class="bg-white p-4">
            <div class="label-cap">
              Beste Saison
            </div><div class="mt-1 font-display text-[22px]">
              {{ destination?.season }}
            </div>
          </div>
          <div class="bg-white p-4">
            <div class="label-cap">
              Dauer
            </div><div class="mt-1 font-display text-[22px]">
              {{ destination?.duration }}
            </div>
          </div>
          <div class="bg-white p-4">
            <div class="label-cap">
              Flugzeit
            </div><div class="mt-1 font-display text-[22px]">
              {{ destination?.details.flightTime }}
            </div>
          </div>
          <div class="bg-white p-4">
            <div class="label-cap">
              Sprache
            </div><div class="mt-1 font-display text-[22px]">
              {{ destination?.details.language }}
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <h3 class="font-display text-2xl">
            Beste Reisezeit
          </h3>
          <div class="grid grid-cols-12 gap-1">
            <div
              v-for="(rating, i) in destination?.details.monthlyRatings"
              :key="i"
              class="flex flex-col items-center gap-1.5"
            >
              <div class="flex h-16 w-full items-end">
                <div
                  class="w-full rounded"
                  :style="ratingBarStyle(rating)"
                  :title="`${MONTH_NAMES[i]}: ${rating}/5`"
                  role="img"
                  :aria-label="`${MONTH_NAMES[i]}: ${rating} von 5`"
                />
              </div>
              <span class="font-mono text-[11px] text-ink-mute">{{ MONTH_LABELS[i] }}</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <h3 class="font-display text-2xl">
            Höhepunkte
          </h3>
          <div class="grid grid-cols-3 gap-3.5">
            <!-- DestinationHighlightCard -->
            <div
              v-for="highlight in destination?.details.highlights"
              :key="highlight.title" 
              class="overflow-hidden rounded-xl border border-line bg-white"
            >
              <img
                :src="highlight.imageUrl"
                :alt="`${highlight.title}`"
              >
              <div class="p-4">
                <div class="text-sm font-semibold">
                  {{ highlight.title }}
                </div><div class="mt-1 text-[13px] leading-relaxed text-ink-soft">
                  {{ highlight.description }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="flex flex-col gap-3.5 self-start"
        style="position:sticky;top:24px"
      >
        <div class="flex flex-col gap-4 rounded-xl border border-line bg-white p-5.5">
          <div>
            <div class="label-cap">
              Richtwert pro Person
            </div>
            <div class="mt-1 font-display text-[34px] leading-none">
              {{ destination?.price }}
            </div>
            <div class="mt-0.5 text-[13px] text-ink-mute">
              {{ destination?.details.priceDescription }}
            </div>
          </div>
          <div class="h-px bg-line" />
          <div
            v-for="cost in destination?.details.costs"
            :key="cost.label" 
            class="flex justify-between text-[13.5px] text-ink-soft"
          >
            <span>{{ cost.label }}</span><span class="font-mono font-medium text-ink">{{ cost.value }}</span>
          </div>
          <button class="btn-primary mt-1 py-3.5 text-[15px]">
            + Zur Wishlist
          </button>
          <p class="text-center text-[12.5px] leading-relaxed text-ink-mute">
            Nicht angemeldet — der Klick führt zu <a
              href="#login"
              class="text-coral"
            >/login</a> und speichert danach automatisch.
          </p>
        </div>
        <div class="overflow-hidden rounded-xl border border-line bg-white">
          <div class="slot h-45 text-[10.5px]">
            map — {{ destination?.title }}
          </div>
          <div class="px-4 py-3.5 font-mono text-[12.5px] text-ink-soft">
            {{ destination?.details.coordinates.latitude }}° N, {{ destination?.details.coordinates.longitude }}° E
          </div>
        </div>
      </div>
    </div>
  </main>
</template>