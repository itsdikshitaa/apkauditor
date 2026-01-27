import { Shield, WifiOff, EyeOff, CloudOff } from "lucide-react";

const GUARANTEES = [
    {
        icon: Shield,
        title: "No Uploads",
        description: "APK stays on your device",
    },
    {
        icon: WifiOff,
        title: "No Network Calls",
        description: "Zero requests during scan",
    },
    {
        icon: EyeOff,
        title: "No Telemetry",
        description: "No analytics or tracking",
    },
    {
        icon: CloudOff,
        title: "Offline Capable",
        description: "Works without internet",
    },
];

export function PrivacyStrip() {
    return (
        <section className="privacy-gradient border-y border-primary/10">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8">
                    {GUARANTEES.map((item) => (
                        <div key={item.title} className="flex items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                                <item.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-sm font-medium">{item.title}</h3>
                                <p className="text-xs text-muted-foreground">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
