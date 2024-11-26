import React from 'react';
import './style.css'

export function Items({ setActiveComponent }) {
    const handleClick = (componentName) => {
        console.log(`Changing active component to: ${componentName}`);
        setActiveComponent(componentName);
    };

    return (
        <nav>
            <button onClick={() => handleClick("AjoutSiteFrauduleux")}>Ajout site frauduleux</button>
            <button onClick={() => handleClick("SitesFrauduleux")}>Sites frauduleux</button>
        </nav>
    );
}
