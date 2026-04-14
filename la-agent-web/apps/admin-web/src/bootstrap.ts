import { Auth } from '@bmos/messager';
import { asyncMenu } from './router/async';
import { handleLang } from './utils/handleLang';
(async () => {
  try {
    // localStorage.setItem('BMOS-ACCESS-TOKEN', 'c21aedc8-d16c-4f78-9277-57cb3a259ee3')
    await Auth({});
    await asyncMenu();
    await handleLang();
  } catch (error) {
    console.log(error);
  }
  await import('./render');
})();
