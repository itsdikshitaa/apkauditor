import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Shield,
    WifiOff,
    EyeOff,
    CloudOff,
    Lock,
    Server,
    Database,
    Fingerprint,
    Code,
    FileCheck,
} from "lucide-react";

const PRIVACY_GUARANTEES = [
    {
        icon: Shield,
        title: "No File Uploads",
        description:
            "Your APK file is never uploaded to any server. All processing happens exclusively in your web browser using JavaScript. The file is read locally using the browser's File API.",
    },
    {
        icon: WifiOff,
        title: "No Network Calls During Analysis",
        description:
            "Zero network requests are made during the APK analysis process. We actively monitor and block any attempts. Open DevTools Network tab during a scan to verify.",
    },
    {
        icon: EyeOff,
        title: "No Telemetry or Analytics",
        description:
            "We don't use Google Analytics, Mixpanel, or any other tracking service. No usage data is collected. No fingerprinting. No cookies except essential ones.",
    },
    {
        icon: CloudOff,
        title: "Offline Capable",
        description:
            "After the initial page load, APK Auditor works completely offline. A service worker caches all necessary assets. No internet connection required for scanning.",
    },
    {
        icon: Server,
        title: "No Backend Required",
        description:
            "APK Auditor is a static web application. There is no server processing your files. The 'server' only serves static HTML, CSS, and JavaScript files.",
    },
    {
        icon: Database,
        title: "No Data Storage",
        description:
            "We don't store your APK files, scan results, or any analysis data. Everything exists only in your browser's memory and is cleared when you close the tab.",
    },
    {
        icon: Fingerprint,
        title: "No User Identification",
        description:
            "No accounts, no logins, no user IDs. You're completely anonymous. We can't identify you even if we wanted to.",
    },
    {
        icon: Code,
        title: "Open Source",
        description:
            "The entire codebase is open source and available for audit. Verify our privacy claims by inspecting the code yourself. Contributions welcome.",
    },
];

export default function PrivacyPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 py-12">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center">
                        <Badge variant="outline" className="mb-4 gap-1.5 border-primary/30 text-primary">
                            <Lock className="h-3 w-3" />
                            Privacy First
                        </Badge>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Privacy Guarantees
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                            APK Auditor is built from the ground up with privacy as the core principle.
                            Your APK never leaves your device. Here&apos;s exactly how we ensure that.
                        </p>
                    </div>

                    {/* Main promise */}
                    <Card className="mt-12 border-primary/20 bg-primary/5">
                        <CardContent className="flex items-center gap-4 py-6">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/20">
                                <FileCheck className="h-7 w-7 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">100% Client-Side Processing</h2>
                                <p className="text-muted-foreground">
                                    All APK parsing, analysis, and report generation happens entirely in your browser.
                                    We use JSZip for extraction, a custom AXML parser for AndroidManifest.xml, and
                                    jsPDF for report generation—all running locally.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Guarantees grid */}
                    <div className="mt-12 grid gap-6 sm:grid-cols-2">
                        {PRIVACY_GUARANTEES.map((guarantee) => (
                            <Card key={guarantee.title} className="border-border/50 bg-card/50">
                                <CardContent className="pt-6">
                                    <div className="flex gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                                            <guarantee.icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{guarantee.title}</h3>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {guarantee.description}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Separator className="my-12" />

                    {/* Technical verification */}
                    <div className="rounded-xl border border-border/50 bg-card/50 p-6">
                        <h2 className="text-xl font-bold">Verify It Yourself</h2>
                        <p className="mt-2 text-muted-foreground">
                            Don&apos;t just take our word for it. Here&apos;s how you can verify our privacy claims:
                        </p>
                        <ol className="mt-4 space-y-3 text-sm">
                            <li className="flex gap-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                    1
                                </span>
                                <span>
                                    <strong>Check Network Activity:</strong> Open browser DevTools (F12) → Network tab
                                    before scanning an APK. You&apos;ll see zero requests during analysis.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                    2
                                </span>
                                <span>
                                    <strong>Go Offline:</strong> Disconnect from the internet after the page loads.
                                    The scanner works exactly the same.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                    3
                                </span>
                                <span>
                                    <strong>Inspect the Source:</strong> View page source or check our GitHub repo.
                                    No hidden tracking pixels, no obfuscated analytics code.
                                </span>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                    4
                                </span>
                                <span>
                                    <strong>Self-Host:</strong> Download and run APK Auditor on your own server or
                                    localhost for maximum confidence.
                                </span>
                            </li>
                        </ol>
                    </div>

                    {/* Last updated */}
                    <p className="mt-8 text-center text-sm text-muted-foreground">
                        Last updated: January 2026
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
}
