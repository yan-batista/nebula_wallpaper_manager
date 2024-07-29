import PlusIcon from "../../components/icons/PlusIcon"
import MinusIcon from "../../components/icons/MinusIcon"
import FileLine from "../../components/FileLine/index";
import ImageDisplay from "../../components/ImageDisplay/ImageDisplay";
import "./style.css"
import { open } from '@tauri-apps/api/dialog';
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";
import { Store } from "tauri-plugin-store-api";

type ImageData = {
  name: string;
  path: string;
}

type FolderData = {
  name: string;
  path: string;
  active: boolean;
}

interface ImagePageProps {
  store: Store
}

const ImagesPage: React.FC<ImagePageProps> = ({store}: ImagePageProps) => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [folders, setFolders] = useState<FolderData[]>([])

  useEffect(() => {
    async function getStoredFolders() {
      let stored_folders: FolderData[] | null = folders
      try {
        stored_folders = await store.get<FolderData[]>("folders")
      } catch(err) {
        console.error(err)
      } finally {
        if (stored_folders) setFolders(stored_folders)
      }
    }
    getStoredFolders()
  }, []);

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

  console.log(folders)

  /**
   * Sends the image path to the rust function that handles local image loading 
   */
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

      const isFolderAlreadyOpen = (selectedPath: string): boolean => {
        const isOpen = folders.filter(folder => folder.path === selectedPath)
        if (isOpen.length > 0) return true
        else return false
      }
  
      // If folder is not open, load it
      if (selectedPath && typeof(selectedPath) === 'string' && !isFolderAlreadyOpen(selectedPath)) {
        const folder_name = selectedPath.split("\\")
        const new_folder: FolderData = {
          name: folder_name[folder_name.length-1],
          path: selectedPath,
          active: true,
        }
        setFolders(prevState => [...prevState, new_folder])
        store.set('folders', [...folders, new_folder])
      // if folder is already open, just set it to active and fetch images
      } else if(selectedPath && typeof(selectedPath) === 'string' && isFolderAlreadyOpen(selectedPath)) {
          setFolders(prevState => {
            const new_folders = prevState.map(prev => {
              if (selectedPath === prev.path) {
                return {...prev, active: true}
              } else {
                return {...prev, active: false}
              }
            })
            store.set('folders', new_folders)
            return new_folders
          })
      }
    } catch (err) {
      console.error('Failed to select directory', err);
    }
  }

  /**
   * Removes the currently active folder
   */
  function removeActiveDirectory() {
    const filtered_folders = folders.filter(folder => !folder.active)
    setFolders(filtered_folders)
    store.set('folders', filtered_folders)
  }

  /**
   * Sets "active" property of FolderData in Folders state to true
   * if clicked on the folder on the list
   */
  function onClickUpdateActive(event: React.MouseEvent<HTMLDivElement>) {
    const target = event.currentTarget.dataset.path
    setFolders(prevState => {
      const new_folders = prevState.map(prev => {
        if (target === prev.path) {
          return {...prev, active: true}
        } else {
          return {...prev, active: false}
        }
      })
      store.set('folders', new_folders)
      return new_folders
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