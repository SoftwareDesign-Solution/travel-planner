<script setup lang="ts">
/* Imports */

/* Constants */

/* Interfaces / Types */

/* Props */

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