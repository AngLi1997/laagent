import { usePermissionStore } from '@/stores/permission';
import { App, DirectiveBinding } from 'vue';

export default function btnPermission(app: App<Element>) {
  app.directive('hasAuth', {
    mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
      const { hasPermission } = usePermissionStore();
      // 按钮所需权限码
      const btnCode = binding.value;
      const hasAuth = hasPermission(btnCode);
      // 无权限
      if (!hasAuth) {
        el?.parentNode?.removeChild(el);
      }
    },
  });
}
