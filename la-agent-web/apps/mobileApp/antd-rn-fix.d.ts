// src/types/antd-rn-fix.d.ts

declare module '@ant-design/react-native' {
  import * as React from 'react';
  export const Drawer: React.ComponentType<any>;
  export const Button: React.ComponentType<any>;
  export const Flex: React.ComponentType<any>;
  export const WhiteSpace: React.ComponentType<any>;
  export const WingBlank: React.ComponentType<any>;
  export const SearchBar: React.ComponentType<any>;
  export const Icon: React.ComponentType<any>;
  export const ActionSheet: React.ComponentType<any>;
  export const Modal: React.ComponentType<any>;
  export const InputItem: React.ComponentType<any>;Provider
  export const Card: React.ComponentType<any>;
  export const Provider: React.ComponentType<any>;
  export const Toast: React.ComponentType<any>;
  export const Text: React.ComponentType<any>;

  // 避免 default 导出丢失
  const Antd: {
    Drawer: React.ComponentType<any>;
    Button: React.ComponentType<any>;
    Flex: React.ComponentType<any>;
    WhiteSpace: React.ComponentType<any>;
    WingBlank: React.ComponentType<any>;
    SearchBar: React.ComponentType<any>;
    Icon: React.ComponentType<any>;
    ActionSheet: React.ComponentType<any>;
    Modal: React.ComponentType<any>;
    InputItem: React.ComponentType<any>;
    Card: React.ComponentType<any>;
    Provider: React.ComponentType<any>;
    Toast: React.ComponentType<any>;
    Text: React.ComponentType<any>;
  };

  export default Antd;
}
