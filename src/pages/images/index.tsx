import PlusIcon from "../../components/icons/PlusIcon"
import MinusIcon from "../../components/icons/MinusIcon"
import FileLine from "../../components/FileLine/index";
import ImageDisplay from "../../components/ImageDisplay/ImageDisplay";
import "./style.css"
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";

type ImageData = {
  name: string;
  path: string;
}

const ImagesPage = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  
  useEffect(() => {
    async function fetchImages() {
      try {
        const result: ImageData[] = await invoke('get_images_from_path', {dirPath: 'C:\\Users\\ybati\\Imagens\\Imagens\\wallpapers'})
        setImages(result)
      } catch (err) {
        console.error('Failed to fetch images', err)
      }
    }

    fetchImages();
  }, []);

  return (
    <>
        <div className="files_container">
          <div className="files">
            <FileLine text="file_name" active/>
          </div>
          <div className="buttons">
            <MinusIcon />
            <PlusIcon />
          </div>
        </div>
        <div className="images_container">
          {images.map(image => <ImageDisplay name={image.name} image_path={image.path} key={image.path}/>)}
        </div>
  </>
  )
}

export default ImagesPage;