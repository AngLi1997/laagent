import { asChild, c, cB } from '../../../utils/cssr';

export default c([
  c('.bm-form', [
    cB(
      'picker',
      `
      width: 100%;
    `,
    ),
  ]),
  cB('form', [
    c(
      '.collapse-icon-down',
      `
    transition: transform 0.3s;
    transform: rotate(180deg);
    `,
    ),
    c(
      '.collapse-icon-up',
      `
    transition: transform 0.3s;
    transform: rotate(0);
    `,
    ),
    c(
      '.bmos-action-advance-btn',
      `
    padding-left: 16px;
    padding-right: 0;
    `,
    ),
    c(
      '.form-group-label',
      `
      font-family: Source Han Sans CN;
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      letter-spacing: 0em;
      color: var(--bmos-second-level-text-color);
      text-align: left;
      padding: var(--bmos-margin-small) 0;
    `,
    ),
    c(
      '.from-col',
      `
    padding-right: 16px !important;
  `,
      [c('.no-margin-bottom', `margin-bottom: 0;`)],
    ),
    cB('form-item', [
      cB(
        'form-item-control-input',
        `
      min-height: 36px;
    `,
      ),
      cB('form-item-label', [
        c(
          '>label',
          `
        line-height: 1.57;
      `,
        ),
      ]),
    ]),
    c('.label-full-width', [
      cB('form-item-label', [
        c(
          '>label',
          `
        width: 100%;
      `,
          [c('.bmos-ellipsis-span', `width: 100%;`)],
        ),
      ]),
    ]),
    c('.no-label', [
      asChild('form-item-row', [
        asChild(
          'form-item-label',
          `
        display: none;
          `,
        ),
      ]),
    ]),
    c(
      '.bmos-form-divider-container',
      `
      display: flex;
      align-items: center;
      margin: 0 0 var(--bmos-margin-medium) 0;
    `,
      [
        c(
          '.bmos-form-divider-border',
          `
          width: 5px;
          height: 16px;
          border-radius: 2px;
          background-color: var(--bmos-primary-color);
          z-index: 9;
        `,
        ),
        c(
          '.bmos-form-divider',
          `
        line-height: 14px;
        font-size: 14px;
        margin: 0;
        margin-left: 8px;
        min-width: 97%;
      `,
        ),
      ],
    ),
    c(
      '.dynamicSelectTag',
      `
      position: relative;
      display: flex;
      flex: none;
      box-sizing: border-box;
      max-width: 100%;
      height: 24px;
      margin-top: 2px;
      margin-bottom: 2px;
      line-height: 22px;
      background: rgba(0, 0, 0, 0.06);
      border: 1px solid rgba(5, 22, 38, 0.12);
      border-radius: 4px;
      cursor: default;
      transition: font-size 0.3s, line-height 0.3s, height 0.3s;
      user-select: none;
      margin-inline-end: 4px;
      padding-inline-start: 8px;
      padding-inline-end: 4px;
      font-size: 14px;
      `,
    ),
    cB('select-disabled', [
      c(
        '.dynamicSelectTag',
        `    color: #C1C4CB;
    border-color: #D4D7D9;
    cursor: not-allowed;`,
      ),
      cB('tag', [c('.anticon-close', `display: none;`)]),
    ]),
  ]),
  cB('form-vertical', [
    cB('form-item', [
      cB('form-item-label', [
        c(
          '>label',
          `
        width: 100%;
      `,
        ),
        cB(
          'form-item-no-colon',
          `
            width: 100%;
            justify-content: flex-start;
          `,
        ),
      ]),
    ]),
  ]),
]);
