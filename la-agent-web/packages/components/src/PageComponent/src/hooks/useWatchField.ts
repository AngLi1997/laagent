import { objectEach } from '@bmos/utils';
import { Ref, watch } from 'vue';
import { FIELD } from '../type';

export const useWatchField = (
  watchField: Ref<FIELD>,
  node: Ref<any>,
  fields: FIELD,
) => {
  watch(
    [watchField, fields],
    ([val, val1]) => {
      if (!val) return;
      if (!fields) return;
      if (val.field) {
        if (node.value) {
          objectEach(val.field, (v, k) => {
            fields.default[k] = node.value[v];
          });
        }
      }
    },
    { immediate: true },
  );
};
