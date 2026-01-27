import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import {
    BookOpen,
    Rocket,
    Settings,
    Code,
    Shield,
    FileText,
    ChevronRight,
} from "lucide-react";

const DOCS_SECTIONS = [
    {
        title: "Getting Started",
        icon: Rocket,
        description: "Learn the basics of APK Auditor",
        links: [
            { label: "Quick Start Guide", href: "/docs/quick-start" },
            { label: "Understanding Results", href: "/docs/results" },
            { label: "Exporting Reports", href: "/docs/reports" },
        ],
    },
    {
        title: "Security Checks",
        icon: Shield,
        description: "Detailed documentation on all security checks",
        links: [
            { label: "Permissions Audit", href: "/docs/checks/permissions" },
            { label: "Secrets Detection", href: "/docs/checks/secrets" },
            { label: "Tracker Detection", href: "/docs/checks/trackers" },
            { label: "Manifest Analysis", href: "/docs/checks/manifest" },
        ],
    },
    {
        title: "Configuration",
        icon: Settings,
        description: "Customize checks and behavior",
        links: [
            { label: "Custom Check Rules", href: "/docs/config/rules" },
            { label: "Tracker Signatures", href: "/docs/config/trackers" },
            { label: "Report Templates", href: "/docs/config/templates" },
        ],
    },
    {
        title: "Technical Reference",
        icon: Code,
        description: "Deep dive into implementation details",
        links: [
            { label: "Architecture Overview", href: "/docs/reference/architecture" },
            { label: "AXML Parser", href: "/docs/reference/axml" },
            { label: "MASVS Mapping", href: "/docs/reference/masvs" },
        ],
    },
];

export default function DocsPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 py-12">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mx-auto max-w-2xl text-center">
                        <Badge variant="outline" className="mb-4 gap-1.5">
                            <BookOpen className="h-3 w-3" />
                            Documentation
                        </Badge>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Learn APK Auditor
                        </h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Everything you need to know about using APK Auditor for Android security analysis.
                        </p>
                    </div>

                    {/* Documentation sections */}
                    <div className="mt-16 grid gap-6 sm:grid-cols-2">
                        {DOCS_SECTIONS.map((section) => (
                            <Card key={section.title} className="border-border/50 bg-card/50">
                                <CardHeader>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                                            <section.icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{section.title}</CardTitle>
                                            <CardDescription>{section.description}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {section.links.map((link) => (
                                            <li key={link.href}>
                                                <Link
                                                    href={link.href}
                                                    className="group flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                                                >
                                                    <span>{link.label}</span>
                                                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Separator className="my-16" />

                    {/* Quick links */}
                    <div className="grid gap-4 sm:grid-cols-3">
                        <Card className="border-border/50 bg-card/50">
                            <CardContent className="flex items-center gap-4 pt-6">
                                <FileText className="h-8 w-8 text-primary" />
                                <div>
                                    <h3 className="font-semibold">API Reference</h3>
                                    <p className="text-sm text-muted-foreground">
                                        For developers integrating APK Auditor
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-border/50 bg-card/50">
                            <CardContent className="flex items-center gap-4 pt-6">
                                <Shield className="h-8 w-8 text-primary" />
                                <div>
                                    <h3 className="font-semibold">MASVS Guide</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Understanding OWASP mobile security
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="border-border/50 bg-card/50">
                            <CardContent className="flex items-center gap-4 pt-6">
                                <Code className="h-8 w-8 text-primary" />
                                <div>
                                    <h3 className="font-semibold">Contributing</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Help improve APK Auditor
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
