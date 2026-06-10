/**
 * APK Parser Module
 * Handles extraction and parsing of APK files using JSZip
 */

import JSZip from "jszip";
import { parseAXML, parseManifestXML, ParsedManifest } from "./axml-parser";

// Constants
const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200 MB
const WARNING_FILE_SIZE = 100 * 1024 * 1024; // 100 MB
const MAX_STRINGS_TO_EXTRACT = 10000; // Cap string extraction for performance
const MAX_STRING_LENGTH = 500; // Max individual string length

export interface AnalysisProgress {
    step: "extract" | "manifest" | "permissions" | "secrets" | "trackers" | "complete";
    progress: number;
    message: string;
}

export interface ParseResult {
    manifest: ParsedManifest | null;
    manifestXml: string;
    strings: string[];
    fileList: string[];
    fileSize: number;
    fileName: string;
}

/**
 * Main APK Parser class
 */
export class ApkParser {
    file: File;
    onProgress: (progress: AnalysisProgress) => void;
    zip: JSZip | null;
    manifest: ParsedManifest | null;
    manifestXml: string;
    strings: string[];
    fileList: string[];

    constructor(file: File, onProgress?: (progress: AnalysisProgress) => void) {
        this.file = file;
        this.onProgress = onProgress || (() => { });
        this.zip = null;
        this.manifest = null;
        this.manifestXml = "";
        this.strings = [];
        this.fileList = [];
    }

    /**
     * Check file validity
     */
    validate() {
        if (!this.file) {
            throw new Error("No file provided");
        }

        if (!this.file.name.toLowerCase().endsWith(".apk")) {
            throw new Error("Invalid file type. Please upload an APK file.");
        }

        if (this.file.size > MAX_FILE_SIZE) {
            throw new Error(
                `File too large (${this.formatSize(this.file.size)}). Maximum size is 200 MB.`
            );
        }

        return {
            isLarge: this.file.size > WARNING_FILE_SIZE,
            size: this.file.size,
            formattedSize: this.formatSize(this.file.size),
        };
    }

    /**
     * Parse the APK file
     */
    async parse(): Promise<ParseResult> {
        this.onProgress({ step: "extract", progress: 0, message: "Loading APK..." });

        // Load ZIP
        const arrayBuffer = await this.file.arrayBuffer();
        const zip = new JSZip();
        this.zip = await zip.loadAsync(arrayBuffer);

        this.onProgress({
            step: "extract",
            progress: 25,
            message: "APK loaded, extracting files...",
        });

        // Get file list
        if (this.zip && this.zip.files) {
            this.fileList = Object.keys(this.zip.files);
        }

        this.onProgress({
            step: "manifest",
            progress: 30,
            message: "Parsing AndroidManifest.xml...",
        });

        // Parse manifest
        await this.parseManifest();

        this.onProgress({
            step: "permissions",
            progress: 50,
            message: "Analyzing permissions...",
        });

        // Extract strings for secrets detection
        this.onProgress({
            step: "secrets",
            progress: 60,
            message: "Extracting strings for analysis...",
        });
        await this.extractStrings();

        this.onProgress({
            step: "trackers",
            progress: 80,
            message: "Detecting trackers...",
        });

        // Analysis complete
        this.onProgress({
            step: "complete",
            progress: 100,
            message: "Analysis complete!",
        });

        return {
            manifest: this.manifest,
            manifestXml: this.manifestXml,
            strings: this.strings,
            fileList: this.fileList,
            fileSize: this.file.size,
            fileName: this.file.name,
        };
    }

    /**
     * Parse AndroidManifest.xml
     */
    async parseManifest() {
        if (!this.zip) throw new Error("ZIP not loaded");

        const manifestFile = this.zip.file("AndroidManifest.xml");
        if (!manifestFile) {
            throw new Error("AndroidManifest.xml not found in APK");
        }

        const manifestBuffer = await manifestFile.async("arraybuffer");

        try {
            // Try to parse as binary AXML
            this.manifestXml = parseAXML(manifestBuffer);
        } catch (error: unknown) {
            // Fallback: try as plain text (unlikely but possible)
            try {
                const textDecoder = new TextDecoder("utf-8");
                this.manifestXml = textDecoder.decode(manifestBuffer);

                // Check if it's valid XML
                if (!this.manifestXml.includes("<?xml")) {
                    throw new Error("Invalid manifest format");
                }
            } catch {
                const errorMessage = error instanceof Error ? error.message : String(error);
                throw new Error("Failed to parse AndroidManifest.xml: " + errorMessage);
            }
        }

        // Parse to object
        this.manifest = parseManifestXML(this.manifestXml);
    }

    /**
     * Extract strings from resources and other files
     */
    async extractStrings() {
        if (!this.zip) return;

        const strings = new Set<string>();
        let processedCount = 0;

        // Files to check for strings
        const targetFiles = this.fileList.filter((name) => {
            const lower = name.toLowerCase();
            return (
                (lower.includes("res/values") && lower.endsWith(".xml")) ||
                lower.endsWith(".properties") ||
                lower.endsWith(".json") ||
                lower === "assets/config.json" ||
                (lower.includes("assets/") &&
                    (lower.endsWith(".json") || lower.endsWith(".txt")))
            );
        });

        // Also check classes.dex for strings (limited)
        const dexFiles = this.fileList.filter((name) => name.endsWith(".dex"));

        // Process XML/text files
        for (const fileName of targetFiles) {
            if (strings.size >= MAX_STRINGS_TO_EXTRACT) break;

            try {
                const file = this.zip.file(fileName);
                if (!file) continue;

                let content;
                const buffer = await file.async("arraybuffer");

                // Try AXML first for XML files in res/values
                if (fileName.includes("res/values") && fileName.endsWith(".xml")) {
                    try {
                        content = parseAXML(buffer);
                    } catch {
                        content = new TextDecoder("utf-8", { fatal: false }).decode(buffer);
                    }
                } else {
                    content = new TextDecoder("utf-8", { fatal: false }).decode(buffer);
                }

                // Extract strings using regex
                this.extractStringsFromContent(content, strings);
            } catch {
                // Skip files that can't be read
            }

            processedCount++;
            if (processedCount % 10 === 0 && targetFiles.length > 0) {
                this.onProgress({
                    step: "secrets",
                    progress: 60 + (processedCount / targetFiles.length) * 15,
                    message: `Extracting strings (${strings.size} found)...`,
                });
            }
        }

        // Extract strings from DEX files (limited for performance)
        for (const dexName of dexFiles) {
            if (strings.size >= MAX_STRINGS_TO_EXTRACT) break;

            try {
                const dexFile = this.zip.file(dexName);
                if (!dexFile) continue;

                const buffer = await dexFile.async("arraybuffer");
                this.extractStringsFromDex(buffer, strings);
            } catch {
                // Skip on error
            }
        }

        this.strings = Array.from(strings);
    }

    /**
     * Extract strings from text content
     */
    extractStringsFromContent(content: string, strings: Set<string>) {
        // Extract quoted strings
        const quotedRegex = /["']([^"']{4,}?)["']/g;
        let match;
        while (
            (match = quotedRegex.exec(content)) !== null &&
            strings.size < MAX_STRINGS_TO_EXTRACT
        ) {
            const str = match[1].trim();
            if (str.length <= MAX_STRING_LENGTH && this.isInterestingString(str)) {
                strings.add(str);
            }
        }

        // Extract URLs
        const urlRegex = /https?:\/\/[^\s<>"']+/g;
        while (
            (match = urlRegex.exec(content)) !== null &&
            strings.size < MAX_STRINGS_TO_EXTRACT
        ) {
            strings.add(match[0]);
        }

        // Extract from XML string values
        const xmlValueRegex = />([^<>]{8,500})</g;
        while (
            (match = xmlValueRegex.exec(content)) !== null &&
            strings.size < MAX_STRINGS_TO_EXTRACT
        ) {
            const str = match[1].trim();
            if (this.isInterestingString(str)) {
                strings.add(str);
            }
        }
    }

    /**
     * Extract ASCII strings from DEX file
     */
    extractStringsFromDex(buffer: ArrayBuffer, strings: Set<string>) {
        const uint8 = new Uint8Array(buffer);
        let currentString = "";
        const minLength = 8;

        // Simple ASCII string extraction
        for (
            let i = 0;
            i < uint8.length && strings.size < MAX_STRINGS_TO_EXTRACT;
            i++
        ) {
            const byte = uint8[i];

            // Printable ASCII range
            if (byte >= 32 && byte <= 126) {
                currentString += String.fromCharCode(byte);
            } else {
                if (
                    currentString.length >= minLength &&
                    currentString.length <= MAX_STRING_LENGTH
                ) {
                    if (this.isInterestingString(currentString)) {
                        strings.add(currentString);
                    }
                }
                currentString = "";
            }
        }

        if (
            currentString.length >= minLength &&
            currentString.length <= MAX_STRING_LENGTH &&
            this.isInterestingString(currentString)
        ) {
            strings.add(currentString);
        }
    }

    /**
     * Check if a string is interesting for security analysis
     */
    isInterestingString(str: string): boolean {
        if (!str || str.length < 4) return false;

        // Skip common UI strings, whitespace-only, etc.
        if (/^[\s\d.]+$/.test(str)) return false;
        if (
            /^(OK|Cancel|Yes|No|Error|Warning|Info|null|true|false)$/i.test(str)
        )
            return false;

        // Keep if it looks like:
        // - API key/token pattern
        // - URL
        // - Base64
        // - Contains special keywords
        const interesting =
            (str.length >= 16 && /^[A-Za-z0-9+/=_-]+$/.test(str)) || // Possible key/token
            str.includes("://") || // URL
            str.includes("key") ||
            str.includes("secret") ||
            str.includes("password") ||
            str.includes("token") ||
            str.includes("api") ||
            str.includes("auth") ||
            str.startsWith("AKIA") ||
            str.startsWith("AIza") || // AWS/Google keys
            str.includes("firebase") ||
            str.includes("amazonaws.com");

        return interesting;
    }

    /**
     * Format file size
     */
    formatSize(bytes: number): string {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    }

    /**
     * Get detected package names from file paths
     */
    getPackageHints(): string[] {
        const packages = new Set<string>();

        for (const filePath of this.fileList) {
            // Look for smali files (even though we can't fully decompile)
            if (filePath.startsWith("smali/")) {
                const parts = filePath.replace("smali/", "").split("/");
                if (parts.length >= 2) {
                    const pkg = parts.slice(0, -1).join(".");
                    if (pkg && !pkg.startsWith("android") && !pkg.startsWith("kotlin")) {
                        packages.add(pkg);
                    }
                }
            }
        }

        return Array.from(packages);
    }
}
