import Link from "next/link";
import { Shield, Github, FileText, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const FOOTER_LINKS = {
    Product: [
        { label: "Features", href: "/#features" },
        { label: "Security Checks", href: "/#checks" },
        { label: "How it Works", href: "/#how-it-works" },
        { label: "Open Scanner", href: "/app" },
    ],
    Resources: [
        { label: "Documentation", href: "/docs" },
        { label: "Support", href: "/support" },
        { label: "FAQ", href: "/support#faq" },
        { label: "Changelog", href: "/docs/changelog" },
    ],
    Legal: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "License", href: "/docs/license" },
    ],
};

export function Footer() {
    return (
        <footer className="border-t border-border/50 bg-card/50">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                                <Shield className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-lg font-semibold">APK Auditor</span>
                        </Link>
                        <p className="mt-4 max-w-xs text-sm text-muted-foreground">
                            100% client-side Android security scanner. Your APK never leaves your device.
                        </p>
                        <div className="mt-6 flex items-center gap-4">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground transition-colors hover:text-foreground"
                                aria-label="GitHub"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                            <a
                                href="/docs"
                                className="text-muted-foreground transition-colors hover:text-foreground"
                                aria-label="Documentation"
                            >
                                <FileText className="h-5 w-5" />
                            </a>
                            <a
                                href="mailto:hello@apkauditor.com"
                                className="text-muted-foreground transition-colors hover:text-foreground"
                                aria-label="Email"
                            >
                                <Mail className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(FOOTER_LINKS).map(([category, links]) => (
                        <div key={category}>
                            <h3 className="text-sm font-semibold">{category}</h3>
                            <ul className="mt-4 space-y-2.5">
                                {links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <Separator className="my-8" />

                {/* Bottom bar */}
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} APK Auditor. Open source under MIT license.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-primary">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            v1.0.0
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
