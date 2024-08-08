// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde_json::Value;
use tauri::{CustomMenuItem, SystemTrayMenu, SystemTrayMenuItem, SystemTray, SystemTrayEvent};
use tauri::Manager;
use tauri_plugin_store::StoreBuilder;
use std::process::Command;
use std::{env, fs};
use std::path::{Path, PathBuf};
use serde::{Deserialize, Serialize};
use std::ffi::OsString;
use std::os::windows::ffi::OsStrExt;
use winapi::um::winuser::{SystemParametersInfoW, SPI_SETDESKWALLPAPER, SPIF_UPDATEINIFILE, SPIF_SENDCHANGE};
use rand::seq::SliceRandom;

#[derive(Serialize, Debug)]
struct ImageData {
    name: String,
    path: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct Folder {
    name: String,
    path: String,
    active: bool,
}

/**
 * returns a list of images (jpg, png or jpeg) from a folder path
 */
#[tauri::command]
fn get_images_from_path(dir_path: String) -> Result<Vec<ImageData>, String> {
    let path = Path::new(&dir_path);

    if !path.is_dir() {
        return Err("The specified path is not a directory".to_string());
    }

    let mut images = Vec::new();

    for entry in fs::read_dir(path).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let path = entry.path();

        if let Some(ext) = path.extension() {
            if ext == "jpg" || ext == "png" || ext == "jpeg" {
                images.push(ImageData {
                    name: path.file_name().unwrap().to_string_lossy().to_string(),
                    path: path.to_string_lossy().to_string(),
                });
            }
        }
    }

    Ok(images)
}

/**
 * Windows and linux commands to change desktop wallpaper
 */
#[tauri::command]
fn set_wallpaper(path: &str) {
    let os = env::consts::OS;

    match os {
        "windows" => {
            let path_wide: Vec<u16> = OsString::from(path).encode_wide().chain(Some(0).into_iter()).collect();
            unsafe {
                SystemParametersInfoW(
                    SPI_SETDESKWALLPAPER,
                    0,
                    path_wide.as_ptr() as *mut _,
                    SPIF_UPDATEINIFILE | SPIF_SENDCHANGE,
                );
            }
        }
        "linux" => {
            let status = Command::new("gsettings")
                .arg("set")
                .arg("org.cinnamon.desktop.background")
                .arg("picture-uri")
                .arg(format!("file://{}", path))
                .status()
                .expect("Failed to set wallpaper using gsettings");

            if !status.success() {
                eprintln!("Failed to set wallpaper: gsettings command returned a non-zero status.");
            }
        }
        _ => {
            eprintln!("Unsupported OS: {}", os);
        }
    }
}

fn main() {
    // create tray menu
    let random = CustomMenuItem::new("random".to_string(), "Random");
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let tray_menu = SystemTrayMenu::new()
    .add_item(random)
    .add_native_item(SystemTrayMenuItem::Separator)
    .add_item(quit);

    let tray = SystemTray::new().with_menu(tray_menu);

    // app builder
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .system_tray(tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::DoubleClick {
              position: _,
              size: _,
              ..
            } => {
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
                window.set_focus().unwrap();
            }
            SystemTrayEvent::MenuItemClick { id, .. } => {
                match id.as_str() {
                    "quit" => {
                        if let Some(window) = app.get_window("main") {
                            window.close().unwrap();
                        }
                    }
                    "random" => {
                        // init store
                        let path = PathBuf::from("store_data.dat");
                        let mut store = StoreBuilder::new(app.app_handle(), path).build();
                        let _ = store.load();

                        // Get the currently active folder from the store
                        if let Some(folders) = store.get("folders") {
                            let active_folder = folders.as_array()
                                .and_then(|array| {
                                    array.iter()
                                        .find(|item| item.get("active") == Some(&Value::Bool(true)))
                                        .and_then(|item| item.get("path"))
                                        .and_then(Value::as_str)
                                        .map(|s| s.to_string())
                                });

                            if let Some(folder_path) = active_folder {
                                // Fetch images from the active folder path
                                match get_images_from_path(folder_path) {
                                    Ok(images) => {
                                        // Pick a random image from the returned images
                                        if let Some(random_image) = images.choose(&mut rand::thread_rng()) {
                                            set_wallpaper(&random_image.path)
                                        } else {
                                            println!("No images found in the active folder.");
                                        }
                                    }
                                    Err(e) => {
                                        println!("Error fetching images: {}", e);
                                    }
                                }
                            } else {
                                println!("No active folder path found.");
                            }
                        } else {
                            println!("No folders found in the store.");
                        }
                    }
                    _ => {}
                }
            }
            _ => {}
          })
        .invoke_handler(tauri::generate_handler![get_images_from_path, set_wallpaper])
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
              event.window().hide().unwrap();
              api.prevent_close();
            }
            _ => {}
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
