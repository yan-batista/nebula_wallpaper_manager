import "./style.css"
import FolderIcon from '../icons/FolderIcon'

interface FileLineProps {
  active?: boolean,
  text: string,
  path: string,
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void
}

const FileLine: React.FC<FileLineProps> = ({active = false, text, onClick, path}: FileLineProps) => {
  return (
    <div className={`file_line ${active ? "active" : ""}`} onClick={onClick} data-path={path}>
      <FolderIcon />
      <p>{text}</p>
    </div>
  )
}

export default FileLine;