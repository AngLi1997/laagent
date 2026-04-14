import type { FlowLeftToolBar } from '@/components/Flow/type/toolBar';
import { FlowNodeEnum } from '@/components/Flow/type';
import { t } from '@bmos/i18n';
import { BMIcons } from '@bmos/icons';

// 流程图 左侧 item 配置
export const LeftMap: FlowLeftToolBar[] = [
  {
    title: t('LLM'),
    label: t('LLM'),
    shape: FlowNodeEnum.LLM,
    width: 260,
    height: 52,
    icon() {
      return <BMIcons icon="FlowLLM" />;
    },
  },
  {
    title: t('工具'),
    label: t('工具'),
    width: 260,
    height: 52,
    shape: FlowNodeEnum.TOOL,
    icon() {
      return <BMIcons icon="FlowTool" />;
    },
  },
  {
    title: t('知识库'),
    label: t('知识库'),
    width: 260,
    height: 52,
    shape: FlowNodeEnum.KNOWLEDGE_BASE,
    icon() {
      return <BMIcons icon="FlowKnowledgeBase" />;
    },
  },
  {
    title: t('用户输入'),
    label: t('用户输入'),
    width: 260,
    height: 52,
    shape: FlowNodeEnum.USER_INPUT,
    icon() {
      return <BMIcons icon="FlowUserInput" />;
    },
  },
  {
    title: t('条件'),
    label: t('条件'),
    width: 260,
    height: 120,
    shape: FlowNodeEnum.CONDITION,
    icon() {
      return <BMIcons icon="FlowCondition" />;
    },
  },
  {
    title: t('输出'),
    label: t('输出'),
    width: 260,
    height: 52,
    shape: FlowNodeEnum.OUTPUT,
    icon() {
      return <BMIcons icon="FlowOutput" />;
    },
  },
];
