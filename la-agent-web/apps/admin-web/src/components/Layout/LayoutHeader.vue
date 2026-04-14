<template>
  <div class="header-container">
    <div class="logo-class">
      <!-- 蓝底logo -->
      <div v-if="props.bmosLogoBlue" class="header_left">
        <!-- 白底logo -->
        <img :src="getLogoUrl('Bmos_logo.svg')" style="width: 200px; height: 50px">
      </div>
      <div v-else style="width: 200px; height: 50px; background: rgb(16, 53, 102)">
        <div class="platform-title">
          La-Agent
        </div>
      </div>
    </div>
    <div class="header_all_right">
      <div class="header_right">
        <!-- 右上角用户信息 -->
        <div class="user">
          <Dropdown>
            <div class="info">
              <img v-if="avatarUrl" :src="avatarUrl" style="width: 24px; height: 24px; border-radius: 50%">
              <BMIcons v-else icon="User" style="width: 24px; height: 24px; color: rgb(108, 115, 128)" />
              <span class="userName">
                {{ userInfo?.userName }}
              </span>
              <BMIcons icon="Group" style="width: 14px; height: 14px; transform: translate(-6px, -1px)" />
            </div>
            <template #overlay>
              <div class="hoverMenu">
                <div class="userInfo">
                  <div class="headSculpture">
                    <img v-if="avatarUrl" :src="avatarUrl" style="width: 40px; height: 40px; border-radius: 50%">
                    <BMIcons v-else icon="User" style="width: 40px; height: 40px; color: rgb(108, 115, 128)" />
                  </div>
                  <div>
                    <div class="loginName">
                      {{ userInfo?.userName }}
                    </div>
                    <div class="accountName">
                      {{ t('账号') }}: {{ userInfo?.loginName }}
                    </div>
                  </div>
                </div>
                <div class="action">
                  <div class="line">
                    <Divider type="" />
                  </div>
                  <div class="actionItem" @click="changePassWord('1')">
                    <BMIcons
                      icon="ActionPassword"
                      style="width: 16px; height: 16px; color: rgb(108, 115, 128)"
                    />
                    <div class="actionTitle">
                      {{ t('密码设置') }}
                    </div>
                  </div>
                  <div class="actionItem" @click="changePassWord('2')">
                    <BMIcons icon="SignPassword" style="width: 16px; height: 16px; color: rgb(108, 115, 128)" />
                    <div class="actionTitle">
                      {{ t('签名密码设置') }}
                    </div>
                  </div>
                  <div class="actionItem" @click="lockScreen">
                    <BMIcons icon="ActionLock" style="width: 16px; height: 16px" />
                    <div class="actionTitle">
                      {{ t('锁屏') }}
                    </div>
                  </div>
                  <div class="actionItem" @click="languageChange">
                    <BMIcons icon="ActionLanguage" style="width: 16px; height: 16px" />
                    <div class="actionTitle">
                      {{ t('语言设置') }}
                    </div>
                  </div>
                  <div class="line">
                    <Divider type="" />
                  </div>
                  <div class="actionItem" @click="loggingOut">
                    <BMIcons icon="ActionExit" style="width: 16px; height: 16px" />
                    <div class="actionTitle">
                      {{ t('安全退出') }}
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </Dropdown>
        </div>
      </div>
    </div>

    <!-- 提示修改密码弹窗 -->
    <changePassword ref="changePasswordRef" :type="type" />
    <!-- 锁屏 -->
    <lockScreenModal ref="lockScreenRef" :user-iofo="userInfo" :start="LOCK.start" />
    <!-- 切换语言弹窗 -->
    <changeLanguage ref="changeLanguageRef" @change-lang="changeLang" />
  </div>
</template>

<script setup lang="ts">
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { t } from '@bmos/i18n';
import { BMIcons } from '@bmos/icons';
import { sso } from '@bmos/messager';
import { getLogoUrl } from '@bmos/utils';
import { Divider, Dropdown, message, Modal } from 'ant-design-vue';
import { createVNode, onMounted, onUnmounted, reactive, ref } from 'vue';
import { getParameter, logout, reqAgentConfigsUserGet } from '@/api';
import { updateLangResource } from '@/utils/handleLang';
import changeLanguage from './action/changeLanguage.vue';
import changePassword from './action/changePassword.vue';
import lockScreenModal from './action/lockScreen.vue';
import { clearLockStatus, getLockStatus, LockScreen, setLockStatus } from './lock';

const props = defineProps({
  bmosLogoBlue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['changeLang']);
const { getUserInfo, navigatorLoginPage, setUserToken } = sso;
const lockTime = ref(0); // 多久不操作会锁屏
const changePasswordRef = ref();
const type = ref<string>('1');
const lockScreenRef = ref();
const changeLanguageRef = ref();
const shortcutKey = ref(); // 快捷键
// 用户信息
const userInfo = ref({ userName: '', loginName: '', userId: '', token: '' });

const LOCK = reactive({
  start: () => {},
  pause: () => {},
});

// 密码设置/签名密码设置
const changePassWord = (val: string) => {
  type.value = val;
  changePasswordRef.value.showModal();
};
  // 锁屏
const lockScreen = () => {
  lockScreenRef.value.showModal();
  setLockStatus(userInfo.value?.userId);
  LOCK.pause();
};

// 语言设置按钮
const languageChange = () => {
  changeLanguageRef.value.showModal();
};
  // 语言弹框
const changeLang = async (val: string) => {
  emit('changeLang', val);
  localStorage.setItem('LANG', val);
  await updateLangResource(val);
  window.location.reload();
};
  // 安全退出
const loggingOut = () => {
  Modal.confirm({
    title: t('是否退出登录'),
    icon: createVNode(ExclamationCircleOutlined),
    closable: true,
    okText: t('确定'),
    cancelText: t('取消'),
    async onOk() {
      try {
        const res = await logout();
        if (res.code === 0) {
          message.success(t('退出成功'));
          clearLockStatus(userInfo.value?.userId);
          navigatorLoginPage();
          setUserToken('');
        }
        else {
          message.error(res.message);
        }
      }
      catch (error: any) {
        message.error(error.message);
      }
    },
  });
};
  // 获取锁屏时间
const getLockScreenTime = async () => {
  const res: any = await getParameter('platform.sys.web-lock-screen-time');
  lockTime.value = res.data.value * 60 * 1000; // 多久不操作会锁屏 转成毫秒
  // 如果设置的时长为0,则永不锁屏
  if (lockTime.value === 0) {
    return;
  }
  const lock = LockScreen(() => lockScreen(), lockTime.value);
  Object.assign(LOCK, lock);
  const status = getLockStatus(userInfo.value?.userId);
  // 若锁屏状态为true
  if (status) {
    lockScreenRef.value.showModal();
  }
  else {
    LOCK.start();
  }
};

// 获取键盘锁屏快捷键
const getLockScreenShortcutKey = async () => {
  try {
    const res: any = await getParameter('platform.sys.web-lock-screen-hotkey');
    shortcutKey.value = JSON.parse(res.data.value); // ["Ctrl","Q"]
  }
  catch (error) {
    console.log(error);
  }
};

const avatarUrl = ref<string>('');
const getAvatar = async () => {
  try {
    const { data } = await reqAgentConfigsUserGet();
    avatarUrl.value = data;
  }
  catch (_error) {
    // 不能删，删除后头像无法加载
    console.log(_error);
  }
};

onMounted(async () => {
  try {
    getLockScreenTime();
    getLockScreenShortcutKey();
    getAvatar();
    userInfo.value = getUserInfo();
    const timer = setInterval(() => {
      const user = getUserInfo();
      if (user) {
        userInfo.value = user;
        clearInterval(timer);
      }
    }, 100);

    window.document.onkeydown = (e) => {
      e.stopPropagation();
      const firstKey = (e as any)[`${shortcutKey.value[0].toLowerCase()}Key`]; // 第一个键
      const secondKey = shortcutKey.value[1].charCodeAt(0); // 第二个键
      if (firstKey && e.key.charCodeAt(0) === secondKey) {
        lockScreen();
      }
    };
  }
  catch (_error) {
    //
  }
});
onUnmounted(() => {
  LOCK.pause();
});
</script>

<style scoped lang="less">
  .header-container {
  width: 100%;
  // height: 5.8%;
  height: 50px;
  padding-right: 2px;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}
.logo-class {
  cursor: pointer;
}
.header_left {
  width: 11.6%;
  height: 100%;
  position: relative;
}
.platform-title {
  width: 100%;
  height: 100%;
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.header_all_right {
  width: calc(100% - 200px);
  height: 100%;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
}
.header_right {
  height: 100%;
  display: flex;
  align-items: center;
  // 下拉框
  .selectMenu {
    border-radius: 4px;
  }
  .selectMenu:hover {
    background: #f0f1f2;
  }

  :deep(.ant-select-selector) {
    border-radius: 4px;
    border: 1px solid #fff;
  }

  :deep(.ant-select-selector:hover) {
    // border-radius: 20px;
    background: #f0f1f2;
    border: 1px solid #fff;
  }

  :deep(.ant-divider-vertical) {
    height: 1.5em;
    margin: 0 24px;
  }
  :deep(.ant-badge .ant-badge-dot.ant-scroll-number) {
    transform: translate(-1px, -1px);
  }
  :deep(.message-badge) .ant-badge-multiple-words {
    padding: 0 4px;
  }
  .message {
    line-height: 0;
    margin-right: 20px;
    padding: 3px;
    border-radius: 4px;
  }
  // 移入铃铛
  .message:hover {
    background: #f0f1f2;
  }
  //  用户信息
  .user {
    position: relative;

    .info {
      padding: 4px 8px 4px 4px;
      box-sizing: border-box;
      border-radius: 4px;
      display: flex;
      align-items: center;
      cursor: pointer;
      .userName {
        width: 48px;
        display: inline-block;
        font-size: 14px;
        margin-left: 8px;
        margin-top: 1px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .info:hover {
      background: #f0f1f2;
    }
  }
}
// hover时的下拉菜单
.hoverMenu {
  width: 240px;
  height: 280px;
  background-color: #fff;
  border-radius: 4px;
  position: absolute;
  top: 2px;
  right: 0px;
  .userInfo {
    display: flex;
    height: 60px;
    padding: 12px 0px 8px 12px;
    background-image: url('../../assets/img/userBgInfo.png');
    .headSculpture {
      margin-right: 8px;
    }
    .loginName {
      font-size: 14px;
    }
    .accountName {
      font-size: 12px;
      color: #909398;
    }
  }
  .action {
    padding: 0px 12px 12px 12px;
    .line {
      margin-bottom: 8px;
    }
    .actionItem {
      width: 216px;
      height: 36px;
      margin-bottom: 3px;
      padding-left: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      border-radius: 4px;
      .actionTitle {
        font-size: 14px;
        color: #606266;
        margin-left: 8px;
      }
    }
    .actionItem:hover {
      background: #f4f4f4;
    }
  }
}
</style>

<style lang="less">
  .ant-popover.chat-popover .ant-popover-content .ant-popover-inner {
  width: 720px;
}
</style>
