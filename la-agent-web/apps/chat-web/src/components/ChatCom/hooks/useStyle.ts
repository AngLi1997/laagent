import { createStyles } from 'antd-style';

export const useStyle = () => {
  const { styles } = createStyles(({ token, css }) => {
    return {
      layout: css`
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-bottom: 24px;
        background: ${token.colorBgContainer};
        font-family: AlibabaPuHuiTi, ${token.fontFamily}, sans-serif;
        .ant-btn-variant-outlined:not(:disabled):not(.ant-btn-disabled):hover {
          border: 1px solid #2871FF;
          background: #EBF1FF;
        }
      `,
      dropdown: css`
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 16px;
        cursor: pointer;
        border-radius: 6px;
        padding: 8px 12px;
        :hover {
          background: #F5F7FA;
        }
      `,
      conversations: css`
        width: 100%;
        flex: 1;
        overflow-y: auto;
      `,
      chat: css`
        height: 100%;
        width: 100%;
        margin: 0 auto;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 16px;
        position: relative;
      `,
      messages: css`
        width: 100%;
        align-items: center;
        flex: 1;
        gap: 20px;
        .ant-bubble {
          width: 100%;
          max-width: 800px;
        }
      `,
      placeholder: css`
        padding-top: 16px;
        padding-left: 16px;
      `,
      emptyContent: css`
        width: 100%;
        color: #000;
        text-align: center;
        font-size: 32px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      `,
      sender: css`
        background: #fff;
        max-width: 800px;
        box-shadow: ${token.boxShadow};
      `,
      logo: css`
        display: flex;
        height: 72px;
        align-items: center;
        justify-content: start;
        box-sizing: border-box;
  
        img {
          display: inline-block;
        }
  
        span {
          display: inline-block;
          margin: 0 8px;
          font-weight: bold;
          color: ${token.colorText};
          font-size: 16px;
        }
      `,
      addBtn: css`
        background: #1677ff0f;
        border: 1px solid #1677ff34;
        width: calc(100% - 24px);
        margin: 0 12px 24px 12px;
      `,
      OnlineActive: css`
        border: 1px solid #2871FF;
        background: #EBF1FF;
        color: #2871FF;
      `,
      conversationName: css`
        max-width: 200px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
      `,
    };
  })();

  return {
    styles,
  };
};
