"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("[ErrorBoundary] Caught error:", error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex min-h-[400px] items-center justify-center bg-background p-8">
                    <div className="mx-auto max-w-md text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
                            <AlertTriangle className="h-8 w-8 text-destructive" />
                        </div>
                        <h2 className="text-xl font-bold">Something went wrong</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {this.state.error?.message || "An unexpected error occurred while rendering the scanner."}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            The analysis runs entirely in your browser — no data was sent anywhere.
                        </p>
                        <div className="mt-6 flex justify-center gap-3">
                            <Button variant="outline" onClick={() => window.location.reload()}>
                                <RefreshCw className="mr-1.5 h-4 w-4" />
                                Reload Page
                            </Button>
                            <Button onClick={this.handleRetry}>
                                Try Again
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
