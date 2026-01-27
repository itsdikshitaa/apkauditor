import { HOW_IT_WORKS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Upload, Cpu, FileCheck, LucideIcon, WifiOff } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
    Upload,
    Cpu,
    FileCheck,
};

export function HowItWorks() {
    return (
        <section id="how-it-works" className="scroll-mt-20 py-20 sm:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        How it works
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Three simple steps. No setup, no configuration, no waiting.
                    </p>
                </div>

                {/* Steps */}
                <div className="relative mt-16">
                    {/* Connecting line */}
                    <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-primary/50 via-primary/20 to-transparent lg:block" />

                    <div className="grid gap-12 lg:grid-cols-3 lg:gap-8">
                        {HOW_IT_WORKS.map((step, index) => {
                            const Icon = ICON_MAP[step.icon] || Upload;
                            return (
                                <div key={step.step} className="relative text-center">
                                    {/* Step number */}
                                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/20">
                                        <Icon className="h-7 w-7 text-primary" />
                                    </div>

                                    {/* Step indicator */}
                                    <Badge variant="outline" className="mb-4 font-mono">
                                        Step {step.step}
                                    </Badge>

                                    <h3 className="text-xl font-semibold">{step.title}</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">
                                        {step.description}
                                    </p>

                                    {/* Arrow for larger screens */}
                                    {index < HOW_IT_WORKS.length - 1 && (
                                        <div className="absolute right-0 top-8 hidden translate-x-1/2 text-border lg:block">
                                            <svg
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M9 5l7 7-7 7"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Callout */}
                <div className="mx-auto mt-16 max-w-md rounded-xl border border-primary/20 bg-primary/5 p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-primary">
                        <WifiOff className="h-4 w-4" />
                        <span className="font-medium">Zero network calls during analysis</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Open DevTools Network tab during a scan—you&apos;ll see nothing.
                    </p>
                </div>
            </div>
        </section>
    );
}
