"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FAQ_ITEMS } from "@/lib/constants";
import {
    HelpCircle,
    MessageCircle,
    Github,
    Mail,
    FileText,
    AlertTriangle,
    Zap,
} from "lucide-react";

const TROUBLESHOOTING = [
    {
        icon: AlertTriangle,
        title: "APK fails to load",
        description: "Make sure the file is a valid APK (ZIP format). Corrupted or incomplete downloads may fail.",
    },
    {
        icon: Zap,
        title: "Analysis is slow",
        description: "Large APKs (>50MB) may take 30-60 seconds. Games with assets can be even slower.",
    },
    {
        icon: FileText,
        title: "Missing manifest data",
        description: "Some APKs use non-standard manifest formats. Basic info extraction may be limited.",
    },
];

export default function SupportPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 py-12">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center">
                        <Badge variant="outline" className="mb-4 gap-1.5">
                            <HelpCircle className="h-3 w-3" />
                            Support
                        </Badge>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            How can we help?
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
                            Find answers to common questions or get in touch with our team.
                        </p>
                    </div>

                    {/* Contact options */}
                    <div className="mt-12 grid gap-4 sm:grid-cols-3">
                        <Card className="card-hover border-border/50 bg-card/50">
                            <CardContent className="pt-6 text-center">
                                <Github className="mx-auto h-8 w-8 text-primary" />
                                <h3 className="mt-3 font-semibold">GitHub Issues</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Report bugs or request features
                                </p>
                                <Button variant="outline" size="sm" className="mt-4" asChild>
                                    <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                                        Open Issue
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="card-hover border-border/50 bg-card/50">
                            <CardContent className="pt-6 text-center">
                                <MessageCircle className="mx-auto h-8 w-8 text-primary" />
                                <h3 className="mt-3 font-semibold">Discussions</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Ask questions and share ideas
                                </p>
                                <Button variant="outline" size="sm" className="mt-4" asChild>
                                    <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                                        Join Discussion
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="card-hover border-border/50 bg-card/50">
                            <CardContent className="pt-6 text-center">
                                <Mail className="mx-auto h-8 w-8 text-primary" />
                                <h3 className="mt-3 font-semibold">Email</h3>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    For private or security matters
                                </p>
                                <Button variant="outline" size="sm" className="mt-4" asChild>
                                    <a href="mailto:support@apkauditor.com">
                                        Send Email
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <Separator className="my-12" />

                    {/* Troubleshooting */}
                    <div>
                        <h2 className="text-xl font-bold">Common Issues</h2>
                        <p className="mt-2 text-muted-foreground">
                            Quick solutions to frequently encountered problems.
                        </p>

                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                            {TROUBLESHOOTING.map((item) => (
                                <Card key={item.title} className="border-border/50 bg-card/50">
                                    <CardHeader className="pb-3">
                                        <item.icon className="h-5 w-5 text-primary" />
                                        <CardTitle className="text-base">{item.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription>{item.description}</CardDescription>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <Separator className="my-12" />

                    {/* FAQ */}
                    <div id="faq">
                        <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
                        <p className="mt-2 text-muted-foreground">
                            Answers to the most common questions about APK Auditor.
                        </p>

                        <Accordion type="single" collapsible className="mt-6">
                            {FAQ_ITEMS.map((item, index) => (
                                <AccordionItem key={index} value={`item-${index}`}>
                                    <AccordionTrigger className="text-left">
                                        {item.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-muted-foreground">
                                        {item.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
