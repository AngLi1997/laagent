import { getParameterDetailByCode } from '@/api';
import { message } from 'ant-design-vue';
import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useConfig = defineStore('counter', () => {
  const configs = reactive<Record<string, any>>({});

  const findConfigByCode = async (code: string = 'mes.record.margin') => {
    try {
      const { data } = await getParameterDetailByCode(code);
      configs[code] = data;
    } catch (error: any) {
      message.error(error.message);
    }
  };

  return { findConfigByCode, configs };
});
