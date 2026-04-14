// src/types/svg.d.ts
declare module '*.svg' {
  import type * as React from 'react';
  import type { SvgProps } from 'react-native-svg';

  const content: React.FC<SvgProps>;
  export default content;
}

// global.d.ts
declare namespace JSX {
  interface IntrinsicAttributes {
    [key: string]: any;
  }
}

