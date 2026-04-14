// // For this project development
import '@vue/runtime-core';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    BMConfigProvider: (typeof import('@bmos/components'))['BMConfigProvider'];
    BMButton: (typeof import('@bmos/components'))['BMButton'];
    BMEllipsis: (typeof import('@bmos/components'))['BMEllipsis'];
    BMForm: (typeof import('@bmos/components'))['BMForm'];
    BMIcon: (typeof import('@bmos/components'))['BMIcon'];
    BMModalForm: (typeof import('@bmos/components'))['BMModalForm'];
    BMSearchTree: (typeof import('@bmos/components'))['BMSearchTree'];
    BMTable: (typeof import('@bmos/components'))['BMTable'];
    BMTableTitle: (typeof import('@bmos/components'))['BMTableTitle'];
    BMPageComponent: (typeof import('@bmos/components'))['BMPageComponent'];
    BMPageTree: (typeof import('@bmos/components'))['BMPageTree'];
    BMMenuClose: (typeof import('@bmos/components'))['BMMenuClose'];
  }
}
