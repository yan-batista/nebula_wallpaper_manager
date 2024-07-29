import "./style.css"

interface SwitchProps {
  action: () => void
  active: boolean
  disabled?: boolean
}

const Switch: React.FC<SwitchProps> = ({action, active, disabled}: SwitchProps) => {
  return(
    <div className={`switch_container ${active ? "switch_active" : ""}`} onClick={() => {
      if(!disabled) {
        action()
      }
    }}>
      <div className="bar"></div>
      <div className="circle"></div>
    </div>
  )
}

export default Switch;