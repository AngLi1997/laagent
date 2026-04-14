import { c, cB, nextBrother } from '../../../utils/cssr';

export default c(
  '.bmos-search-tree',
  `
  width: 100%;
  height: 100%;
  `,
  [
    cB(
      'input-search',
      `
      margin: var(--bmos-margin-large);
      width: calc(100% - var(--bmos-margin-large) - var(--bmos-margin-large));
    `,
    ),
    cB(
      'tree-treenode:has(.is-unMatched)',
      `
        display: none;
      `,
    ),
    c(
      '.bmos-tree-label',
      `
      display: flex;
      align-items: center;
      justify-content: space-between;
    `,
      [
        c(
          '.bmos-tree-label-text',
          `
        line-height: 16px;
        margin-top: 12px;
        margin-bottom: 12px;
      `,
        ),
        c(
          '.bmos-tree-label-search',
          `
        color: #f50;
      `,
        ),
        c(
          '.bmos-tree-label-icon-more',
          `
        visibility: hidden;

      `,
        ),
        c('&:hover', [
          c(
            '.bmos-tree-label-icon-more',
            `
            visibility: visible;
          `,
          ),
        ]),
        c(
          '.bmos-tree-label-icon-more:hover',
          `
    background-color: #DFE5F2;
      `,
          [
            c(
              'path',
              `
          fill: #2871FF;
        `,
            ),
          ],
        ),
      ],
    ),
    cB(
      'tree',
      `
      width: 100%;
      overflow-y: auto;
    `,
      [
        cB(
          'tree-treenode',
          `
          width: 100%;
          min-height: 44px;
          align-items: center;
          padding: 0;
        `,
        ),
        cB(
          'tree-node-content-wrapper',
          `
           flex-grow: 1;
           padding: 0 8px 0 0;
           overflow: hidden;
           line-height: 44px;
           display: flex;
           align-items: center;
        `,
          [
            cB(
              'tree-title',
              `
              flex: 1;
              max-width: 100%;
              `,
            ),
            // test-tree-iconEle 如果有子节点，tree-title的宽度为84%
            // cB(
            //   'tree-iconEle:empty',
            //   `
            //   margin-right: 10px;
            //   `,
            // ),
            nextBrother(
              'tree-iconEle:not(:empty)',
              'tree-title',
              `
            width: 84%;
            `,
            ),
            cB('dropdown-open', [
              c(
                '&.bmos-tree-label-icon-more',
                `
          visibility: visible;
        `,
              ),
            ]),
          ],
        ),
        cB('tree-node-selected', [
          c(
            '.bmos-tree-label-icon-more',
            `
          visibility: visible;
        `,
          ),
        ]),
        cB(
          'tree-switcher',
          `
        margin-left: 8px;
        margin-right: 6px;
        width: 12px;
        display: flex;
        align-items: center;
      `,
          [
            cB(
              'tree-switcher-icon',
              `
        padding: 0;
        `,
            ),
          ],
        ),
      ],
    ),
    c(
      '.tree-inner-search-class',
      ` 
    height: calc(100% - var(--bmos-margin-large) - var(--bmos-margin-large) - 36px);
    `,
    ),
    c(
      '.tree-inner-no-search',
      `
    height: calc(100% - var(--bmos-margin-large) - var(--bmos-margin-large));
    `,
    ),
  ],
);
