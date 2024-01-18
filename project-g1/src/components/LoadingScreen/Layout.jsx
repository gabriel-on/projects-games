import React from 'react';
import LoadingScreen from './LoadingScreen';

const Layout = ({ children, loading }) => {
  return (
    <div className="layout">
      <LoadingScreen visible={loading} />
      {children}
    </div>
  );
};

export default Layout;
