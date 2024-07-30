import { ImageData } from "../types/types"

/**
 * Uses the images array to find the current active image index
 */
export default function find_currently_active_image(images: ImageData[], activeImagePath: string) {
  let active_image_index: number = 0
  if(activeImagePath) {
    active_image_index = images.findIndex(image => image.path === activeImagePath)
  }
  return active_image_index
}