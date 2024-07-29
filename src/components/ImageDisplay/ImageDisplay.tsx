import { invoke } from '@tauri-apps/api'
import ImageFileIcon from '../icons/ImageFile'
import "./style.css"

interface ImageDisplayProps {
  name: string,
  image_path?: string,
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({name, image_path = ""}: ImageDisplayProps) => {
  async function change_wallpaper() {
    try {
      await invoke('set_wallpaper', {path: image_path})
    } catch (err) {
      console.error('Failed to fetch images', err)
    }
  }

  return (
    <div className="image_display" onClick={change_wallpaper}>
      {image_path == "" ? <ImageFileIcon /> : <img src={window.__TAURI__.convertFileSrc(image_path, "asset")} className="thumbnail" loading="lazy"/>}
      <p>{name}</p>
    </div>
  )
}

export default ImageDisplay;