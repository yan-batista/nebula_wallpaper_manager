import { useState } from "react";
import ImagesPage from "./pages/images"
import SettingsPage from "./pages/settings";
import "./App.css";
import { Store } from "tauri-plugin-store-api";


function App() {
  const [isActive, setIsActive] = useState<boolean>(true);
  const [store, _] = useState<Store>(new Store("store_data.dat"))

  function onClickActivateImages() {
    setIsActive(true)
  }

  function onClickActivateSettings() {
    setIsActive(false)
  }

  return (
    <>
      <header>
        <p className={`${isActive ? "window_active" : ""}`} onClick={onClickActivateImages}>Images</p>
        <p className={`${isActive ? "" : "window_active"}`} onClick={onClickActivateSettings}>Settings</p>
      </header>

      <div className={`content ${isActive ? "" : "hidden_page"}`}>
          <ImagesPage store={store} />
      </div>

      <div className={`content ${isActive ? "hidden_page" : ""}`}>
          <SettingsPage store={store} />
      </div>
    </>
  );
}

export default App;
