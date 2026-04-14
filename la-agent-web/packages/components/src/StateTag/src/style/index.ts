import { c } from '../../../utils/cssr';

export default c([
  c(
    '.bm-state-tag',
    `
    display: flex;
    column-gap: 8px;
    align-items: center;
    color: rgba(96, 98, 102, 1);
    &::before {
      content: '';
      display: block;
      width: 6px;
      height: 6px;
      background-color: currentColor;
      border-radius: 3px;
      flex-shrink: 0;
    }
  `,
  ),
  c('.bm-state-tag_pointer', `cursor: pointer;`),
  c(
    '.bm-state-tag_primary',
    ` 
    color: var(--bmos-primary-color);
  `,
  ),
  c(
    '.bm-state-tag_success',
    `
    color: var(--bmos-success-color);
  `,
  ),
  c(
    '.bm-state-tag_danger',
    `
    color: var(--bmos-danger-color);
  `,
  ),
  c(
    '.bm-state-tag_warning',
    `
    color: var(--bmos-warning-color);
  `,
  ),
  c(
    '.bm-state-tag_purple',
    `
    color: var(--bmos-purple-color);
  `,
  ),
  c(
    '.bm-state-tag_default',
    `
    color: var(--bmos-fourth-level-text-color);
  `,
  ),
  c(
    '.bm-state-tag_confirm',
    `
    color: var(--bmos-confirm-color);
  `,
  ),
  c(
    '.bm-state-tag_limit',
    `
    color: var(--bmos-limit-color);
  `,
  ),
]);
