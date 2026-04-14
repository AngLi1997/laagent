import { asMultiplePrefixClass, c, cB } from '../../../utils/cssr';

export default c([
  c(
    '.bmos-ellipsis-container',
    `
  display:inline-flex;
  align-items: center;
  max-width: 100%;
`,
  ),
  c(
    '.bmos-ellipsis-span',
    `
    display: inline-block;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    `,
  ),
  c(
    '.bmos-double-ellipsis-span',
    `
  line-height: 24px;
  white-space: normal;
  word-break: break-all;
  display:-webkit-box; 
  -webkit-box-orient:vertical;
  -webkit-line-clamp:2;
  `,
  ),
  asMultiplePrefixClass(
    [
      {
        hasPrefix: false,
        name: '.bmos-tooltip-ellipsis',
      },
      {
        hasPrefix: true,
        name: 'tooltip-placement-bottom',
      },
    ],
    `
  padding-top: 0;
  `,
  ),
  c(
    '.bmos-tooltip-ellipsis',
    `
  padding-top: 0;
    `,
    [
      cB(
        'tooltip-arrow',
        `
    display: none;
    `,
      ),
      cB(
        'tooltip-inner',
        `
    padding: 4px 8px;
    font-size: 12px;
    color: var(--bmos-third-level-text-color);
    background-color: #FFFEFC;
    border-radius: 0;
    box-shadow: none;
    border: 1px solid var(--bmos-first-level-border-color);
    `,
      ),
    ],
  ),
]);
