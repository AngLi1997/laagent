import { c } from '../../../utils/cssr';

export default c([
  c(
    'body',
    `
  --bmos-at-input-color: #2C3E59;
  --bmos-at-input-border-color: #8EABD1;
  --bmos-at-input-border-color__hover: #1D71F0;
  --bmos-at-input-border-color__error: #CC0814;
  --bmos-at-input-border-color__disabled: #8EABD1;
  --bmos-at-input-background-color: #F9FBFF;
  --bmos-at-input-background-color__disabled: #E5EDF9;
  --bmos-at-input-font-size: 14px;
  --bmos-at-input-placeholder-color: #A3AFC2;
  --bmos-at-input-popover-boder-color: #1D71F0;
  --bmos-at-input-popover-background-color: #F9FBFF;
  --bmos-at-input-popover-item-background-color__hover: #E5EDF9;
  --bmos-at-input-tip-color: #7C8BA3;
  `,
  ),
  c(
    '.bmos-at-container',
    `
    color: var(--bmos-at-input-color);
    font-size: var(--bmos-at-input-font-size);
    position: relative;
    `,
    [
      c(
        '.bmos-at-input',
        `
        width: 100%;
        border: 1px solid var(--bmos-at-input-border-color);
        background-color: var(--bmos-at-input-background-color);
        outline: none;
        overflow-y: auto;
        padding: 4px 8px;
        `,
        [
          c(
            '&:hover:not(.is-error, .is-disabled)',
            `
            border-color: var(--bmos-at-input-border-color__hover);`,
          ),
          c(
            '&:focus:not(.is-error, .is-disabled)',
            `
            border-color: var(--bmos-at-input-border-color__hover);`,
          ),
          c(
            '.bmos-at-span',
            `
            margin: 0 4px;
            `,
          ),
          c(
            '.placeholder',
            `
            color: var(--bmos-at-input-placeholder-color);
            `,
          ),
          c(
            '&.is-error',
            `
            border-color: var(--bmos-at-input-border-color__error);`,
          ),
          c(
            '&.is-disabled',
            `
            border-color: var(--bmos-at-input-border-color__disabled);
            background-color: var(--bmos-at-input-background-color__disabled);
            user-select: none;
            cursor: not-allowed;
            `,
          ),
          c(
            '&.is-wrap',
            `
            height: var(--bmos-at-input-height);
            `,
          ),
        ],
      ),
      c(
        '.bmos-at-popover',
        `
        position: absolute;
        background: var(--bmos-at-input-popover-background-color);
        border: 1px solid var(--bmos-at-input-popover-boder-color);
        `,
        [
          c(
            '.loading-tip',
            `
            padding: 4px 8px;
            color: var(--bmos-at-input-tip-color);
            `,
          ),
          c(
            '.bmos-at-popover-list',
            `
            list-style: none;
            margin: 4px 0;
            padding: 0;
            outline: none;
            max-height: 200px;
            overflow-y: auto;
            `,
            [
              c(
                '.bmos-at-popover-item',
                `
                min-width: 80px;
                padding: 4px 8px;
                cursor: pointer;
                `,
                [
                  c(
                    '&:hover',
                    `
                    background-color: var(--bmos-at-input-popover-item-background-color__hover);
                    `,
                  ),
                  c(
                    '&:focus',
                    `
                    background-color: var(--bmos-at-input-popover-item-background-color__hover);
                    `,
                  ),
                  c(
                    '&.active',
                    `
                    background-color: var(--bmos-at-input-popover-item-background-color__hover);
                    `,
                  ),
                ],
              ),
              c(
                '.empty',
                `
                min-width: 80px;
                padding: 4px 8px;
                color: var(--bmos-at-input-tip-color);
                `,
              ),
            ],
          ),
        ],
      ),
    ],
  ),
]);
