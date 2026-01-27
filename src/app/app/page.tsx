"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Shield, Upload, FileText, Download, RefreshCw, Lock, ChevronLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

type ScanState = "idle" | "analyzing" | "complete" | "error";

interface Finding {
    id: string;
    title: string;
    description: string;
    severity: "critical" | "high" | "medium" | "low" | "info";
    masvs?: string;
    remediation: string;
    match?: string;
}

interface Tracker {
    id: string;
    name: string;
    company: string;
    category: string;
    packages: string[];
}

interface ScanResults {
    appName: string;
    packageName: string;
    versionName: string;
    minSdk: number;
    targetSdk: number;
    fileSize: string;
    permissions: Finding[];
    secrets: Finding[];
    trackers: Tracker[];
    manifest: Finding[];
    summary: {
        critical: number;
        high: number;
        medium: number;
        low: number;
        info: number;
    };
}

// Mock results for demo
const MOCK_RESULTS: ScanResults = {
    appName: "Example App",
    packageName: "com.example.app",
    versionName: "1.2.3",
    minSdk: 21,
    targetSdk: 34,
    fileSize: "24.5 MB",
    permissions: [
        {
            id: "PERM001",
            title: "Fine Location Access",
            description: "App requests ACCESS_FINE_LOCATION permission for precise GPS tracking.",
            severity: "high",
            masvs: "MASVS-PRIVACY-1",
            remediation: "Ensure location access is necessary. Request only when needed with clear user explanation.",
            match: "android.permission.ACCESS_FINE_LOCATION",
        },
        {
            id: "PERM002",
            title: "Camera Access",
            description: "App requests CAMERA permission to capture photos or video.",
            severity: "medium",
            masvs: "MASVS-PRIVACY-1",
            remediation: "Request camera permission only when the feature is about to be used.",
            match: "android.permission.CAMERA",
        },
        {
            id: "PERM003",
            title: "Internet Access",
            description: "App requests INTERNET permission for network connectivity.",
            severity: "info",
            masvs: "MASVS-NETWORK-1",
            remediation: "Normal permission. Ensure all network traffic uses HTTPS.",
            match: "android.permission.INTERNET",
        },
    ],
    secrets: [
        {
            id: "SEC001",
            title: "Google API Key Detected",
            description: "Hardcoded Google API key found in application resources.",
            severity: "high",
            masvs: "MASVS-STORAGE-1",
            remediation: "Remove hardcoded key. Use Android Keystore or fetch from secure backend.",
            match: "AIzaSyB***************",
        },
        {
            id: "SEC002",
            title: "High Entropy String",
            description: "High entropy string detected (entropy: 4.8). May be a secret or token.",
            severity: "medium",
            masvs: "MASVS-STORAGE-1",
            remediation: "Review this string. If it's a secret, move to secure storage.",
            match: "xK9mN2pLqR8sT5vW...",
        },
    ],
    trackers: [
        {
            id: "TRACK001",
            name: "Firebase Analytics",
            company: "Google",
            category: "Analytics",
            packages: ["com.google.firebase.analytics"],
        },
        {
            id: "TRACK002",
            name: "Crashlytics",
            company: "Google",
            category: "Crash Reporting",
            packages: ["com.google.firebase.crashlytics"],
        },
        {
            id: "TRACK003",
            name: "Facebook SDK",
            company: "Meta",
            category: "Social/Ads",
            packages: ["com.facebook.sdk"],
        },
    ],
    manifest: [
        {
            id: "MAN001",
            title: "Backup Allowed",
            description: "android:allowBackup is enabled, allowing app data to be backed up.",
            severity: "high",
            masvs: "MASVS-STORAGE-2",
            remediation: "Set android:allowBackup=\"false\" to prevent data extraction via ADB backup.",
            match: "android:allowBackup=\"true\"",
        },
        {
            id: "MAN002",
            title: "Exported Activity",
            description: "MainActivity is exported without permission protection.",
            severity: "medium",
            masvs: "MASVS-PLATFORM-1",
            remediation: "Set android:exported=\"false\" or add android:permission requirement.",
            match: "MainActivity (exported=true)",
        },
    ],
    summary: {
        critical: 0,
        high: 3,
        medium: 3,
        low: 0,
        info: 1,
    },
};

export default function ScannerApp() {
    const [scanState, setScanState] = useState<ScanState>("idle");
    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState("");
    const [results, setResults] = useState<ScanResults | null>(null);
    const [dragOver, setDragOver] = useState(false);

    const handleFile = useCallback(async (file: File) => {
        if (!file.name.endsWith(".apk")) {
            alert("Please select an APK file");
            return;
        }

        setFileName(file.name);
        setScanState("analyzing");
        setProgress(0);

        // Simulate analysis progress
        const steps = [
            { progress: 15, delay: 500 },
            { progress: 35, delay: 800 },
            { progress: 55, delay: 600 },
            { progress: 75, delay: 700 },
            { progress: 90, delay: 500 },
            { progress: 100, delay: 300 },
        ];

        for (const step of steps) {
            await new Promise((resolve) => setTimeout(resolve, step.delay));
            setProgress(step.progress);
        }

        // Show results
        setResults(MOCK_RESULTS);
        setScanState("complete");
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
        },
        [handleFile]
    );

    const handleReset = () => {
        setScanState("idle");
        setProgress(0);
        setFileName("");
        setResults(null);
    };

    return (
        <div className="flex min-h-screen flex-col bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
                <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/" className="gap-1.5">
                                <ChevronLeft className="h-4 w-4" />
                                Back
                            </Link>
                        </Button>
                        <Separator orientation="vertical" className="h-6" />
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            <span className="font-semibold">APK Scanner</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-1.5 border-primary/30 text-primary">
                            <Lock className="h-3 w-3" />
                            100% Client-Side
                        </Badge>
                    </div>
                </div>
            </header>

            {/* Privacy banner */}
            <div className="privacy-gradient border-b border-primary/10 py-2">
                <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 text-sm">
                    <Lock className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">
                        <strong className="text-foreground">Your APK never leaves your device.</strong>{" "}
                        All analysis happens locally in your browser.
                    </span>
                </div>
            </div>

            {/* Main content */}
            <main className="flex-1 py-6">
                <div className="mx-auto max-w-7xl px-4">
                    {scanState === "idle" && (
                        <UploadPanel
                            onDrop={handleDrop}
                            onFileSelect={handleFile}
                            dragOver={dragOver}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragOver(true);
                            }}
                            onDragLeave={() => setDragOver(false)}
                        />
                    )}

                    {scanState === "analyzing" && (
                        <AnalyzingPanel fileName={fileName} progress={progress} />
                    )}

                    {scanState === "complete" && results && (
                        <ResultsPanel results={results} onReset={handleReset} />
                    )}

                    {scanState === "error" && (
                        <ErrorPanel onRetry={handleReset} />
                    )}
                </div>
            </main>
        </div>
    );
}

// Upload Panel Component
function UploadPanel({
    onDrop,
    onFileSelect,
    dragOver,
    onDragOver,
    onDragLeave,
}: {
    onDrop: (e: React.DragEvent) => void;
    onFileSelect: (file: File) => void;
    dragOver: boolean;
    onDragOver: (e: React.DragEvent) => void;
    onDragLeave: () => void;
}) {
    return (
        <div className="mx-auto max-w-2xl">
            <div className="text-center">
                <h1 className="text-2xl font-bold">Analyze APK</h1>
                <p className="mt-2 text-muted-foreground">
                    Drop your APK file to start the security scan
                </p>
            </div>

            <div
                className={`dropzone mt-8 rounded-2xl border-2 border-dashed p-12 text-center transition-all ${dragOver
                        ? "border-primary bg-primary/5"
                        : "border-border/50 hover:border-primary/30"
                    }`}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
            >
                <input
                    type="file"
                    accept=".apk"
                    className="hidden"
                    id="file-input"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onFileSelect(file);
                    }}
                />
                <label htmlFor="file-input" className="cursor-pointer">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
                        <Upload className="h-7 w-7 text-primary" />
                    </div>
                    <p className="text-lg font-medium">Drop APK here</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                        or click to browse (max 200MB)
                    </p>
                </label>
            </div>

            {/* Privacy reminder */}
            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-primary" />
                    No uploads
                </span>
                <span className="flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-primary" />
                    No telemetry
                </span>
                <span className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    PDF export
                </span>
            </div>
        </div>
    );
}

// Analyzing Panel Component
function AnalyzingPanel({
    fileName,
    progress,
}: {
    fileName: string;
    progress: number;
}) {
    const getStatusText = () => {
        if (progress < 20) return "Extracting APK contents...";
        if (progress < 40) return "Parsing AndroidManifest.xml...";
        if (progress < 60) return "Analyzing permissions...";
        if (progress < 80) return "Scanning for secrets...";
        if (progress < 95) return "Detecting trackers...";
        return "Finalizing report...";
    };

    return (
        <div className="mx-auto max-w-md">
            <Card className="border-border/50 bg-card/50">
                <CardHeader className="text-center">
                    <CardTitle>Analyzing APK</CardTitle>
                    <CardDescription className="font-mono text-xs">
                        {fileName}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="h-3 overflow-hidden rounded-full bg-secondary">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-primary to-teal-400 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{getStatusText()}</span>
                            <span className="font-mono">{progress}%</span>
                        </div>
                    </div>
                    <p className="text-center text-xs text-muted-foreground">
                        All processing happens locally in your browser
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

// Results Panel Component
function ResultsPanel({
    results,
    onReset,
}: {
    results: ScanResults;
    onReset: () => void;
}) {
    return (
        <div className="space-y-6">
            {/* App info header */}
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">{results.appName}</h1>
                    <p className="font-mono text-sm text-muted-foreground">
                        {results.packageName}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span>v{results.versionName}</span>
                        <span>•</span>
                        <span>Min SDK {results.minSdk}</span>
                        <span>•</span>
                        <span>Target SDK {results.targetSdk}</span>
                        <span>•</span>
                        <span>{results.fileSize}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={onReset}>
                        <RefreshCw className="mr-1.5 h-4 w-4" />
                        New Scan
                    </Button>
                    <Button size="sm">
                        <Download className="mr-1.5 h-4 w-4" />
                        Export PDF
                    </Button>
                </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                <SummaryCard
                    label="Critical"
                    count={results.summary.critical}
                    variant="critical"
                />
                <SummaryCard
                    label="High"
                    count={results.summary.high}
                    variant="high"
                />
                <SummaryCard
                    label="Medium"
                    count={results.summary.medium}
                    variant="medium"
                />
                <SummaryCard
                    label="Low"
                    count={results.summary.low}
                    variant="low"
                />
                <SummaryCard
                    label="Info"
                    count={results.summary.info}
                    variant="info"
                />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="permissions" className="w-full">
                <TabsList className="w-full justify-start">
                    <TabsTrigger value="permissions" className="gap-1.5">
                        Permissions
                        <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                            {results.permissions.length}
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="secrets" className="gap-1.5">
                        Secrets
                        <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                            {results.secrets.length}
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="trackers" className="gap-1.5">
                        Trackers
                        <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                            {results.trackers.length}
                        </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="manifest" className="gap-1.5">
                        Manifest
                        <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                            {results.manifest.length}
                        </Badge>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="permissions" className="mt-4 space-y-3">
                    {results.permissions.map((finding) => (
                        <FindingCard key={finding.id} finding={finding} />
                    ))}
                </TabsContent>

                <TabsContent value="secrets" className="mt-4 space-y-3">
                    {results.secrets.map((finding) => (
                        <FindingCard key={finding.id} finding={finding} />
                    ))}
                </TabsContent>

                <TabsContent value="trackers" className="mt-4 space-y-3">
                    {results.trackers.map((tracker) => (
                        <TrackerCard key={tracker.id} tracker={tracker} />
                    ))}
                </TabsContent>

                <TabsContent value="manifest" className="mt-4 space-y-3">
                    {results.manifest.map((finding) => (
                        <FindingCard key={finding.id} finding={finding} />
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}

// Summary Card Component
function SummaryCard({
    label,
    count,
    variant,
}: {
    label: string;
    count: number;
    variant: "critical" | "high" | "medium" | "low" | "info";
}) {
    const variants = {
        critical: "border-red-500/30 bg-red-500/10 text-red-400",
        high: "border-orange-500/30 bg-orange-500/10 text-orange-400",
        medium: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
        low: "border-green-500/30 bg-green-500/10 text-green-400",
        info: "border-blue-500/30 bg-blue-500/10 text-blue-400",
    };

    return (
        <div className={`rounded-lg border p-3 text-center ${variants[variant]}`}>
            <div className="text-2xl font-bold">{count}</div>
            <div className="text-xs opacity-80">{label}</div>
        </div>
    );
}

// Finding Card Component
function FindingCard({ finding }: { finding: Finding }) {
    const severityClasses = {
        critical: "severity-critical",
        high: "severity-high",
        medium: "severity-medium",
        low: "severity-low",
        info: "severity-info",
    };

    return (
        <Card className="border-border/50 bg-card/50">
            <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                            <Badge className={`border ${severityClasses[finding.severity]}`}>
                                {finding.severity}
                            </Badge>
                            <span className="font-mono text-xs text-muted-foreground">
                                {finding.id}
                            </span>
                            {finding.masvs && (
                                <Badge variant="outline" className="font-mono text-xs">
                                    {finding.masvs}
                                </Badge>
                            )}
                        </div>
                        <h3 className="font-semibold">{finding.title}</h3>
                        {finding.match && (
                            <code className="block rounded bg-secondary/50 px-2 py-1 font-mono text-xs text-muted-foreground">
                                {finding.match}
                            </code>
                        )}
                        <p className="text-sm text-muted-foreground">
                            {finding.description}
                        </p>
                        <div className="rounded-lg bg-primary/5 p-3">
                            <div className="mb-1 text-xs font-medium text-primary">
                                💡 Remediation
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {finding.remediation}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Tracker Card Component
function TrackerCard({ tracker }: { tracker: Tracker }) {
    return (
        <Card className="border-border/50 bg-card/50">
            <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{tracker.name}</h3>
                            <Badge variant="outline" className="text-xs">
                                {tracker.category}
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{tracker.company}</p>
                        <div className="flex flex-wrap gap-1 pt-1">
                            {tracker.packages.map((pkg) => (
                                <code
                                    key={pkg}
                                    className="rounded bg-secondary/50 px-1.5 py-0.5 font-mono text-xs text-muted-foreground"
                                >
                                    {pkg}
                                </code>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Error Panel Component
function ErrorPanel({ onRetry }: { onRetry: () => void }) {
    return (
        <div className="mx-auto max-w-md text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
                <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-xl font-bold">Analysis Failed</h2>
            <p className="mt-2 text-muted-foreground">
                Unable to process the APK file. Please check the file and try again.
            </p>
            <Button onClick={onRetry} className="mt-6">
                Try Again
            </Button>
        </div>
    );
}
