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

type FolderData = {
  name: string;
  path: string;
  active: boolean;
}

const ImagesPage = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [folders, setFolders] = useState<FolderData[]>([])

  /**
   * Finds the default Images folder and create a new item
   * on the folders array
   */
  useEffect(() => {
    async function getPicturesFolder() {
      try {
        const result: string = await invoke('get_pictures_folder_path')
        setFolders([{name: "Images", path: result, active: true}])
      } catch (err) {
        console.error('Failed to fetch images', err)
      }
    }
    getPicturesFolder()
  }, [])

  /**
   * If folders variable is not empty,
   * loads images from active folder
   */
  useEffect(() => {
    if(folders.length > 0) {
      const active_folder = folders.find(item => item.active === true)
      if (active_folder) fetchImages(active_folder)
    }
  }, [folders])

  async function fetchImages(folder: FolderData) {
    try {
      const result: ImageData[] = await invoke('get_images_from_path', {dirPath: folder.path})
      setImages(result)
    } catch (err) {
      console.error('Failed to fetch images', err)
    }
  }

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