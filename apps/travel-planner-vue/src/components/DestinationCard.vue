<script setup lang="ts">
/* Imports */
import { BaseDestination } from '../schemas/base-destination.schema';

/* Constants */

/* Interfaces / Types */

/* Props */
const { destination } = defineProps<{ destination: BaseDestination }>();

/* Models */

/* Emits */

/* Slots */

/* Composables */

/* State */

/* Computed Properties */

/* Functions */

/* Watchers */

/* Lifecycle Hooks */

/* Expose */
</script>

<template>
  <article class="flex flex-col overflow-hidden rounded-xl border border-line bg-white hover:shadow-lg">
    <div class="slot relative h-37.5">
      <!-- Image -->
      <img
        v-if="destination.imageUrl"
        :src="destination.imageUrl"
        :alt="`${destination.title}, ${destination.country}`"
        class="absolute inset-0 h-full w-full object-cover"
      >
            
      <span 
        v-else
        class="rounded bg-white/75 px-2 py-1.5 font-mono text-[10.5px] text-teal-ink"
      >
        photo — {{ destination.title }} 16:9
      </span>
      <!-- Saison -->
      <span class="absolute right-3 top-3 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">{{ destination.season }}</span>
    </div>

    <div class="flex flex-1 flex-col gap-2.5 p-4.5">
      <h3 class="font-display text-[22px] leading-tight">
        {{ destination.title }}, {{ destination.country }}
      </h3>
      <p class="text-[13.5px] leading-relaxed text-ink-soft">
        {{ destination.description }}
      </p>

      <!-- Tags -->
      <div class="flex flex-wrap gap-1.5">
        <span
          v-for="tag in destination.tags"
          :key="tag"
          class="tag"
        >
          {{ tag }}
        </span>
      </div>
      <div class="mt-auto flex gap-4 border-t border-line/60 pt-2.5 font-mono text-[12.5px] text-ink-soft">
        <!-- Price -->
        <span>{{ destination.price }}</span>
        <!-- Duration -->
        <span>{{ destination.duration }}</span>
      </div>
            
      <!-- Buttons -->
      <slot name="actions" />
      <!-- END Buttons -->
    </div>
  </article>
</template>