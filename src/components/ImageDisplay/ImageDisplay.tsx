import ImageFileIcon from '../icons/ImageFile'
import "./style.css"

interface ImageDisplayProps {
  name: string,
  image_path?: string,
  action: () => void,
  active: boolean,
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({name, image_path = "", action, active}: ImageDisplayProps) => {
  return (
    <div className={`image_display ${active ? "active_image_display": ""}`} onClick={action}>
      {image_path == "" ? <ImageFileIcon /> : <img src={window.__TAURI__.convertFileSrc(image_path, "asset")} className="thumbnail" loading="lazy"/>}
      <p>{name}</p>
    </div>
  )
}

export default ImageDisplay;