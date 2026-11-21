import React from 'react';
import './Layout.css';

export const Layout = (props) => (
    <div className="site-layout">
        {props.children}
    </div>
);

export default Layout;
