import "./style.css"

interface SwitchProps {
  action: () => void
  active: boolean
}

const Switch: React.FC<SwitchProps> = ({action, active}: SwitchProps) => {
  return(
    <div className={`switch_container ${active ? "switch_active" : ""}`} onClick={action}>
      <div className="bar"></div>
      <div className="circle"></div>
    </div>
  )
}

export default Switch;