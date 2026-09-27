import DefaultLayout from "../../../layouts/DefaultLayout.vue";
import DestinationsPage from "../pages/DestinationsPage.vue";

export const routes = [
    {
        path: '/',
        component: DefaultLayout,
        children: [
            { path: '', name: 'destinations', component: DestinationsPage},
        ]
    }
]