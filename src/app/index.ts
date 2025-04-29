import App from '@app/App.vue';
import naive from 'naive-ui';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(naive);

app.mount('#app');
