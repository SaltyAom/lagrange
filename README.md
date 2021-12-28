# Lagrange
A simple API client for a simple task.

<img width="1073" alt="Screen Shot 2564-12-26 at 22 55 29" src="https://user-images.githubusercontent.com/35027979/147413526-6ad05421-fd00-471f-8799-7a66b76ff2c1.png">

# Build from source
If release tab doesn't have what you need or you prefer to build Lagrange form source, please follow the instruction below.

## Prerequisted
- Node.js
- Rust
- [Tauri](https://tauri.studio/en/docs/getting-started/intro#setting-up-your-environment)
- gcc (For compiling C++ linked library)
- yarn (optional)
- Webview 2 (Windows)

## Build
1. Clone repo
```bash
git clone https://github.com/saltyaom/lagrange && cd lagrange
```

2. Install dependency
Install frontend dependency and CLI for bundling
```bash
yarn
```

3. Build
Run build command and wait for output usually takes around 3-4 minute on the first build for average computer
```
yarn tauri build
```

4. Output
Built should now be available in `src-tauri/target/release` and there should be executable base on your current OS you built.
```bash
cd src-tauri/target/release
```
