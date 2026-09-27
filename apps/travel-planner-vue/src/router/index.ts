import { createRouter, createWebHistory } from 'vue-router';

import { destinationsRoutes } from '../features/destinations';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...destinationsRoutes
  ],
});

export default router;
