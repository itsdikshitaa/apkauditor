import { FEATURES } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ClipboardCheck,
    Key,
    Activity,
    FileWarning,
    FileText,
    Laptop,
    LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
    ClipboardCheck,
    Key,
    Activity,
    FileWarning,
    FileText,
    Laptop,
};

export function FeaturesGrid() {
    return (
        <section id="features" className="scroll-mt-20 py-20 sm:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Everything you need for APK security
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Comprehensive static analysis powered by OWASP MASVS guidelines.
                        All running locally in your browser.
                    </p>
                </div>

                {/* Features grid */}
                <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {FEATURES.map((feature) => {
                        const Icon = ICON_MAP[feature.icon] || ClipboardCheck;
                        return (
                            <Card
                                key={feature.title}
                                className="card-hover border-border/50 bg-card/50"
                            >
                                <CardHeader>
                                    <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                                        <Icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-sm leading-relaxed">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
