import React, { useEffect } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import LayoutHeader from '@/components/LayoutHeader';
import { useRouteStore } from '@/stores/routeStore';
import { getStoredToken } from '@/utils/token';
import Menu from './Menu';

const Main: React.FC = () => {
  const location = useLocation();
  const params = useParams();
  const token = getStoredToken();

  const setCurrentRoute = useRouteStore(state => state.setCurrentRoute);

  const [pageBackground, setPageBackground] = React.useState('');

  // 监听路由变化，更新 Zustand 状态
  useEffect(() => {
    setCurrentRoute(location, params);
    // 如果路由是 /history，将页面背景改为蓝色
    if (location.pathname === '/history') {
      setPageBackground('linear-gradient(257deg, #F2FAFF 9.57%, #EBF1FF 87.38%)');
    }
    else {
      setPageBackground('#fff');
    }
  }, [location, params, setCurrentRoute]);
  return (
    <div style={{ height: '100%', width: '100%', background: pageBackground }}>
      <LayoutHeader />
      <div style={{ height: 'calc(100% - 50px)' }}>
        {token && <Menu />}
        <Outlet />
      </div>
    </div>
  );
};

export default Main;
