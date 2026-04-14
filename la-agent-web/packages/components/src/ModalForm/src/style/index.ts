import { asChild, c, cB } from '../../../utils/cssr';

export default c([
  c(
    'bmos-modal-form-trigger',
    `
    cursor: pointer;
  `,
  ),
  cB('modal-body', [
    cB('form', [
      asChild(
        'row',
        `
        justify-content: center;
      `,
      ),
    ]),
  ]),
]);
