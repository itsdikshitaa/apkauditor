"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NAV_ITEMS } from "@/lib/constants";
import {
    Shield,
    Menu,
    X,
    ChevronRight,
} from "lucide-react";

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                        <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-lg font-semibold tracking-tight">
                        APK Auditor
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-1 md:flex">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop CTAs */}
                <div className="hidden items-center gap-3 md:flex">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/docs">View Docs</Link>
                    </Button>
                    <Button size="sm" asChild>
                        <Link href="/app" className="gap-1.5">
                            Open Scanner
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {/* Mobile menu button */}
                <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground md:hidden"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-expanded={mobileMenuOpen}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? (
                        <X className="h-5 w-5" />
                    ) : (
                        <Menu className="h-5 w-5" />
                    )}
                </button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="border-t border-border/50 bg-background md:hidden">
                    <nav className="flex flex-col px-4 py-4">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <div className="mt-4 flex flex-col gap-2 border-t border-border/50 pt-4">
                            <Button variant="outline" size="sm" asChild className="w-full">
                                <Link href="/docs">View Docs</Link>
                            </Button>
                            <Button size="sm" asChild className="w-full">
                                <Link href="/app" className="gap-1.5">
                                    Open Scanner
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
