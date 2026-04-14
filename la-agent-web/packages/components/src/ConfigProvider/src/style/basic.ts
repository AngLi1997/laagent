import { asBrother, c, cB, cE } from '../../../utils/cssr';

// 基础组件样式
export default c([
  // 滚动条
  c(
    '::-webkit-scrollbar',
    `
    width: 4px;
    height: 8px;
    border-radius: 0px;
    -webkit-border-radius: 0px;
    -moz-border-radius: 0px;
    -ms-border-radius: 0px;
    -o-border-radius: 0px;
  `,
  ),
  c(
    '::-webkit-scrollbar-thumb',
    `
    border-radius: 3px;
    background: #dae0e8;
  `,
  ),
  c(
    '::-webkit-scrollbar-track',
    `
    border-radius: 3px;
  `,
  ),
  // .test-btn-primary.test-btn-dangerous
  cB('btn-primary', [
    asBrother('btn-dangerous', {
      boxShadow: '0 2px 0 rgba(255, 44, 2, 0.06)',
    }),
  ]),
  cB(
    'btn',
    `
      display: inline-flex;
      align-items: center;
      justify-content: center;
    `,
  ),
  // 数字输入框
  cB('input-number-input[disabled]', `color: var(--bmos-fifth-level-text-color);`),
  // 文本框
  c(
    'textarea',
    `
    height: 64px;
  `,
  ),
  // 下拉菜单里的文字hover
  cB('dropdown-menu-item:hover', [
    cB(
      'dropdown-menu-title-content',
      `
      color: var(--bmos-primary-color),
    `,
    ),
  ]),
  // .test-dropdown .test-dropdown-menu .test-dropdown-menu-item-disabled

  // select下拉的item高度
  cB('select-dropdown', [
    cB('select-item-option', {
      padding: '5px 12px',
      minHeight: '34px',
    }),
    cB('select-tree', [
      cB('select-tree-node-content-wrapper', [
        cB(
          'select-tree-title',
          `
        white-space: normal;
        word-break: break-all;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        `,
        ),
      ]),
    ]),
  ]),
  cB(
    'picker',
    `
 font-size: 20px;
`,
  ),

  // tree-select
  cB('tree-select-dropdown', [
    cB('select-tree', [
      cE('treenode', `width: 100%;`),
      cE("treenode[aria-selected='false']", [cE('node-content-wrapper', `cursor: not-allowed`)]),
    ]),
  ]),

  c('.bmos-wrap-select', [
    asBrother('select-single:not(.mes-select-customize-input)', null, [
      cB('select-selector', {
        height: 'auto',
      }),
    ]),
    asBrother('select-single', null, [
      cB('select-selector', [
        cB(
          'select-selection-item',
          `
            line-height: 20px;
            white-space: wrap;
            display: inline-flex;
            align-items: center;
          `,
        ),
      ]),
    ]),
  ]),

  // test-input-search-button test-btn-icon-only
  // 搜索框icon
  cB('input-group-wrapper', [
    cB(
      'btn-icon-only',
      `
font-size: 18px;
`,
    ),
  ]),

  cB('upload-wrapper', [
    cB('upload-list', [
      cE('item', {
        height: '28px',
        paddingLeft: '8px',
      }),
    ]),
  ]),
  // 单个时间选择器的宽度改为同时间下拉框一致,range不变
  // cB('picker', {
  //   width: '168px',
  // }),
  // cB('picker-range', {
  //   width: '268px',
  // }),

  // 分页组件
  cB('pagination', [
    cE(
      'item',
      `
      border: '1px solid var(--bmos-first-level-border-color'
    `,
    ),
  ]),
  cB('pagination', [
    cE('item-active', {
      border: '1px solid #1677ff',
    }),
    cE('options-quick-jumper', {
      marginInlineStart: '12px',
    }),
    cE('options', {
      marginInlineStart: '12px',
    }),
    cE('total-text', {
      marginInlineEnd: '12px',
    }),
  ]),
  cB('pagination-options-size-changer', [
    cB('select-selector', {
      height: '30px',
    }),
    cB('select-selection-item', {
      lineHeight: '27px',
    }),
    cB('select-selector', {
      borderRadius: '2px',
    }),
  ]),
  // 普通标签top
  cB('tabs-top', [
    cB('tabs-tab', {
      height: '40px',
      fontSize: '16px',
    }),
  ]),
  // 普通标签left
  cB('tabs-left', [
    c('>', [
      cB('tabs-nav', [
        cB('tabs-tab+', [
          cB('tabs-tab', {
            margin: '12px 0 0 0',
          }),
        ]),
      ]),
    ]),
    cB('tabs-tab', {
      height: '36px',
      fontSize: '14px',
    }),
  ]),
  // 卡片标签
  cB('tabs-card', [
    cB('tabs-tab', {
      height: '36px',
      fontSize: '14px',
    }),
  ]),
  // 大分段选择器
  // .test-segmented.test-segmented-lg .test-segmented-item
  cB(
    'segmented',
    `
    padding: 4px;
    `,
    [
      c('', [
        cB('segmented-lg', [
          cB('segmented-item', {
            borderRadius: '300px',
            margin: '0 10px',
          }),
        ]),
      ]),
      cB(
        'segmented-item-label',
        `
      padding: 0;
      white-space: none;
    `,
      ),
    ],
  ),
  // 小分段选择器
  cB('segmented', [
    cB('segmented-item', {
      borderRadius: '3px',
      margin: '0 2px',
    }),
  ]),
  cB(
    'segmented',
    `
    border-radius: 3px;
  `,
  ),
  cB(
    'segmented-item-selected',
    `
  color: var(--bmos-primary-color),
  `,
    [
      cB(
        'segmented-item-label',
        `
      color: var(--bmos-primary-color);,
    `,
      ),
    ],
  ),
  // 告警提示
  cB('message-notice', [
    cB('message-notice-content', {
      padding: '8px 20px',
      borderRadius: '4px',
    }),
  ]),
  // 通知提醒框
  cB(
    'notification',
    `
    color: var(--bmos-third-level-text-color),
  `,
  ),
  cB(
    'notification-notice',
    `
    padding: 20px 16px;width:360px;border-radius: 4px
  `,
  ),
  cB('notification-notice', [
    // 关闭图标大小及位置
    cB('notification-close-icon', {
      fontSize: '16px',
    }),
    cB('notification-notice-close', {
      insetInlineEnd: '16px',
    }),
    cB('notification-notice-with-icon', [
      cB('notification-notice-description', {
        marginInlineEnd: '32px',
      }),
    ]),
    cE('icon', {
      fontSize: '20px',
      marginTop: '2px',
    }),
  ]),
  // 对话框
  cB('modal-confirm', [
    cE('btns', {
      marginTop: '20px',
    }),
  ]),
  // icon大小
  cB('modal-confirm', [
    cE('body', [
      c('>', [
        c('.anticon', {
          fontSize: '20px',
          marginInlineEnd: '16px',
        }),
        c('.anticon+', [
          cB('modal-confirm-title+', [
            cB('modal-confirm-content', {
              marginInlineStart: '36px',
              marginInlineEnd: '36px',
            }),
          ]),
        ]),
      ]),
      cE('title', {
        fontWeight: '400',
      }),
      cB(
        'modal-confirm-content',
        `
        color: var(--bmos-third-level-text-color),
      `,
      ),
    ]),
    cE('btns', {
      marginTop: '20px',
    }),
  ]),
  cB('modal', [
    cE('content', {
      padding: '16px',
    }),
  ]),
  // 抽屉
  cB('drawer', [
    cB(
      'drawer-header',
      `
      padding: 12px 16px 10px 16px;
    `,
    ),
    cB(
      'drawer-body',
      `
      padding: var(--bmos-padding-small);
    `,
    ),
  ]),
  // alert
  cB(
    'alert',
    `
  border-radius: 4px;
`,
  ),
  cB(
    'alert-info',
    `
  border: none;
  background-color: var(--bmos-primary-color-background);
  `,
  ),

  // spin
  cB(
    'spin-nested-loading',
    `
  height: 100%;
`,
    [
      cB(
        'spin-container',
        `
    height: 100%;
    display: flex;
    flex-direction: column;
  `,
      ),
    ],
  ),
  // Popover
  cB('popover', [
    cB('popover-content', [
      cB(
        'popover-inner',
        `
          padding: 0;
          width: 420px;
        `,
        [
          cB(
            'popover-title',
            `
            padding-left: 16px;
            padding-top: 16px;
            padding-bottom: 4px;
            border-bottom: 1px solid var(--bmos-first-level-border-color);
          `,
          ),
          cB(
            'popover-inner-content',
            `
            padding: 16px;
          `,
          ),
        ],
      ),
    ]),
  ]),
]);
