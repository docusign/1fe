import { Layout, Menu } from 'antd';
import { Route, Routes, useNavigate } from 'react-router-dom';

import { Home } from './routes/home';
import { UtilsDemo } from './routes/utilsDemo';
import { WidgetProps } from '../contract';

/**
 * Suggestion: setup the top level routing for your application here
 */
export const Router: React.FC<WidgetProps> = (props) => {
  const navigate = useNavigate();

  // const t = useTranslate();

  const { Header } = Layout;

  return (
    <>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          display: 'contents',
          alignItems: 'center',
        }}
      >
        <Menu
          theme='light'
          mode='horizontal'
          defaultSelectedKeys={['0']}
          items={[
            {
              key: 'HOME',
              label: 'Home',
              onClick: () => navigate('/app1'),
              // 'data-qa': 'wsk.header.button.home',
            },
            {
              key: 'UTILS',
              label: 'Utils',
              onClick: () => navigate('/app1/utils'),
              // 'data-qa': 'wsk.header.button.utils',
            },
          ]}
          style={{
            flex: 1,
            minWidth: 0,
          }}
        />
      </Header>
      <Routes>
        <Route path='/' element={<Home {...props} />} />
        <Route path='/utils' element={<UtilsDemo />} />
        <Route path='/*' element={<h1>{'404'}</h1>} />
      </Routes>
    </>
  );
};
