import { createRouter, createWebHistory } from 'vue-router';
import Encrypt from '@/pages/Encrypter.vue';
import Decrypt from '@/pages/Decrypter.vue';

const routes = [
    { path: '/', component: Encrypt },
    { path: '/encrypt', component: Encrypt },
    { path: '/decrypt', component: Decrypt },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
