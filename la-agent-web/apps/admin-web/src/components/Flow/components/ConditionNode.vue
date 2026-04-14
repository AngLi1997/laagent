<template>
  <div class="flow-condition-node">
    <div class="top">
      <BMIcons :icon="leftIcon" />
      <div class="label">
        {{ labelName }}
      </div>
      <Divider v-if="showDivider" type="vertical" />
      <Space>
        <BMIcons v-if="showSetIcon" :icon="setIcon" class="action-icon" @click.stop="setting" />
        <BMIcons v-if="showTestIcon" :icon="testIcon" class="action-icon" @click.stop="clickTest" />
      </Space>
    </div>
    <div v-if="curCases && curCases.length" class="bottom">
      <div v-for="(item, index) in curCases.slice(0, curCases.length - 1)" :key="item.key" class="condition-container">
        <div class="condition-title">
          <span class="left">
            CASE {{ index + 1 }}
          </span>
          <span class="right">
            {{ index ? 'ELIF' : 'IF' }}
          </span>
        </div>
        <template v-if="item.conditions && item.conditions.length">
          <div v-for="(condition) in item.conditions" :key="condition.code" class="condition">
            <span class="code">
              {{ condition.key }}
            </span>
            <span class="other">
              {{ condition.variable_selector }}
            </span>
            <span class="other">
              {{ t(condition.operator) }}
            </span>
            <span class="other last">
              {{ condition.value }}
            </span>
          </div>
          <div class="condition">
            <span class="code">
              {{ t('逻辑表达式') }}
            </span>
            <span class="other last">
              {{ item.logic }}
            </span>
          </div>
        </template>
        <div v-else class="condition no-condition">
          {{ t('条件未设置') }}
        </div>
      </div>
      <div class="condition-else">
        {{ 'ELSE' }}
      </div>
    </div>
    <div v-else class="bottom">
      <div class="condition-container">
        <div class="condition-title">
          <span class="left" />
          <span class="right">
            {{ 'IF' }}
          </span>
        </div>
      </div>
      <div class="condition-else">
        {{ 'ELSE' }}
      </div>
    </div>
  </div>
</template>

<script lang="tsx" setup>
import type { Cell } from '@antv/x6';
import type { Recordable } from '@bmos/components';
import { t } from '@bmos/i18n';
import { BMIcons } from '@bmos/icons';
import { Divider, Space } from 'ant-design-vue';
import { inject, onMounted, ref } from 'vue';
import { FlowNodeEnum, PortIdEnum } from '../type';

defineProps({
  leftIcon: {
    type: String,
    default: 'FlowCondition',
  },
  setIcon: {
    type: String,
    default: 'FlowSet',
  },
  testIcon: {
    type: String,
    default: 'FlowTest',
  },
  showTestIcon: {
    type: Boolean,
    default: true,
  },
  showSetIcon: {
    type: Boolean,
    default: true,
  },
  showDivider: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(['setting', 'clickTest', 'clickFile']);
const getNode = inject('getNode') as () => Cell;

const node = ref<any>({});
const labelName = ref<string>('');
const curCases = ref<Recordable>({});

const setting = () => {
  emit('setting', node.value as Cell);
};

const clickTest = () => {
  emit('clickTest', node.value as Cell);
};

onMounted(() => {
  node.value = getNode();
  labelName.value = node.value.data?.label || '';
  curCases.value = node.value.data?.formData?.[`${FlowNodeEnum.CONDITION}_config`].cases || [];
  const size = node.value?.size();
  node.value.on('change:data', ({ current }: any) => {
    const { label, formData } = current;
    labelName.value = label;
    const needDeletePort = node.value?.getPorts().filter((port: any) => {
      return port.group === 'elseIfPort';
    });
    node.value.removePorts(needDeletePort);
    const cases = formData?.[`${FlowNodeEnum.CONDITION}_config`].cases || [];
    curCases.value = cases;
    if (cases.length) {
      // 更新节点的高度 52 原高度 12px gap
      let height = 52 + 12;
      const conditionLength: number = cases.length || 0;
      console.log('conditionLength', conditionLength);
      const newProt: any[] = [];
      cases?.forEach((item: any, index: number) => {
        if (index < conditionLength - 1) {
        // title + marginBottom
          console.log('height', item);
          if (index > 0) {
            newProt.push({
              id: `condition-right-else-if-port_${index}`,
              group: 'elseIfPort',
              args: {
                x: size.width,
                y: height + 3,
              },
            });
          }
          height += (16 + 12);
          if (item.conditions && item.conditions.length) {
          //  item 22 gap 4
            height += (22 + 4) * (item.conditions.length + 1);
          }
        }
      });
      height += (16 + 6 * 2); // 16 else + 6px padding * 2
      node.value?.resize(size.width, height);
      node.value.addPorts(newProt);

      // 更新 else 连接点 condition-else-port 的位置
      const elsePort = node.value.getPort(PortIdEnum.CONDITION_RIGHT_ELSE);
      if (elsePort) {
        node.value.portProp(PortIdEnum.CONDITION_RIGHT_ELSE, 'args', {
          x: size.width,
          y: height - 12 - 6 - 8, // 12px node padding + 6px bottom padding + 8px else 16/2 height
        });
      }
    }
    else {
      // 如果没有条件，设置节点高度为默认高度 120px
      node.value.resize(size.width, 120);
    }
  });
});
</script>

<style scoped lang="less">
.flow-condition-node {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background-color: var(--bmos-primary-color-white);
  padding: 12px;
  border: 1px solid var(--bmos-primary-color-white);
  display: flex;
  flex-direction: column;
  gap: 12px;
  .top {
    display: flex;
    align-items: center;
    justify-content: space-around;
    line-height: 28px;
  }
  .bottom {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 6px 8px;
    height: 30px;
    border-radius: 4px;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px; /* 128.571% */
    color: var(--bmos-third-level-text-color);
  }
  .ant-divider-vertical {
    height: 1.5em;
  }
  .label {
    line-height: 1.3em;
    width: 100px;
    text-align: center;
    flex: 1;
  }
  .condition-container {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 12px;
  }
  .condition-title {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    align-self: stretch;
    font-style: normal;
    font-size: 12px;
    line-height: 16px;
    .left {
      color: var(--bmos-third-level-text-color);
      font-weight: 400;
    }
    .right {
      color: #000;
      font-weight: 500;
    }
  }
  .condition {
    display: flex;
    padding: 3px 8px;
    align-items: center;
    border-radius: 4px;
    background: #f2f4f7;
    gap: 8px;
    align-self: stretch;
    height: 22px;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    color: var(--bmos-third-level-text-color);
    .code {
      color: var(--bmos-primary-color-hover);
    }
    .last {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .condition-else {
    text-align: end;
    color: #000;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px;
  }
}

.action-icon {
  color: var(--bmos-primary-color);
  cursor: pointer;
}
</style>
