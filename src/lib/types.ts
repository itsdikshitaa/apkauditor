/**
 * APK Auditor Type Definitions
 */

// ─── Checks & Rules ───────────────────────────────────────────────

export type SeverityLevel = "critical" | "high" | "medium" | "low" | "info";
export type CheckCategory = "permissions" | "secrets" | "manifest";
export type CheckType = "permission" | "regex" | "manifest";

export interface SecurityCheck {
    id: string;
    category: CheckCategory;
    type: CheckType;
    pattern: string;
    title: string;
    description: string;
    masvs: string;
    severity: SeverityLevel;
    remediation: string;
}

export interface ChecksData {
    version: string;
    lastUpdated: string;
    checks: SecurityCheck[];
}

// ─── Trackers ──────────────────────────────────────────────────────

export interface Tracker {
    id: string;
    name: string;
    company: string;
    category: string;
    packages: string[];
    website?: string;
}

export interface TrackersData {
    trackers: Tracker[];
}

// ─── APK Parser ───────────────────────────────────────────────────

export interface IntentData {
    scheme?: string;
    host?: string;
    path?: string;
    pathPrefix?: string;
    pathPattern?: string;
    mimeType?: string;
}

export interface IntentFilter {
    actions: string[];
    categories: string[];
    data: IntentData[];
}

export interface Component {
    name: string;
    type: "activity" | "service" | "receiver" | "provider";
    exported: boolean;
    permission?: string;
    intentFilters?: IntentFilter[];
}

export interface ParsedManifest {
    package?: string;
    versionName?: string;
    versionCode?: string;
    minSdkVersion?: string | number;
    targetSdkVersion?: string | number;
    permissions: string[];
    customSchemes: string[];
    application?: {
        label?: string;
        debuggable?: boolean;
        allowBackup?: boolean;
        usesCleartextTraffic?: boolean;
    };
    activities: Component[];
    services: Component[];
    receivers: Component[];
    providers: Component[];
}

export interface AnalysisProgress {
    step: "extract" | "manifest" | "permissions" | "secrets" | "trackers" | "complete";
    progress: number;
    message: string;
}

export type ProgressCallback = (progress: AnalysisProgress) => void;

export interface ParseResult {
    manifest: ParsedManifest | null;
    manifestXml?: string;
    fileList: string[];
    strings: string[];
    packageHints?: string[];
}

// ─── Check Runner ──────────────────────────────────────────────────

export interface Finding {
    id: string;
    title: string;
    description: string;
    severity: SeverityLevel;
    masvs?: string;
    remediation?: string;
    match?: string;
    source?: string;
}

export interface DetectedTracker extends Tracker {
    detectedPackage?: string;
}

export interface CheckResults {
    permissions: Finding[];
    secrets: Finding[];
    trackers: DetectedTracker[];
    manifest: Finding[];
    summary: Record<SeverityLevel, number>;
}

// ─── Scanner App ───────────────────────────────────────────────────

export type ScanState = "idle" | "analyzing" | "complete" | "error";

export interface AppInfo {
    appName: string;
    packageName: string;
    versionName: string;
    minSdk: string | number;
    targetSdk: string | number;
    fileSize: string;
}

export interface ScanResults extends AppInfo, CheckResults {}
