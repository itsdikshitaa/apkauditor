/**
 * Security Check Runner
 * Runs all security checks against parsed APK data
 */

import checksData from "./data/checks.json";
import trackersData from "./data/trackers.json";
import { ParseResult } from "./apk-parser";

// Dangerous permissions list
const DANGEROUS_PERMISSIONS = [
    "android.permission.READ_CONTACTS",
    "android.permission.WRITE_CONTACTS",
    "android.permission.GET_ACCOUNTS",
    "android.permission.READ_CALL_LOG",
    "android.permission.WRITE_CALL_LOG",
    "android.permission.PROCESS_OUTGOING_CALLS",
    "android.permission.READ_CALENDAR",
    "android.permission.WRITE_CALENDAR",
    "android.permission.CAMERA",
    "android.permission.RECORD_AUDIO",
    "android.permission.ACCESS_FINE_LOCATION",
    "android.permission.ACCESS_COARSE_LOCATION",
    "android.permission.ACCESS_BACKGROUND_LOCATION",
    "android.permission.READ_PHONE_STATE",
    "android.permission.READ_PHONE_NUMBERS",
    "android.permission.CALL_PHONE",
    "android.permission.ANSWER_PHONE_CALLS",
    "android.permission.ADD_VOICEMAIL",
    "android.permission.USE_SIP",
    "android.permission.BODY_SENSORS",
    "android.permission.ACTIVITY_RECOGNITION",
    "android.permission.SEND_SMS",
    "android.permission.RECEIVE_SMS",
    "android.permission.READ_SMS",
    "android.permission.RECEIVE_WAP_PUSH",
    "android.permission.RECEIVE_MMS",
    "android.permission.READ_EXTERNAL_STORAGE",
    "android.permission.WRITE_EXTERNAL_STORAGE",
    "android.permission.ACCESS_MEDIA_LOCATION",
];

export type { Finding, CheckResults } from "./types";

// Tracker stays local for backward compatibility
export interface Tracker {
    id: string;
    name: string;
    company: string;
    category: string;
    packages: string[];
    website?: string;
    detectedPackage?: string;
}

/**
 * Main check runner class
 */
export class CheckRunner {
    apkData: ParseResult;
    results: CheckResults;

    constructor(apkData: ParseResult) {
        this.apkData = apkData;
        this.results = {
            permissions: [],
            secrets: [],
            trackers: [],
            manifest: [],
            summary: {
                critical: 0,
                high: 0,
                medium: 0,
                low: 0,
                info: 0,
            },
        };
    }

    /**
     * Run all checks
     */
    async runAllChecks(): Promise<CheckResults> {
        // Run permission checks
        this.runPermissionChecks();

        // Run secrets detection
        this.runSecretsChecks();

        // Run tracker detection
        this.runTrackerChecks();

        // Run manifest security checks
        this.runManifestChecks();

        // Calculate summary
        this.calculateSummary();

        return this.results;
    }

    /**
     * Permission analysis
     */
    runPermissionChecks() {
        const { manifest } = this.apkData;
        if (!manifest) return;

        const permissions = manifest.permissions || [];

        for (const perm of permissions) {
            const isDangerous = DANGEROUS_PERMISSIONS.includes(perm);
            const permCheck = checksData.checks.find(
                (c) => c.category === "permissions" && c.pattern === perm
            );

            if (permCheck) {
                this.results.permissions.push({
                    id: permCheck.id,
                    title: permCheck.title,
                    description: permCheck.description,
                    severity: permCheck.severity as Finding["severity"],
                    masvs: permCheck.masvs,
                    remediation: permCheck.remediation,
                    match: perm,
                });
            } else if (isDangerous) {
                // Generic dangerous permission finding
                const simpleName = perm
                    .split(".")
                    .pop()!
                    .replace(/_/g, " ")
                    .toLowerCase();
                this.results.permissions.push({
                    id: `PERM_${perm.split(".").pop()}`,
                    title: `Dangerous Permission: ${simpleName}`,
                    description: `The app requests the dangerous permission ${perm}. This permission requires user approval at runtime.`,
                    severity: "high",
                    masvs: "MASVS-PRIVACY-1",
                    remediation:
                        "Ensure this permission is necessary for core app functionality. Request at runtime with clear explanation.",
                    match: perm,
                });
            } else {
                // Normal permissions - just informational
                const simpleName = perm.split(".").pop();
                this.results.permissions.push({
                    id: `PERM_NORMAL_${simpleName}`,
                    title: `Permission: ${simpleName}`,
                    description: `Normal permission that is automatically granted.`,
                    severity: "info",
                    masvs: "MASVS-PRIVACY-1",
                    remediation: "Normal permission - no action required.",
                    match: perm,
                });
            }
        }

        // Sort by severity
        this.results.permissions.sort(
            (a, b) => this.severityOrder(a.severity) - this.severityOrder(b.severity)
        );
    }

    /**
     * Secrets detection using regex patterns
     */
    runSecretsChecks() {
        const { strings, manifestXml } = this.apkData;
        const secretChecks = checksData.checks.filter(
            (c) => c.category === "secrets"
        );
        const foundSecrets = new Set<string>(); // Deduplicate

        // Check manifest first
        this.checkContentForSecrets(
            manifestXml,
            secretChecks,
            foundSecrets,
            "AndroidManifest.xml"
        );

        // Check extracted strings
        for (const str of strings) {
            this.checkContentForSecrets(str, secretChecks, foundSecrets, "resources");
        }

        // High entropy detection (potential keys/tokens)
        for (const str of strings) {
            if (foundSecrets.size > 50) break; // Limit findings

            if (this.isHighEntropyString(str) && !foundSecrets.has(str)) {
                const entropy = this.calculateEntropy(str);
                if (entropy > 4.5 && str.length >= 16 && str.length <= 200) {
                    foundSecrets.add(str);
                    this.results.secrets.push({
                        id: "SEC_ENTROPY",
                        title: "High Entropy String (Potential Secret)",
                        description: `High entropy string detected (entropy: ${entropy.toFixed(
                            2
                        )}). This may be a hardcoded key, token, or other secret.`,
                        severity: "medium",
                        masvs: "MASVS-STORAGE-1",
                        remediation:
                            "Review this string. If it's a secret, move it to secure storage or fetch from a secure backend.",
                        match: this.truncateMatch(str),
                    });
                }
            }
        }

        // Sort by severity
        this.results.secrets.sort(
            (a, b) => this.severityOrder(a.severity) - this.severityOrder(b.severity)
        );
    }

    /**
     * Check content against secret patterns
     */
    checkContentForSecrets(
        content: string,
        checks: typeof checksData.checks,
        foundSet: Set<string>,
        source: string
    ) {
        if (!content) return;

        for (const check of checks) {
            if (check.type !== "regex") continue;

            try {
                const regex = new RegExp(check.pattern, "gi");
                const matches = content.match(regex);

                if (matches) {
                    for (const match of matches) {
                        if (!foundSet.has(match)) {
                            foundSet.add(match);
                            this.results.secrets.push({
                                id: check.id,
                                title: check.title,
                                description: check.description,
                                severity: check.severity as Finding["severity"],
                                masvs: check.masvs,
                                remediation: check.remediation,
                                match: this.truncateMatch(match),
                                source,
                            });
                        }
                    }
                }
            } catch {
                // Invalid regex, skip
            }
        }
    }

    /**
     * Tracker SDK detection
     */
    runTrackerChecks() {
        const { fileList, manifestXml } = this.apkData;
        const trackers = trackersData.trackers;
        const detectedTrackers = new Map<string, Tracker>();

        // Convert file paths to potential package names
        const packagePaths = new Set<string>();
        for (const filePath of fileList) {
            // Check smali paths
            if (filePath.startsWith("smali/") || filePath.startsWith("smali_")) {
                const pkg = filePath
                    .replace(/^smali(_classes\d+)?\//, "")
                    .replace(/\.smali$/, "")
                    .replace(/\//g, ".");
                packagePaths.add(pkg);
            }
        }

        // Also check the full manifest for package references
        const manifestLower = manifestXml?.toLowerCase() || "";

        // Match trackers
        for (const tracker of trackers) {
            for (const trackerPkg of tracker.packages) {
                const trackerPkgLower = trackerPkg.toLowerCase();

                // Check in file paths
                let detected = false;
                for (const pkg of packagePaths) {
                    if (pkg.toLowerCase().includes(trackerPkgLower)) {
                        detected = true;
                        break;
                    }
                }

                // Check in manifest
                if (!detected && manifestLower.includes(trackerPkgLower)) {
                    detected = true;
                }

                if (detected && !detectedTrackers.has(tracker.id)) {
                    detectedTrackers.set(tracker.id, {
                        ...tracker,
                        detectedPackage: trackerPkg,
                    });
                }
            }
        }

        // Add to results
        this.results.trackers = Array.from(detectedTrackers.values());
    }

    /**
     * Manifest security checks
     */
    runManifestChecks() {
        const { manifest } = this.apkData;
        if (!manifest) return;

        const manifestChecks = checksData.checks.filter(
            (c) => c.category === "manifest"
        );

        // Debuggable check
        if (manifest.application?.debuggable === true) {
            const check = manifestChecks.find((c) => c.id === "MAN001");
            if (check) {
                this.results.manifest.push({
                    ...check,
                    severity: check.severity as Finding["severity"],
                    match: 'android:debuggable="true"',
                });
            }
        }

        // Backup allowed check
        if (manifest.application?.allowBackup !== false) {
            const check = manifestChecks.find((c) => c.id === "MAN002");
            if (check) {
                this.results.manifest.push({
                    ...check,
                    severity: check.severity as Finding["severity"],
                    match: 'android:allowBackup="true" (or not specified)',
                });
            }
        }

        // Cleartext traffic check
        if (manifest.application?.usesCleartextTraffic === true) {
            const check = manifestChecks.find((c) => c.id === "MAN003");
            if (check) {
                this.results.manifest.push({
                    ...check,
                    severity: check.severity as Finding["severity"],
                    match: 'android:usesCleartextTraffic="true"',
                });
            }
        }

        // Exported components without permission
        const allComponents = [
            ...manifest.activities,
            ...manifest.services,
            ...manifest.receivers,
            ...manifest.providers,
        ];

        for (const component of allComponents) {
            if (component.exported === true && !component.permission) {
                // Skip main launcher activity
                const isLauncher = component.intentFilters?.some(
                    (f) =>
                        f.actions?.includes("android.intent.action.MAIN") &&
                        f.categories?.includes("android.intent.category.LAUNCHER")
                );

                if (!isLauncher) {
                    this.results.manifest.push({
                        id: "MAN004",
                        title: `Exported ${component.type}: ${component.name
                            .split(".")
                            .pop()}`,
                        description: `The ${component.type} "${component.name}" is exported and accessible to other apps without permission protection.`,
                        severity: "high",
                        masvs: "MASVS-PLATFORM-1",
                        remediation:
                            "Set android:exported=\"false\" if external access isn't needed, or add android:permission requirement.",
                        match: `${component.name} (exported=true, no permission)`,
                    });
                }
            }
        }

        // Custom URL schemes
        for (const scheme of manifest.customSchemes) {
            this.results.manifest.push({
                id: "MAN006",
                title: `Custom URL Scheme: ${scheme}://`,
                description: `Custom URL scheme "${scheme}" detected. Could be hijacked by malicious apps if host/path not validated.`,
                severity: "medium",
                masvs: "MASVS-PLATFORM-1",
                remediation:
                    "Validate all incoming data from deep links. Consider using App Links for verified domain ownership.",
                match: `${scheme}://`,
            });
        }

        // Deep link handlers with VIEW action
        for (const component of manifest.activities) {
            for (const filter of component.intentFilters || []) {
                if (filter.actions?.includes("android.intent.action.VIEW")) {
                    const hasData = filter.data?.length > 0;
                    if (hasData) {
                        const dataStr = filter.data
                            .map(
                                (d) => `${d.scheme || "*"}://${d.host || "*"}${d.path || ""}`
                            )
                            .join(", ");

                        this.results.manifest.push({
                            id: "MAN005",
                            title: `Deep Link Handler in ${component.name.split(".").pop()}`,
                            description: `Activity handles deep links which could be exploited if input not validated.`,
                            severity: "medium",
                            masvs: "MASVS-PLATFORM-1",
                            remediation:
                                "Validate all deep link parameters. Use App Links for verified domains.",
                            match: dataStr,
                        });
                    }
                }
            }
        }

        // Sort by severity
        this.results.manifest.sort(
            (a, b) => this.severityOrder(a.severity) - this.severityOrder(b.severity)
        );
    }

    /**
     * Calculate summary counts
     */
    calculateSummary() {
        const allFindings = [
            ...this.results.permissions,
            ...this.results.secrets,
            ...this.results.manifest,
        ];

        // Add tracker severity (trackers are mostly info/medium)
        for (const tracker of this.results.trackers) {
            const cat = tracker.category?.toLowerCase();
            if (cat?.includes("advertising") || cat?.includes("social")) {
                this.results.summary.medium++;
            } else {
                this.results.summary.info++;
            }
        }

        for (const finding of allFindings) {
            switch (finding.severity?.toLowerCase()) {
                case "critical":
                    this.results.summary.critical++;
                    break;
                case "high":
                    this.results.summary.high++;
                    break;
                case "medium":
                    this.results.summary.medium++;
                    break;
                case "low":
                    this.results.summary.low++;
                    break;
                default:
                    this.results.summary.info++;
            }
        }
    }

    /**
     * Severity sort order
     */
    severityOrder(severity: string | undefined): number {
        const order: Record<string, number> = {
            critical: 0,
            high: 1,
            medium: 2,
            low: 3,
            info: 4,
        };
        return order[severity?.toLowerCase() || "info"] ?? 5;
    }

    /**
     * Calculate Shannon entropy
     */
    calculateEntropy(str: string): number {
        if (!str || str.length === 0) return 0;

        const freq: Record<string, number> = {};
        for (const char of str) {
            freq[char] = (freq[char] || 0) + 1;
        }

        let entropy = 0;
        const len = str.length;
        for (const char in freq) {
            const p = freq[char] / len;
            entropy -= p * Math.log2(p);
        }

        return entropy;
    }

    /**
     * Check if string looks like a high-entropy secret
     */
    isHighEntropyString(str: string): boolean {
        if (!str || str.length < 16) return false;

        // Must be mostly alphanumeric with some special chars
        if (!/^[A-Za-z0-9+/=_\-]{16,}$/.test(str)) return false;

        // Skip common false positives
        if (/^[a-z]+$/i.test(str)) return false; // All letters
        if (/^\d+$/.test(str)) return false; // All numbers
        if (/^[A-F0-9]+$/i.test(str)) return false; // Hex only (might be color codes)

        // Flag strings with known secret prefixes (likely API keys/tokens)
        if (/^(sk[-_])|(pk[-_])|(AKIA)|(eyJ)/.test(str)) return true;

        return true;
    }

    /**
     * Truncate long matches for display
     */
    truncateMatch(str: string, maxLen = 80): string {
        if (!str) return "";
        if (str.length <= maxLen) return str;
        return str.substring(0, maxLen - 3) + "...";
    }
}
