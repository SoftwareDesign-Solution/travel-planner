<script setup lang="ts">
/* Imports */
//import { useAuthStore } from '..-/stores/auth/auth.store';
import { useAuthStore } from "../features/auth/store/auth.store";

/* Constants */

/* Interfaces / Types */

/* Props */

/* Models */

/* Emits */

/* Slots */

/* Composables */
const authStore = useAuthStore();

/* State */

/* Computed Properties */

/* Functions */

/* Watchers */

/* Lifecycle Hooks */

/* Expose */
</script>

<template>
  <!-- BEGIN shared/components/Header.vue -->
  <div class="flex items-center justify-between border-b border-line bg-white px-8 py-5">
    <div class="flex items-baseline gap-6">
      <div class="font-display text-2xl">
        Travel<span class="italic text-coral">Planner</span>
      </div>
      <nav class="flex gap-5 text-sm font-medium text-ink-soft">
        <a
          href="#"
          class="border-b-2 border-coral pb-1 text-ink"
        >Ziele entdecken</a>
        <span class="flex items-center gap-1.5">
          <RouterLink to="/wishlist">Meine Wishlist</RouterLink>
          <span class="rounded bg-shell px-1.5 py-0.5 font-mono text-[10px] text-ink-mute">Login nötig</span></span>
      </nav>
    </div>
    <div 
      v-if="authStore.isAuthenticated"
      class="flex items-center gap-2.5"
    >
      <button class="rounded-lg border border-teal-line bg-teal-soft px-3.5 py-2.5 text-[13px] font-medium text-teal-ink">
        KI-Vorschläge
      </button>
      <button class="btn-primary">
        + Ziel hinzufügen
      </button>
      <span class="grid size-9 place-items-center rounded-full bg-teal-soft text-xs font-semibold text-teal-ink">{{ authStore.user ? `${authStore.user.firstname.substring(0, 1)}${authStore.user.lastname.substring(0, 1)}` : '' }}</span>
    </div>
    <div 
      v-else
      class="flex items-center gap-2.5"
    >
      <RouterLink
        class="btn-ghost"
        to="/login"
      >
        Anmelden
      </RouterLink>
      <RouterLink
        class="btn-primary"
        to="/register"
      >
        Registrieren
      </RouterLink>
    </div>
  </div>
  <!-- END shared/components/Header.vue -->
</template>