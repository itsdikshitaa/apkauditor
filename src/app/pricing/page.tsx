import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, Sparkles, Lock, Zap } from "lucide-react";
import Link from "next/link";

const PLANS = [
    {
        name: "Free",
        description: "Everything you need for personal projects",
        price: "$0",
        period: "forever",
        featured: false,
        features: [
            "All 48 security checks",
            "Unlimited APK scans",
            "PDF report export",
            "100% client-side processing",
            "Offline capable",
            "Community support",
        ],
        cta: "Open Scanner",
        ctaHref: "/app",
    },
    {
        name: "Pro",
        description: "Advanced features for teams and professionals",
        price: "$9",
        period: "/month",
        featured: true,
        features: [
            "Everything in Free",
            "Custom check rules",
            "Team sharing (coming soon)",
            "API access (coming soon)",
            "Priority support",
            "Early access to new features",
        ],
        cta: "Coming Soon",
        ctaHref: "#",
        disabled: true,
    },
];

export default function PricingPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 py-12">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center">
                        <Badge variant="outline" className="mb-4 gap-1.5">
                            <Sparkles className="h-3 w-3" />
                            Pricing
                        </Badge>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Simple, transparent pricing
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                            APK Auditor is free for everyone. Pro features are coming soon for power users.
                        </p>
                    </div>

                    {/* Privacy notice */}
                    <div className="mx-auto mt-8 max-w-md rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-sm text-primary">
                            <Lock className="h-4 w-4" />
                            <span className="font-medium">Privacy guaranteed at every tier</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Even Pro features will never require uploading your APK.
                        </p>
                    </div>

                    {/* Pricing cards */}
                    <div className="mt-12 grid gap-8 sm:grid-cols-2">
                        {PLANS.map((plan) => (
                            <Card
                                key={plan.name}
                                className={`relative ${plan.featured
                                        ? "border-primary/50 bg-primary/5 shadow-lg shadow-primary/10"
                                        : "border-border/50 bg-card/50"
                                    }`}
                            >
                                {plan.featured && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <Badge className="bg-primary text-primary-foreground">
                                            Recommended
                                        </Badge>
                                    </div>
                                )}
                                <CardHeader className="text-center">
                                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                    <CardDescription>{plan.description}</CardDescription>
                                    <div className="mt-4">
                                        <span className="text-4xl font-bold">{plan.price}</span>
                                        <span className="text-muted-foreground">{plan.period}</span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-center gap-2 text-sm">
                                                <Check className="h-4 w-4 shrink-0 text-primary" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className="w-full"
                                        variant={plan.featured ? "default" : "outline"}
                                        disabled={plan.disabled}
                                        asChild={!plan.disabled}
                                    >
                                        {plan.disabled ? (
                                            <span className="gap-1.5">
                                                <Zap className="h-4 w-4" />
                                                {plan.cta}
                                            </span>
                                        ) : (
                                            <Link href={plan.ctaHref}>{plan.cta}</Link>
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    <Separator className="my-12" />

                    {/* FAQ */}
                    <div className="text-center">
                        <h2 className="text-xl font-bold">Questions?</h2>
                        <p className="mt-2 text-muted-foreground">
                            Check our{" "}
                            <Link href="/support#faq" className="text-primary hover:underline">
                                FAQ
                            </Link>{" "}
                            or{" "}
                            <Link href="/support" className="text-primary hover:underline">
                                contact support
                            </Link>
                            .
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
