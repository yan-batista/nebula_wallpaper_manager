import { useState } from "react";
import MinusIcon from "../../components/icons/MinusIcon";
import PlusIcon from "../../components/icons/PlusIcon";
import Switch from "../../components/Switch";
import "./style.css"

const SettingsPage = () => {
  const [delay, setDelay] = useState<number>(10);
  
function increaseDelay() {
  setDelay(prevState => prevState + 1)
}

function decreaseDelay() {
  setDelay(prevState => prevState--)
}

function onChangeDelay(event: React.ChangeEvent<HTMLInputElement>) {
  setDelay(Number(event.currentTarget.value))
}

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
          <input type="text" value={delay} onChange={onChangeDelay}/>
          <MinusIcon action={decreaseDelay}/>
          <PlusIcon action={increaseDelay}/>
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