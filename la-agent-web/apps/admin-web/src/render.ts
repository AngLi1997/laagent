import { I18nLanguageEnum } from '@bmos/i18n';
import { zoomListener } from '@bmos/utils';
import AntD from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import WujieVue from 'wujie-vue3';
import App from './App.vue';
import './assets/main.css';
import btnPermission from './directives/btnPermission';
import './plugins/svg-icon';
import router from './router';
import { setLangResource } from './utils/handleLang';
import { buttonPermissions } from './utils/permission';

const app = createApp(App);

zoomListener();

app.use(createPinia());
app.use(router);
app.use(AntD);
app.use(WujieVue);
btnPermission(app);
buttonPermissions().then(() => {
  setLangResource(localStorage.getItem('lang') || I18nLanguageEnum.ZH_CN).finally(() => {
    app.mount('#app');
  });
});
