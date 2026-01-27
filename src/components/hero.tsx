import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Shield, Lock, Wifi, FileText } from "lucide-react";

export function Hero() {
    return (
        <section className="relative overflow-hidden">
            {/* Background pattern */}
            <div className="grid-pattern absolute inset-0 opacity-50" />

            <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    {/* Left: Content */}
                    <div>
                        <Badge variant="outline" className="mb-6 gap-1.5 border-primary/30 bg-primary/5 text-primary">
                            <Shield className="h-3 w-3" />
                            MASVS v2.1 Aligned
                        </Badge>

                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                            Static Security for{" "}
                            <span className="gradient-text">Android APKs</span>
                        </h1>

                        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                            34 security checks running 100% in your browser. Detect dangerous permissions,
                            hardcoded secrets, tracker SDKs, and manifest issues—without uploading anything.
                        </p>

                        {/* CTAs */}
                        <div className="mt-8 flex flex-wrap items-center gap-4">
                            <Button size="lg" asChild>
                                <Link href="/app" className="gap-2">
                                    Open Scanner
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" asChild>
                                <Link href="/docs">View Documentation</Link>
                            </Button>
                        </div>

                        {/* Trust signals */}
                        <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                                <Lock className="h-4 w-4 text-primary" />
                                No uploads
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Wifi className="h-4 w-4 text-primary" />
                                Works offline
                            </span>
                            <span className="flex items-center gap-1.5">
                                <FileText className="h-4 w-4 text-primary" />
                                PDF reports
                            </span>
                        </div>
                    </div>

                    {/* Right: Scanner Preview */}
                    <div className="relative">
                        <ScannerPreview />
                    </div>
                </div>
            </div>
        </section>
    );
}

function ScannerPreview() {
    return (
        <div className="relative rounded-2xl border border-border/50 bg-card/50 p-1 shadow-2xl shadow-primary/5 backdrop-blur">
            {/* Window chrome */}
            <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
                <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 text-center text-xs text-muted-foreground">
                    apkauditor.com/app
                </div>
            </div>

            {/* Scanner content */}
            <div className="p-4 sm:p-6">
                {/* Dropzone */}
                <div className="dropzone rounded-xl border-2 border-dashed border-border/50 p-6 text-center transition-colors hover:border-primary/30">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <svg
                            className="h-6 w-6 text-primary"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                        </svg>
                    </div>
                    <p className="text-sm font-medium">Drop APK here</p>
                    <p className="mt-1 text-xs text-muted-foreground">or click to browse</p>
                </div>

                {/* Analysis preview */}
                <div className="mt-4 rounded-lg border border-border/50 bg-secondary/30 p-3">
                    <div className="mb-2 flex items-center justify-between">
                        <span className="text-xs font-medium">example-app.apk</span>
                        <span className="text-xs text-primary">Analyzing...</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-secondary">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-primary to-teal-400 transition-all"
                            style={{ width: "65%" }}
                        />
                    </div>
                </div>

                {/* Summary chips */}
                <div className="mt-4 flex flex-wrap gap-2">
                    <Badge className="severity-critical gap-1 border">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                        2 Critical
                    </Badge>
                    <Badge className="severity-high gap-1 border">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                        5 High
                    </Badge>
                    <Badge className="severity-medium gap-1 border">
                        <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                        12 Medium
                    </Badge>
                    <Badge className="severity-info gap-1 border">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                        8 Info
                    </Badge>
                </div>

                {/* Tabs preview */}
                <div className="mt-4 flex gap-1 overflow-x-auto rounded-lg border border-border/50 bg-secondary/30 p-1">
                    <button className="rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
                        Permissions
                    </button>
                    <button className="rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary">
                        Secrets
                    </button>
                    <button className="rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary">
                        Trackers
                    </button>
                    <button className="rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary">
                        Manifest
                    </button>
                </div>

                {/* Privacy badge */}
                <div className="mt-4 flex items-center justify-center gap-4 rounded-lg bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <Lock className="h-3 w-3 text-primary" />
                        No uploads
                    </span>
                    <span className="flex items-center gap-1">
                        <Shield className="h-3 w-3 text-primary" />
                        No telemetry
                    </span>
                    <span className="flex items-center gap-1">
                        <Wifi className="h-3 w-3 text-primary" />
                        Offline
                    </span>
                </div>
            </div>
        </div>
    );
}
