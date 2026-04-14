export function vitePlugin() {
  return {
    name: 'vite-plugin',
    transform(code: string, id: string) {
      //code： 编译后的代码 id：遍历后的路径
      return {
        code,
        map: null, // 如果有源映射，也可以返回
      };
    },
  };
}
