import { TESTIMONIALS } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote } from "lucide-react";

export function Testimonials() {
    return (
        <section className="border-t border-border/50 bg-card/30 py-20 sm:py-28">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="mx-auto max-w-2xl text-center">
                    <Badge variant="outline" className="mb-4">
                        Example Feedback
                    </Badge>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Trusted by security-conscious developers
                    </h2>
                </div>

                {/* Testimonials grid */}
                <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {TESTIMONIALS.map((testimonial, index) => (
                        <Card
                            key={index}
                            className="relative border-border/50 bg-card/50"
                        >
                            <CardContent className="pt-6">
                                <Quote className="mb-4 h-8 w-8 text-primary/30" />
                                <blockquote className="text-sm leading-relaxed text-foreground/90">
                                    &ldquo;{testimonial.quote}&rdquo;
                                </blockquote>
                                <div className="mt-6 flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                        {testimonial.author.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium">{testimonial.author}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {testimonial.title}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Disclaimer */}
                <p className="mt-8 text-center text-xs text-muted-foreground">
                    Testimonials represent example feedback for illustration purposes.
                </p>
            </div>
        </section>
    );
}
