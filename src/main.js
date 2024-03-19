import {createPinia} from "pinia";
import {createApp} from 'vue';
import App from './App.vue';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import './assets/global.css';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.mount('#app');
