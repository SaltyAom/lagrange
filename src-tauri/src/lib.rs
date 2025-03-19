use tauri::{Manager, TitleBarStyle, WebviewUrl, WebviewWindowBuilder, WindowEvent};
use traffic::UnsafeWindowHandle;

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

mod traffic;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(traffic::init())
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
