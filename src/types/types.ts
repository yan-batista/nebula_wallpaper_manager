export interface ImageData {
  name: string;
  path: string;
}

export interface FolderData {
  name: string;
  path: string;
  active: boolean;
}

export interface SettingsType {
  random: boolean,
  slideshow: boolean,
  delay: number,
  random_slideshow: boolean
}

