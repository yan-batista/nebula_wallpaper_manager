// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::path::Path;
use serde::Serialize;

#[derive(Serialize)]
struct ImageData {
    name: String,
    path: String,
}

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

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![get_images_from_path])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
