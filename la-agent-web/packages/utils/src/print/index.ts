
export const printPDF = (file: File) => {
  // 文件流打印
  const blob = new Blob([file], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);

  let iframe = document.createElement('iframe');
  let doc: any = null;
  iframe.setAttribute('id', 'print-iframe');
  iframe.setAttribute('src', url);
  document.body.appendChild(iframe);
  doc = iframe.contentWindow?.document;
  iframe.onload = () => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
  }
  doc = iframe.contentWindow?.document;
  doc.close();
  // 销毁iframe
  document.body.removeChild(iframe);
  iframe = null;
  window.URL.revokeObjectURL(url);

}