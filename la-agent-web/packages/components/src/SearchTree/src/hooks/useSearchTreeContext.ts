import { inject, provide } from 'vue';
import type { SearchTreeType } from './';

const key = Symbol('search-Tree');

export async function createSearchTreeContext(instance: SearchTreeType) {
  provide(key, instance);
}

export function useSearchTreeContext(searchTreeProps = {}) {
  return inject(key, searchTreeProps) as SearchTreeType;
}
