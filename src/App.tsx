import { useEffect, useState } from "react";
import ImagesPage from "./pages/images"
import SettingsPage from "./pages/settings";
import "./App.css";
import { Store } from "tauri-plugin-store-api";

interface SettingsType {
  random: boolean,
  slideshow: boolean,
  delay: number,
  random_slideshow: boolean
}

function App() {
  const [isActive, setIsActive] = useState<boolean>(true);
  const [store, _] = useState<Store>(new Store("store_data.dat"))
  const [settings, setSettings] = useState<SettingsType>({
    random: false,
    slideshow: false,
    delay: 10,
    random_slideshow: false
  })

  useEffect(() => {
    async function getStoredSettings() {
      let stored_settings: SettingsType | null = settings
      try {
        stored_settings = await store.get<SettingsType>("settings")
      } catch(err) {
        console.error(err)
      } finally {
        if (stored_settings) setSettings(stored_settings)
      }
    }

    getStoredSettings()
  }, [])

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
          <ImagesPage store={store} settings={settings}/>
      </div>

      <div className={`content ${isActive ? "hidden_page" : ""}`}>
          <SettingsPage store={store} settings={settings} setSettings={setSettings}/>
      </div>
    </>
  );
}

export default App;
