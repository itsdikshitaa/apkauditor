import { CHECK_CATEGORIES } from "@/lib/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Key, Activity, FileCode, LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
    Shield,
    Key,
    Activity,
    FileCode,
};

export function ChecksCoverage() {
    return (
        <section id="checks" className="scroll-mt-20 border-y border-border/50 bg-card/30 py-20 sm:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="mx-auto max-w-2xl text-center">
                    <Badge variant="outline" className="mb-4">
                        48 Total Checks
                    </Badge>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Security Check Coverage
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Comprehensive checks across four key categories, mapped to OWASP MASVS v2.1.
                    </p>
                </div>

                {/* Categories grid */}
                <div className="mt-16 grid gap-6 sm:grid-cols-2">
                    {CHECK_CATEGORIES.map((category) => {
                        const Icon = ICON_MAP[category.icon] || Shield;
                        return (
                            <Card
                                key={category.id}
                                className="card-hover border-border/50 bg-card/50"
                            >
                                <CardHeader className="flex-row items-start gap-4 space-y-0">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                                        <Icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg">{category.title}</CardTitle>
                                            <Badge variant="secondary" className="font-mono">
                                                {category.count} checks
                                            </Badge>
                                        </div>
                                        <CardDescription className="mt-1.5">
                                            {category.description}
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {category.examples.map((example) => (
                                            <Badge
                                                key={example}
                                                variant="outline"
                                                className="font-mono text-xs"
                                            >
                                                {example}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Note */}
                <p className="mt-8 text-center text-sm text-muted-foreground">
                    Check counts reflect the current ruleset. Add custom checks via JSON configuration.
                </p>
            </div>
        </section>
    );
}
