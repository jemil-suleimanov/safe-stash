import './styles/index.css';

import App from '@app/App.vue';
import { i18n } from '@app/shared/plugins/i18n';
import naive from 'naive-ui';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import { router } from './router';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(i18n);
app.use(naive);

app.mount('#app');
