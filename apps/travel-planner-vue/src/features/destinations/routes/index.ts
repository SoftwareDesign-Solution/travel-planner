import DefaultLayout from "../../../layouts/DefaultLayout.vue";
import DestinationsPage from "../pages/DestinationsPage.vue";

export const routes = [
    {
        path: '/',
        component: DefaultLayout,
        children: [
            { path: '', name: 'destinations', component: DestinationsPage},
            { path: '/destinations/:slug', name: 'destination-details', component: () => import('../pages/DestinationDetailsPage.vue') }
        ]
    }
]