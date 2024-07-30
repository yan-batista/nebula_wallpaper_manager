import MinusIcon from "../../components/icons/MinusIcon";
import PlusIcon from "../../components/icons/PlusIcon";
import Switch from "../../components/Switch";
import { SettingsType } from "../../types/types";
import "./style.css"
import { Store } from "tauri-plugin-store-api";

interface SettingsPageProps {
  store: Store
  settings: SettingsType
  setSettings: React.Dispatch<React.SetStateAction<SettingsType>>
}

const SettingsPage: React.FC<SettingsPageProps> = ({store,settings, setSettings}: SettingsPageProps) => {
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
          <MinusIcon action={decreaseDelay} disabled={!settings.slideshow} />
          <PlusIcon action={increaseDelay} disabled={!settings.slideshow} />
        </div>
      </div>

      <div className={`setting_container ${settings.slideshow ? "" : "setting_disabled"}`}>
        <p>Play in random order</p>
        <Switch active={settings.random_slideshow} action={onClickToggleSlideshowOrder} disabled={!settings.slideshow}/>
      </div>
    </div>
  )
}

export default SettingsPage;