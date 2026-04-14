<template>
  <div ref="editorContainer" class="editor-content" :class="[showBorder ? 'border-class' : '']" />
</template>

<script setup lang="ts">
import * as monaco from 'monaco-editor';
// @ts-ignore
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
// @ts-ignore
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
// @ts-ignore
// eslint-disable-next-line perfectionist/sort-imports
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
// @ts-ignore

// @ts-ignore
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
// @ts-ignore
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

const props = defineProps<{
  modelValue?: string;
  language?: string;
  theme?: string;
  readOnly?: boolean;
  showBorder?: boolean;
}>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
}>();
// eslint-disable-next-line no-restricted-globals
self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      // eslint-disable-next-line new-cap
      return new jsonWorker();
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      // eslint-disable-next-line new-cap
      return new cssWorker();
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      // eslint-disable-next-line new-cap
      return new htmlWorker();
    }
    if (label === 'typescript' || label === 'javascript') {
      // eslint-disable-next-line new-cap
      return new tsWorker();
    }
    // eslint-disable-next-line new-cap
    return new editorWorker();
  },
};
const editorContainer = ref<HTMLElement | null>(null);
const editor = ref<monaco.editor.IStandaloneCodeEditor | null>(null);
const currentLanguage = computed(() => {
  return props.language || 'json';
});

// Initialize Monaco Editor
onMounted(() => {
  if (editorContainer.value) {
    editor.value = monaco.editor.create(editorContainer.value, {
      value: props.modelValue || '',
      language: currentLanguage.value,
      theme: props.theme || 'vs',
      automaticLayout: true,
      minimap: {
        enabled: false,
      },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: 'on',
      readOnly: props.readOnly || false,
      tabSize: 2,
      wordWrap: 'on',
      folding: true,
      lineDecorationsWidth: 10,
      lineNumbersMinChars: 3,
      renderLineHighlight: 'all',
      scrollbar: {
        vertical: 'visible',
        horizontal: 'visible',
        useShadows: false,
        verticalScrollbarSize: 10,
        horizontalScrollbarSize: 10,
      },
    });

    // Handle editor content changes
    toRaw(editor.value).onDidChangeModelContent(() => {
      const value = toRaw(editor.value)?.getValue() || '';
      emit('update:modelValue', value);
      emit('change', value);
    });
  }
});

// Watch for language changes
watch(currentLanguage, (newLanguage) => {
  if (editor.value) {
    monaco.editor.setModelLanguage(toRaw(editor.value).getModel()!, newLanguage);
  }
});

// Watch for value changes from parent
watch(
  () => props.modelValue,
  (newValue) => {
    if (editor.value && newValue !== toRaw(editor.value)?.getValue()) {
      toRaw(editor.value)?.setValue(newValue || '');
    }
  },
);

// Watch for readOnly changes
watch(
  () => props.readOnly,
  (newReadOnly) => {
    if (editor.value) {
      editor.value.updateOptions({ readOnly: newReadOnly });
    }
  },
);

// Watch for theme changes
watch(
  () => props.theme,
  (newTheme) => {
    if (editor.value && newTheme) {
      monaco.editor.setTheme(newTheme);
    }
  },
);

// Cleanup
onBeforeUnmount(() => {
  if (editor.value) {
    toRaw(editor.value)?.dispose?.();
  }
});
</script>

<style scoped>
  .editor-content {
  width: 100%;
  height: 100%;
}
.editor-content.border-class {
  border: 1px solid var(--bmos-first-level-border-color);
  border-radius: 4px;
}
</style>
