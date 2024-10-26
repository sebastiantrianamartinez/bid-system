import React from "react";

import './styles/header.css';

function Header({title, children}) {
    const logo = 'https://cdn.trianametria.com/media/images/manantiales.png';
    return (
        <>
            <header className="app-header">
                <img src={logo} alt="" />
            </header>
            <div className="app-main">
                <h1>{title}</h1>
                {children}
            </div>
            
        </>
        
    );
}

export default Header;