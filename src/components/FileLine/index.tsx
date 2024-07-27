import "./style.css"
import FolderIcon from '../icons/FolderIcon'

interface FileLineProps {
  active?: boolean,
  text: string,
}

const FileLine: React.FC<FileLineProps> = ({active = false, text}: FileLineProps) => {
  return (
    <div className={`file_line ${active ? "active" : ""}`}>
      <FolderIcon />
      <p>{text}</p>
    </div>
  )
}

export default FileLine;