import { useState } from "react";
import "./style.css"

const Switch = () => {
  const [switchActive, setSwitchActive] = useState<boolean>(false)

  function toggleSwitch() {
    setSwitchActive(prevState => !prevState)
  }

  return(
    <div className={`switch_container ${switchActive ? "switch_active" : ""}`} onClick={toggleSwitch}>
      <div className="bar"></div>
      <div className="circle"></div>
    </div>
  )
}

export default Switch;