# APK Auditor

APK Auditor is a client-side web app for running OWASP MASVS-aligned static security checks on Android APKs without uploading files.

## Features

- 34 MASVS v2.1-aligned static security checks for Android APKs.
- Detects dangerous permissions, hardcoded secrets, and embedded tracker SDKs.
- Flags risky manifest settings like debuggable builds, cleartext traffic, and exported components.
- Generates downloadable PDF security reports with severity summaries.
- 100% client-side analysis with offline-friendly behavior after initial load.

## Installation

### Prerequisites

- Node.js 20+ (recommended)
- npm (ships with Node.js)

### Clone the repository

```bash
git clone https://github.com/therayyanawaz/apkauditor.git
cd apkauditor
```

### Install dependencies

```bash
npm install
```

## Usage

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scan an APK

1. Navigate to the scanner at `/app` (or click **Open Scanner** from the homepage).
2. Drag and drop an `.apk` file into the dropzone (or click to browse).
3. Review findings across Permissions, Secrets, Trackers, and Manifest tabs.
4. Export a PDF report from the results screen.

### Build and run for production

```bash
npm run build
npm run start
```

No additional configuration is required for local scans—analysis happens in the browser using the File API.

## Contributing

Contributions are welcome! If you plan to make larger changes, please open an issue to discuss your proposal first.

- Fork the repository
- Create a feature branch
- Submit a pull request describing your changes

If a `CONTRIBUTING.md` file is added, follow the guidelines there.

## License

MIT License. See [LICENSE](LICENSE) for details.

## Contact

For questions or support, open an issue in the repository.
