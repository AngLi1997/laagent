import { c } from '../../../utils/cssr';

export default c([
  c(
    'html',
    `
  height: 100%;
  `,
  ),
  c('*', `
    box-sizing: border-box;
    margin: 0;
    font-weight: normal;
  `),
  c('*::before', `
    box-sizing: border-box;
    margin: 0;
    font-weight: normal;
  `),
  c('*::after', `
    box-sizing: border-box;
      margin: 0;
      font-weight: normal;
    `),
  c(
    'body',
    `
    margin: 0;
    padding: 0;
    min-height: 100%;
    height: 100%;
    font-size: 14px;
    font-family:"思源黑体","Microsoft YaHei" !important;
    line-height: 1.4;
    overflow: hidden;
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: transparent;
  
    --bmos-primary-color: #2871FF;
    --bmos-primary-color-white: #ffffff;
    --bmos-primary-color-background: #EBF1FF;
    --bmos-primary-color-tab: #D9E5FF;
    --bmos-primary-color-hover: #5991FF;
    --bmos-primary-color-active: #2260D9;
  
    --bmos-primary-color-menu: #103566;
    --bmos-primary-color-menu-level-2: #0D2F59;
  
    --bmos-success-color: #59BF78;
    --bmos-success-color-light-background: #EAF9F4;
    --bmos-success-color-stroke: #BDE5C9;
    --bmos-success-color-stroke-hover: #8BD2A1;
    --bmos-success-color-hover: #72C98C;
    --bmos-success-color-active: #52B06E;
  
    --bmos-warning-color: #FF9A2F;
    --bmos-warning-color-light-background: #FFECD8;
    --bmos-warning-color-stroke: #FFD7AC;
    --bmos-warning-color-stroke-hover: #FFB86D;
    --bmos-warning-color-hover: #FFA94E;
    --bmos-warning-color-active: #EB8E2B;
  
    --bmos-danger-color: #FF5633;
    --bmos-danger-color-light-background: #FFD7CF;
    --bmos-danger-color-stroke: #FFBBAD;
    --bmos-danger-color-stroke-hover: #FF8970;
    --bmos-danger-color-hover: #FF6F52;
    --bmos-danger-color-active: #EB4F2F;

    --bmos-limit-color: #574EFA;

    --bmos-purple-color: #574EFA;
    --bmos-confirm-color: #00BFFF;

    --bmos-first-level-text-color: #18191A;
    --bmos-second-level-text-color: #242526;
    --bmos-third-level-text-color: #606266;
    --bmos-fourth-level-text-color: #909398;
    --bmos-fifth-level-text-color: #C1C4CB;
    --bmos-first-level-border-color: #D4D7D9;
    --bmos-second-level-border-color: #E1E3E5;
  
    --bmos-background-color: #F5F7FA;
    --bmos-disable-color: #F2F3F4;
    --bmos-table-td-color: #FAFAFA;
  
    --bmos-title-font-size: 20px;
    --bmos-page-title-font-size: 18px;
    --bmos-bold-title-font-size: 16px;
    --bmos-bold-title-font-weight: medium;
    --bmos-module-title-font-size: 16px;
    --bmos-primary-font-size: 14px;
    --bmos-primary-font-weight: medium;
    --bmos-font-size: 14px;
    --bmos-description-font-size: 12px;
  
    --bmos-padding-mini: 12px;
    --bmos-padding-small: 16px;
    --bmos-padding-medium: 20px;
    --bmos-padding-large: 24px;
  
    --bmos-margin-small: 8px;
    --bmos-margin-medium: 12px;
    --bmos-margin-large: 16px;
  
    --bmos-module-margin-small: 16px;
    --bmos-module-margin-medium: 24px;
    --bmos-module-margin-large: 32px;
  `,
    [
      c(
        'input',
        `
      font-family: inherit;
      font-size: inherit;
    `,
      ),
    ],
  ),
]);
