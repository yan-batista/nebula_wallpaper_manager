import { useEffect, useState } from "react";
import { Store } from "tauri-plugin-store-api";
import MinusIcon from "../../components/icons/MinusIcon";
import PlusIcon from "../../components/icons/PlusIcon";
import Switch from "../../components/Switch";
import "./style.css"

interface SettingsType {
  random: boolean,
  slideshow: boolean,
  delay: number,
  random_slideshow: boolean
}

interface SettingsPageProps {
  store: Store
}

const SettingsPage: React.FC<SettingsPageProps> = ({store}: SettingsPageProps) => {
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
  
  function onClickToggleRandom() {
    setSettings(prevState => ({...prevState, random: !settings.random}))
    store.set('settings', {...settings, random: !settings.random})
  }

  function onClickToggleSlideshow() {
    setSettings(prevState => ({...prevState, slideshow: !settings.slideshow}))
    store.set('settings', {...settings, slideshow: !settings.slideshow})
  }

  function increaseDelay() {
    let new_delay = settings.delay + 1
    setSettings(prevState => ({...prevState, delay: new_delay}))
    store.set('settings', {...settings, delay: new_delay})
  }

  function decreaseDelay() {
    let new_delay = settings.delay - 1
    if(new_delay < 0) new_delay = 0
    setSettings(prevState => ({...prevState, delay: new_delay}))
    store.set('settings', {...settings, delay: new_delay})
  }

  function onChangeDelay(event: React.ChangeEvent<HTMLInputElement>) {
    setSettings( {...settings, delay: Math.abs(Number(event.currentTarget.value))} )
    store.set('settings', {...settings, delay: Math.abs(Number(event.currentTarget.value))})
  }

  function onClickToggleSlideshowOrder() {
    setSettings(prevState => ({...prevState, random_slideshow: !settings.random_slideshow}))
    store.set('settings', {...settings, random_slideshow: !settings.random_slideshow})
  }

  return(
    <div className="settings">
      <div className="setting_container">
        <p>Select random on startup</p>
        <Switch active={settings.random} action={onClickToggleRandom}/>
      </div>

      <div className="setting_container">
        <p>Play background as slideshow</p>
        <Switch active={settings.slideshow} action={onClickToggleSlideshow}/>
      </div>

      <div className={`setting_container ${settings.slideshow ? "" : "setting_disabled"}`}>
        <p>Delay (min)</p>
        <div className="delay_options">
          <input 
            id="delay_input" 
            type="number"
            min="0"
            value={settings.delay} 
            onChange={onChangeDelay} 
            disabled={!settings.slideshow}
          />
          <MinusIcon action={decreaseDelay}/>
          <PlusIcon action={increaseDelay}/>
        </div>
      </div>

      <div className={`setting_container ${settings.slideshow ? "" : "setting_disabled"}`}>
        <p>Play in random order</p>
        <Switch active={settings.random_slideshow} action={onClickToggleSlideshowOrder}/>
      </div>
    </div>
  )
}

export default SettingsPage;