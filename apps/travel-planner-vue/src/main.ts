import './styles.css';
import { PiniaColada } from '@pinia/colada';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './app/App.vue';
import router from './router';

const app = createApp(App);

// Pinia
app.use(createPinia())
app.use(PiniaColada, {
    queryOptions: {
        staleTime: 30_000, // 30 seconds
    }
});

// Router
app.use(router);
app.mount('#root');
