import MinusIcon from "../../components/icons/MinusIcon";
import PlusIcon from "../../components/icons/PlusIcon";
import Switch from "../../components/Switch";
import "./style.css"

const SettingsPage = () => {
  return(
    <div className="settings">
      <div className="setting_container">
        <p>Select random on startup</p>
        <Switch />
      </div>

      <div className="setting_container">
        <p>Play background as slideshow</p>
        <Switch />
      </div>

      <div className="setting_container">
        <p>Delay (min)</p>
        <div className="delay_options">
          <input type="text" defaultValue={10}/>
          <MinusIcon />
          <PlusIcon />
        </div>
      </div>

      <div className="setting_container">
        <p>Play in random order</p>
        <Switch />
      </div>
    </div>
  )
}

export default SettingsPage;