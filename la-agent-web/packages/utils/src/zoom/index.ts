export function zoomListener() {
  // JavaScript部分
  function setZoomLevel() {
    // const width = window.innerWidth;
    // let zoomLevel = 1;
    // if (width <= 1300) {
    //   zoomLevel = 0.8;
    // } else if (width <= 1920) {
    //   zoomLevel = 1;
    // } else {
    //   zoomLevel = 1.2;
    // }
    // // @ts-ignore
    // document.body.style.zoom = zoomLevel;
    // // 设置 vh vm
    // document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    // document.documentElement.style.setProperty('--vw', `${window.innerWidth * 0.01}px`);
  }

  // 初始调用
  setZoomLevel();

  // 监听窗口大小变化
  window.addEventListener('resize', setZoomLevel);
}
