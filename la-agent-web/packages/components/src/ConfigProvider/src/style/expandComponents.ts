import { c, cB, cE } from '../../../utils/cssr';

const modalBasicStyle = [
  cB('modal-header', {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 'var(--bmos-padding-small)',
    marginBottom: '0',
    borderBottom: '1px solid #e4e4e4',
    height: '44px',
  }),
  cB('modal-footer', {
    marginInlineStart: '0px',
    marginTop: '0px ',
  }),
  cB('modal-footer', [
    cB('btn-default', {
      marginRight: '8px',
      marginBottom: '16px',
    }),
    cB('btn-primary', {
      marginBottom: '16px',
      marginRight: '16px',
    }),
  ]),
  cB('modal-close', {
    top: '13px',
    textAlign: 'center',
  }),
  cB('modal-close:hover', {
    backgroundColor: '#FF5633',
    color: '#ffffff',
  }),
];

// 基础扩展组件样式
export default c([
  // 多选树
  cB('tree', [
    cE('checkbox', {
      marginBlockStart: '0',
    }),
    cE('switcher', {
      marginRight: '-4px',
    }),
    cE('treenode', {
      width: '100%',
    }),
    cE('treenode-switcher-open:hover', {
      backgroundColor: '#F2F3F4',
    }),
    cE('treenode-switcher-close:hover', {
      backgroundColor: '#F2F3F4',
    }),
    cE('node-content-wrapper-normal', {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }),
    cE('indent-unit', {
      width: '20px',
    }),
  ]),

  cB('tree', {
    width: '400px',
    borderRadius: '0',
  }),
  // 展示树
  c(
    '.displayTree',
    {
      width: '400px',
      color: 'var(--bmos-third-level-text-color)',
    },
    [
      cB('tree-treenode-selected', {
        color: 'var(--bmos-primary-color)',
        backgroundColor: 'var(--bmos-primary-color-background)',
      }),
      cB('tree-treenode-selected:hover', {
        backgroundColor: 'var(--bmos-primary-color-background)',
      }),
    ],
  ),
  // 表格
  cB('table-wrapper', [
    cB('table-tbody', [
      c('tr', [
        c(
          'td',
          `
          padding: 0;
          height: 44px;
          padding-left: var(--bmos-padding-small);
          padding-right: var(--bmos-padding-small);
        `,
        ),
      ]),
    ]),
  ]),
  cB('table', [
    cE(
      'thead',
      ` 
   height: 44px;
   `,
    ),
    cE('selection-column', {
      width: '44px',
    }),
    cE('row-level-0', {
      boxSizing: 'border-box',
    }),
    cE('cell', [
      cB('table-selection-column', {
        width: '44px',
      }),
    ]),
    cE('cell:last-child', {
      minWidth: '100px',
      maxWidth: '470px',
    }),
  ]),
  // 弹出框 M号
  c('.modalSizeMedium', [
    cB(
      'modal-content',
      `
        width: 560px;
        `,
    ),
    cB('modal-content', {
      padding: '0',
      maxHeight: 'calc(100vh - 150px)',
    }),
    cB('modal-body', {
      margin: '16px',
      overflowY: 'scroll',
      overflow: 'auto',
      overflowX: 'hidden',
      maxHeight: 'calc(100vh - 150px - 128px)',
    }),
    ...modalBasicStyle,
  ]),
  // 弹出框 L号
  c('.modalSizeLarge', [
    cB(
      'modal',
      `
    left:50%;
    transform: translateX(-82%);
    animation: none;
    margin:0
    `,
    ),
    cB('modal-content', {
      padding: '0',
      width: '860px',
      maxHeight: 'calc(100vh - 150px)',
    }),
    cB('modal-body', {
      margin: '16px',
      overflowY: 'scroll',
      overflow: 'auto',
      overflowX: 'hidden',
      maxHeight: 'calc(100vh - 150px - 128px)',
    }),
    ...modalBasicStyle,
  ]),
  // 弹出框 XL号
  c('.modalSizeExtraLarge', [
    cB(
      'modal',
      `
    left:50%;
    transform: translateX(-124%);
    animation: none;
    margin:0
    `,
    ),
    cB('modal-content', {
      width: '1290px',
      padding: '0',
      maxHeight: 'calc(100vh - 120px - 60px)',
      overflow: 'hidden',
    }),
    cB('modal-body', {
      margin: '16px',
      overflowY: 'scroll',
      overflow: 'auto',
      overflowX: 'hidden',
      maxHeight: 'calc(100vh - 120px - 60px - 128px)',
    }),
    ...modalBasicStyle,
  ]),
  // 弹出框 XL号
  c('.chatModalSizeExtraLarge', [
    cB(
      'modal',
      `
    left:50%;
    transform: translateX(-50%);
    animation: none;
    margin:0;
    padding-bottom: 0;
    `,
    ),
    cB('modal-content', {
      width: '1290px',
      padding: '0',
      maxHeight: 'calc(100vh - 120px - 60px)',
      overflow: 'hidden',
    }),
    cB('modal-body', {
      margin: '16px',
      overflowY: 'scroll',
      overflow: 'auto',
      overflowX: 'hidden',
      maxHeight: 'calc(100vh - 120px - 60px - 128px)',
    }),
    ...modalBasicStyle,
  ]),
  // 弹出框 全屏
  c('.full-modal', [
    cB(
      'modal',
      `
      max-width: 100%;
      top: 0;
      padding-bottom: 0;
      margin: 0;
    `,
    ),
    cB('modal-content', {
      width: '100%',
      padding: '0',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }),
    cB(
      'modal-body',
      {
        margin: '16px',
        overflow: 'hidden',
        flex: '1',
      },
      [
        cB(
          'form',
          `
        height: 100%
      `,
        ),
      ],
    ),
    ...modalBasicStyle,
  ]),
  // 表单
  cB('form', [
    cE('item-no-colon', {
      marginRight: '6px',
    }),
    cE('item-explain-error', {
      fontSize: '12px',
    }),
  ]),
]);
