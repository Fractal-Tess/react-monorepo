use tauri_specta::{collect_commands, ts};

#[tauri::command]
#[specta::specta]
fn greet(name: String) -> String {
  format!("Hello, {}! Welcome to Tauri.", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  let invoke_handler = {
    let builder = ts::builder().commands(collect_commands![greet]);

    #[cfg(debug_assertions)]
    let builder = builder.path("../src/lib/bindings.ts");

    builder.build().expect("failed to build specta invoke handler")
  };

  tauri::Builder::default()
    .invoke_handler(invoke_handler)
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
