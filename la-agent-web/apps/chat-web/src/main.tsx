import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import MyApp from './App';
import './index.css';
import '@ant-design/v5-patch-for-react-19';
import './styles/css.less'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MyApp />
  </StrictMode>,
);
