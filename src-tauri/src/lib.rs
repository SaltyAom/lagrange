use tauri::{Manager, WindowEvent};
use traffic::UnsafeWindowHandle;

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

mod traffic;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(traffic::init())
        .invoke_handler(tauri::generate_handler![greet])
        // .setup(|app| {
        //    	let window = app.get_webview_window("main").unwrap();
        //    	let ns_window = window.ns_window().unwrap() as cocoa::base::id;
        //    	setup_traffic_light_positioner(window, 15.0, 18.0);
        //     Ok(())
        // })
        .on_window_event(|app, event| {
            let apply_offset = || {
                let window = app.get_webview_window("main").unwrap();
                traffic::position_traffic_lights(
                    UnsafeWindowHandle(window.ns_window().expect("Failed to create window handle")),
                    13.0,
                    16.0,
                );
            };

            match event {
                WindowEvent::ThemeChanged(..) => apply_offset(),
                _ => {}
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
