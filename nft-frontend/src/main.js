import { createApp } from 'vue'
import App from './App.vue'
import './assets/scss/app.scss'
import {init} from "@/utils";
import VueLoading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


await init();


let app = createApp(App);
app.config.globalProperties.window = window;
app.use(VueLoading);
app.use(VueSweetalert2);
app.mount('#app');
