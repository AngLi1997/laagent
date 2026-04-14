import type { MenuItem } from '../type';
import { getAgents } from '@/api';
import SvgIcon from '@/components/SvgIcon';
import { useAgentStore } from '@/stores/agent';
import { createStyles } from 'antd-style';
import { useCallback, useEffect, useRef, useState } from 'react';

export const useAgent = () => {
  const useStyle = createStyles(({ css }) => ({
    menu: css`
      height: 50px !important;
      width: 216px !important;
    `,
    activeMenu: css`
      height: 50px !important;
      width: 216px !important;
      background: #e6f4ff;
    `,
    menuItem: css`
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      height: 50px;
    `,
    menuItemContent: css`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 4px;
      flex: 1;
      padding: 6px 8px;
      overflow: hidden;
      & .title {
        color: var(--bmos-third-level-text-color);
        line-height: 18px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      & .desc {
        color: var(--bmos-fourth-level-text-color);
        font-size: 12px;
        line-height: 16px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `,
  }));
  const { styles } = useStyle();
  const { getAgent, agent } = useAgentStore();
  const activeAgentRef = useRef<string>('');
  const agentData = useRef<any>([]);
  const [activeAgent, setActiveAgent] = useState<string>('');
  const [agentMenuList, setAgentMenuList] = useState<MenuItem[]>([]);

  const setAgentMenuDataList = useCallback(() => {
    const agentList = agentData.current.map((item: any) => {
      return {
        key: item.id,
        label: (
          <div className={styles.menuItem}>
            <img src={item.icon_url} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
            <div className={styles.menuItemContent}>
              <span className="title">{item.name}</span>
              <span className="desc">{item.description}</span>
            </div>
            <SvgIcon name="ActiveStar" size={14}></SvgIcon>
          </div>
        ),
        className: activeAgentRef.current === item.id ? styles.activeMenu : styles.menu,
      };
    });
    setAgentMenuList(agentList);
  }, [agentData, styles, activeAgentRef]);

  useEffect(() => {
    const currentAgentId = getAgent().id as string;
    setActiveAgent(currentAgentId);
    activeAgentRef.current = currentAgentId; // 更新 ref 的值
  }, [agent, getAgent]);

  useEffect(() => {
    activeAgentRef.current = activeAgent; // 更新 ref 的值
    setAgentMenuDataList();
  }, [activeAgent, setAgentMenuDataList]);

  const getAgentList = async () => {
    try {
      if (activeAgentRef.current) {
        setActiveAgent(activeAgentRef.current as string);
      }
      const { data } = await getAgents();
      agentData.current = data;
      setAgentMenuDataList();
    }
    catch (_error) {
      setAgentMenuList([]);
    }
  };

  return { activeAgent, setActiveAgent, agentMenuList, getAgentList };
};
