import React, { useState } from 'react';
import { ListUrl } from './Components/ListUrl/ListUrl';
import { Accueil } from './Components/Accueil/Accueil';
import { Items } from './Components/Items/Items';
import styles from "./style.module.css";

export function App() {
  const [activeComponent, setActiveComponent] = useState("AjoutSiteFrauduleux");

  const renderComponent = () => {
    switch (activeComponent) {
      case "AjoutSiteFrauduleux":
        return <Accueil key="accueil" />;
      case "SitesFrauduleux":
        return <ListUrl key="listUrl" />;
      default:
        return <Accueil key="default" />;
    }
  };

  return (
    <div className={styles.container}>
      <h1>BlockThat</h1>
      <main className={styles.main}>
        <Items setActiveComponent={setActiveComponent} />
        <div className={styles.main_div}>
          {renderComponent()}
        </div>
      </main>
    </div>
  );
}
