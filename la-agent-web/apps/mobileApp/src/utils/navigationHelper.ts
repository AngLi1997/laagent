import { CommonActions, NavigationContainerRef } from '@react-navigation/native';
import { createRef } from 'react';

export const navigationRef = createRef<NavigationContainerRef<any>>();

export function navigate(name: string, params?: object) {
  navigationRef.current?.navigate(name, params as never);
}

// 加一个reset 跳转到 Login 清空堆栈
export function resetToLogin() {
  console.log('resetToLogin', navigationRef.current);
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: 'Login' }], // 确保 'Login' 是你的登录页面的路由名称
    })
  );
}