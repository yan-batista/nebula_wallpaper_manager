import PlusIcon from "../../components/icons/PlusIcon"
import MinusIcon from "../../components/icons/MinusIcon"
import FileLine from "../../components/FileLine/index";
import ImageDisplay from "../../components/ImageDisplay/ImageDisplay";
import "./style.css"
import { open } from '@tauri-apps/api/dialog';
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

  /**
   * Whenever the user clicks on the + button, it opens a dialog
   * to select a folder/directory. When selected, it stores the path
   * in the folders array state.
   */
  async function selectDirectory() {
    try {
      const selectedPath = await open({
        directory: true,
        multiple: false,
        title: 'Select a Directory'
      });
  
      if (selectedPath && typeof(selectedPath) === 'string') {
        const folder_name = selectedPath.split("\\")
        const new_folder: FolderData = {
          name: folder_name[folder_name.length-1],
          path: selectedPath,
          active: false,
        }
        setFolders(prevState => [...prevState, new_folder])
      }
    } catch (err) {
      console.error('Failed to select directory', err);
    }
  }

  /**
   * Removes the currently active folder
   */
  function removeActiveDirectory() {
      setFolders(prevState => prevState.filter(prev => !prev.active))
  }

  /**
   * Sets "active" property of FolderData in Folders state to true
   * if clicked on the folder on the list
   */
  function onClickUpdateActive(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.currentTarget.dataset.path
    setFolders(prevState => {
      return prevState.map(prev => {
        if (target === prev.path && !prev.active) {
          return {...prev, active: true}
        } else {
          return {...prev, active: false}
        }
      })
    })
  }

  return (
    <>
        <div className="files_container">
          <div className="files">
            {folders.length > 0 ? (
              folders.map(folder => <FileLine text={folder.name} key={folder.path} path={folder.path} active={folder.active} onClick={onClickUpdateActive}/>)
            ) : ""}
          </div>
          <div className="buttons">
            <MinusIcon action={removeActiveDirectory}/>
            <PlusIcon action={selectDirectory}/>
          </div>
        </div>
        <div className="images_container">
          {images.length > 0 ? (
            images.map(image => <ImageDisplay name={image.name} image_path={image.path} key={image.path}/>
          )) : (
            <div className="images_container_message">
              <p>Select a folder to load images.</p>
            </div>
          )}
        </div>
  </>
  )
}

export default ImagesPage;