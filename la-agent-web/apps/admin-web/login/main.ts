import AntD from 'ant-design-vue';
import { createApp } from 'vue';

import App from './App.vue';
import { setLangResource } from './utils/handleLang';
import '../src/plugins/svg-icon';
import './assets/main.css';

const app = createApp(App);
setLangResource(localStorage.getItem('LANG') || 'zh_CN').then(() => {
  app.use(AntD);
  app.mount('#login-app');
});
