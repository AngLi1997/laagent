import { c, cB } from '../../../utils/cssr';

export default c([
  cB('descriptions', `
    background-color: var(--bmos-primary-color-white);
    padding: 6px var(--bmos-padding-small);
  `),
  cB('descriptions', [
    c('&.has-title', ''),
    c('&.not-title', [
      cB(
        'descriptions-header',
        `
        display: none;
        `,
      ),
    ]),
    c('&.show-bottom-border', `
      border-bottom: 1px solid var(--bmos-second-level-border-color);
    `),
    cB('descriptions-item-container', [
      cB('descriptions-item-label', `
        color: var(--bmos-third-level-text-color)
      `),
    ]),
    cB('descriptions-row', [
      c('>td', `
        padding-bottom: 8px;
      `)
    ])
  ]),
  cB('descriptions-item', `
    padding: 8px;
  `),
])
