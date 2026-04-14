export const fileUrlDownload = (url: string) => {
  let a: HTMLAnchorElement = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.click();
  a.remove()
};

/**
 * 批量导出
 * @param {*} data fileDownload返回的buffer数据
 * @param {String} type 文件类型
 */
export const fileStreamDownload = (
  data: ArrayBuffer,
  type: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
) => {
  const reader = new FileReader();
  const blob = new Blob([data], { type });
  reader.readAsDataURL(blob);

  reader.addEventListener(
    'load',
    function (e) {
      let a: HTMLAnchorElement = document.createElement('a');
      a.style.display = 'none';
      a.href = e.target?.result as string;
      a.click();
      a.remove()
    },
    false,
  );
};
