#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::{Menu, MenuItem, Submenu};

mod command;

fn main() {
  let app = Menu::new().add_native_item(MenuItem::Hide)
      .add_native_item(MenuItem::Quit);

  let edit = Menu::new()
    .add_native_item(MenuItem::Undo)
    .add_native_item(MenuItem::Redo)
    .add_native_item(MenuItem::Separator)
    .add_native_item(MenuItem::Cut)
    .add_native_item(MenuItem::Copy)
    .add_native_item(MenuItem::Paste)
    .add_native_item(MenuItem::SelectAll)
    .add_native_item(MenuItem::Undo)
    .add_native_item(MenuItem::Redo);

  let menu = Menu::new()
    .add_submenu(Submenu::new("Lagrange", app))
    .add_submenu(Submenu::new("Edit", edit));

  let app = tauri::Builder::default().menu(menu);

  app
    // .invoke_handler(tauri::generate_handler![format_json_string])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
