"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Shield, Lock, Wifi, FileText, Upload } from "lucide-react";

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
    const [progress, setProgress] = useState(0);
    const [activeTab, setActiveTab] = useState(0);
    const [statusIndex, setStatusIndex] = useState(0);

    const statusMessages = [
        "Extracting manifest...",
        "Analyzing permissions...",
        "Scanning for secrets...",
        "Detecting trackers...",
        "Checking configurations..."
    ];

    // Animated progress bar
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) return 0;
                return prev + 1;
            });
        }, 80);
        return () => clearInterval(interval);
    }, []);

    // Cycle through status messages
    useEffect(() => {
        const interval = setInterval(() => {
            setStatusIndex(prev => (prev + 1) % statusMessages.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // Cycle through tabs
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTab(prev => (prev + 1) % 4);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const tabs = ["Permissions", "Secrets", "Trackers", "Manifest"];

    return (
        <div className="relative rounded-2xl border border-border/50 bg-card/50 p-1 shadow-2xl shadow-primary/10 backdrop-blur">
            {/* Animated glow effect */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/20 via-teal-500/20 to-primary/20 opacity-50 blur-xl animate-pulse" />

            <div className="relative rounded-xl bg-background/95">
                {/* Window chrome */}
                <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
                    <div className="flex gap-1.5">
                        <div className="h-3 w-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors" />
                        <div className="h-3 w-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors animate-pulse" />
                    </div>
                    <div className="flex-1 text-center text-xs text-muted-foreground">
                        apkauditor.com/app
                    </div>
                </div>

                {/* Scanner content */}
                <div className="p-4 sm:p-6">
                    {/* Dropzone with hover animation */}
                    <div className="group dropzone rounded-xl border-2 border-dashed border-border/50 p-6 text-center transition-all duration-300 hover:border-primary/50 hover:bg-primary/5">
                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                            <Upload className="h-6 w-6 text-primary animate-bounce" style={{ animationDuration: '2s' }} />
                        </div>
                        <p className="text-sm font-medium">Drop APK here</p>
                        <p className="mt-1 text-xs text-muted-foreground">or click to browse</p>
                    </div>

                    {/* Live analysis preview */}
                    <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-3 relative overflow-hidden">
                        {/* Scanning line animation */}
                        <div
                            className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-transparent via-primary to-transparent opacity-60"
                            style={{
                                animation: 'scanLine 2s ease-in-out infinite',
                            }}
                        />

                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs font-medium flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                </span>
                                example-app.apk
                            </span>
                            <span className="text-xs text-primary font-medium animate-pulse">
                                {statusMessages[statusIndex]}
                            </span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-secondary/50">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-primary via-teal-400 to-primary transition-all duration-100 relative"
                                style={{ width: `${progress}%` }}
                            >
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                            </div>
                        </div>
                        <div className="mt-1.5 text-right text-[10px] text-muted-foreground">
                            {progress}% complete
                        </div>
                    </div>

                    {/* Animated summary chips */}
                    <div className="mt-4 flex flex-wrap gap-2">
                        <Badge className="severity-critical gap-1 border animate-fadeIn" style={{ animationDelay: '0s' }}>
                            <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
                            2 Critical
                        </Badge>
                        <Badge className="severity-high gap-1 border animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
                            5 High
                        </Badge>
                        <Badge className="severity-medium gap-1 border animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 animate-pulse" />
                            12 Medium
                        </Badge>
                        <Badge className="severity-info gap-1 border animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                            8 Info
                        </Badge>
                    </div>

                    {/* Animated tabs preview */}
                    <div className="mt-4 flex gap-1 overflow-x-auto rounded-lg border border-border/50 bg-secondary/30 p-1">
                        {tabs.map((tab, i) => (
                            <button
                                key={tab}
                                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-300 ${activeTab === i
                                        ? "bg-primary/20 text-primary shadow-sm"
                                        : "text-muted-foreground hover:bg-secondary"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Privacy badge with subtle animation */}
                    <div className="mt-4 flex items-center justify-center gap-4 rounded-lg bg-primary/5 px-3 py-2 text-xs text-muted-foreground border border-primary/10">
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

            <style jsx>{`
                @keyframes scanLine {
                    0%, 100% { transform: translateX(0); opacity: 0; }
                    50% { transform: translateX(calc(100% + 200px)); opacity: 0.6; }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </div>
    );
}

