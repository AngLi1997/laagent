import type { DefineComponent, ExtractPropTypes } from 'vue';
import BMPageTree from './src/components/pageTree/index.vue';
import BMPageComponent from './src/pageComponent.vue';
import { tablesProps } from './src/props/tables';
export { BMPageComponent, BMPageTree };
export default BMPageComponent as unknown as DefineComponent<Partial<ExtractPropTypes<typeof tablesProps>>>;
