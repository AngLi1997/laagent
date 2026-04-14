<template>
  <div class="bread-crumb-container">
    <Row class="components-header">
      <Col :span="8">
        <slot name="breadcrumb" />
      </Col>
      <Col :span="8" :offset="8" class="action">
        <Space :size="16">
          <slot name="btns" />
        </Space>
      </Col>
    </Row>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script setup></script>

<style lang="less" scoped>
  .bread-crumb-container {
  width: 100%;
  height: 100%;
  position: relative;
}
:deep(.components-header) {
  padding: 0 0 var(--bmos-padding-mini) 0;
  display: flex;
  align-items: center;
  .ant-breadcrumb {
    line-height: 36px;
  }
  .ant-breadcrumb ol li:not(:last-child) {
    cursor: pointer;
  }
  .action {
    text-align: right;
  }
}
.content {
  width: 100%;
  height: calc(100% - 48px);
  background-color: var(--bmos-primary-color-white);
  padding: var(--bmos-padding-mini);
  padding-bottom: 0;
  display: flex;
  flex-direction: column;
}
</style>
