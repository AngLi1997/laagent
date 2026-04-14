import { App } from 'vue';
import * as components from './components';

// 按需导出
export * from './all';

// vue 插件
// - install：每个插件都有一个 install 方法
// - 参数：是通过 Vue.createApp() 创建的 app 实例
const install: any = (app: App) => {
  Object.keys(components).forEach(key => {
    // @ts-ignore
    const component = components[key];
    app.component(component.name, component);
  });
  return app;
};

// 默认导出
export default {
  install,
};
