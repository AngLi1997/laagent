import { c, cB } from '../../../utils/cssr';

const treeWidth = '264px';

export default c([
  c(
    '.bmos-page-component-container',
    `
  display: flex;
  height: 100%;
  `,
    [
      c(
        '.bmos-left-component-tree',
        `
      width: ${treeWidth};
      height: 100%;
      display: flex;
      flex-direction: column;
    `,
        [
          c('.bmos-left-component-header', 'background-color: #ffffff;'),
          c(
            '.bmos-left-component-content',
            `width: ${treeWidth};
      border-right: 1px solid rgba(225, 227, 229, 1);
      box-sizing: border-box;
      background-color: #ffffff;
      padding-bottom: 12px;
      flex: 1;
      overflow: hidden;`,
          ),
        ],
      ),
      c(
        '.bmos-right-component-content',
        `
      width: calc(100% - ${treeWidth});
    flex: 1;
    `,
        [
          c(
            '.bmos-page-component-table-content',
            `
        padding: 16px;
        padding-bottom: 12px;
        background-color: #ffffff;
        overflow-y: hidden;
        display: flex;
        flex: 1;
        flex-direction: column;
        `,
            [
              c('&:first-child', `flex-grow: 1.5;`),
              c('.bmos-page-component-table-content-header', `margin-bottom: 16px;`, [
                c(
                  '.bmos-page-component-table-content-header_search',
                  `    padding-block-end: 16px;
          border-bottom: 1px solid #e1e3e5;`,
                ),
                c(
                  '.bmos-page-component-table-content-header-title',
                  `height: 100%;
              display: flex;
              align-items: center;
              height: 36px;`,
                ),
                c(
                  '.bmos-page-component-table-content-header-toolbar',
                  `display: flex;
                      justify-content: end;
                      column-gap: 16px;
                      height: 100%;
                    `,
                ),
              ]),
              c(
                '.table-row',
                ` flex: 1;
                 overflow: hidden;`,
                [
                  c(
                    '.hide-second-icon-content',
                    `
                    display: flex;
                    align-items: center;
                  `,
                    [cB('divider-vertical', `height: 1.5em;margin: 0 14px 0 0;`)],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
      c(
        '.bmos-right-empty-content',
        `
          background-color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        `,
      ),
    ],
  ),
  c(
    '.bmos-page-component-right-container',
    ` display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: hidden;`,
    [
      c('&:hover', `overflow-y: auto;`),
      c(
        '.line',
        `border-top: 2px solid #e1e3e5;
    height: 0px;`,
      ),
      c(
        '.swipe-up',
        `
        background-color: var(--bmos-primary-color-white);
        display: flex;
        align-item: center;
        justify-content: center;
      `,
        [c('span', `cursor: pointer;`)],
      ),
      c(
        '.second-table',
        `
        animation: all 1s;
      `,
        [
          c('.bmos-table', [
            c(
              '.bmos-tool-bar',
              `
            padding-top: 0;
          `,
            ),
          ]),
        ],
      ),
      c(
        '.hide-second-table.bmos-page-component-table-content',
        `
        flex-grow: 0;
        height: 0;
        padding-top: 0;
      `,
      ),
      c(
        '.show-second-table.bmos-page-component-table-content',
        `
        flex-grow: 1;
        height: auto;
      `,
      ),
    ],
  ),
]);
