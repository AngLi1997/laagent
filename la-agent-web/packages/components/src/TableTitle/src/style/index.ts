import { c } from '../../../utils/cssr';

// 表格标题样式
export default c(
  '.bmos-table-title',
  `display: flex;
column-gap: 10px;
line-height: 36px;
font-size: 16px;
align-items: center;`,
  [
    c('.bmos-table-title-icon', [
      c(
        '&::before',
        `
          content: '';
          display: block;
          width: 4px;
          height: 16px;
          border-radius: 2px;
          background-color: var(--bmos-primary-color);
        `,
      ),
    ]),
  ],
);
