import { c } from '../../../utils/cssr';

export default c([
  c(
    '.no-autofill-pwd',
    `
    -webkit-text-security: disc !important;
  `,
  ),
  c(
    '.no-auto2',
    `
  -webkit-text-security: none !important;
  `,
  ),
]);
