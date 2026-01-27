// Navigation items
export const NAV_ITEMS = [
    { label: "Features", href: "/#features" },
    { label: "Checks", href: "/#checks" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "Docs", href: "/docs" },
    { label: "Support", href: "/support" },
] as const;

// Privacy guarantees
export const PRIVACY_GUARANTEES = [
    {
        icon: "Shield",
        title: "No Uploads",
        description: "Your APK stays on your device. Nothing is sent to any server.",
    },
    {
        icon: "WifiOff",
        title: "No Network Calls",
        description: "Zero network requests during analysis. Fully air-gapped scan.",
    },
    {
        icon: "EyeOff",
        title: "No Telemetry",
        description: "No analytics, tracking, or fingerprinting. Ever.",
    },
    {
        icon: "CloudOff",
        title: "Offline Capable",
        description: "Works offline after first load. No internet required.",
    },
] as const;

// Features
export const FEATURES = [
    {
        icon: "ClipboardCheck",
        title: "MASVS-Aligned Checks",
        description:
            "34 security checks mapped to OWASP MASVS v2.1 categories for comprehensive coverage.",
    },
    {
        icon: "Key",
        title: "Secrets Detection",
        description:
            "Regex patterns + entropy analysis to catch hardcoded API keys, tokens, and credentials.",
    },
    {
        icon: "Activity",
        title: "Tracker Detection",
        description:
            "Identify 25+ analytics, advertising, and attribution SDKs embedded in your app.",
    },
    {
        icon: "FileWarning",
        title: "Manifest Analysis",
        description:
            "Flag dangerous settings: debuggable, backup, cleartext traffic, exported components.",
    },
    {
        icon: "FileText",
        title: "PDF Reports",
        description:
            "Export professional security reports with findings, severity, and remediation guidance.",
    },
    {
        icon: "Laptop",
        title: "100% Client-Side",
        description:
            "All processing happens in your browser using JavaScript. Zero server dependencies.",
    },
] as const;

// Check categories
export const CHECK_CATEGORIES = [
    {
        id: "permissions",
        title: "Permissions",
        icon: "Shield",
        count: 8,
        description: "Dangerous permission detection and over-privilege analysis",
        examples: ["READ_CONTACTS", "FINE_LOCATION", "CAMERA", "READ_SMS"],
    },
    {
        id: "secrets",
        title: "Secrets",
        icon: "Key",
        count: 7,
        description: "API keys, tokens, credentials, and high-entropy strings",
        examples: ["AWS Keys", "Google API", "Stripe", "Private Keys"],
    },
    {
        id: "trackers",
        title: "Trackers",
        icon: "Activity",
        count: 25,
        description: "Analytics, advertising, and attribution SDK detection",
        examples: ["Firebase", "Facebook", "AdMob", "AppsFlyer"],
    },
    {
        id: "manifest",
        title: "Manifest",
        icon: "FileCode",
        count: 8,
        description: "Security flags, exported components, and deep links",
        examples: ["debuggable", "allowBackup", "cleartext", "exported"],
    },
] as const;

// How it works steps
export const HOW_IT_WORKS = [
    {
        step: 1,
        title: "Drop Your APK",
        description:
            "Drag and drop your APK file or click to browse. Max 200MB supported.",
        icon: "Upload",
    },
    {
        step: 2,
        title: "Local Analysis",
        description:
            "Parse manifest, extract strings, detect trackers—all in your browser.",
        icon: "Cpu",
    },
    {
        step: 3,
        title: "Review & Export",
        description:
            "Browse findings by category, severity, and MASVS mapping. Export PDF report.",
        icon: "FileCheck",
    },
] as const;

// Testimonials (example feedback)
export const TESTIMONIALS = [
    {
        quote:
            "Finally, a security scanner I can trust with client NDAs. No uploads means no liability.",
        author: "Security Consultant",
        title: "Freelance Pentester",
    },
    {
        quote:
            "The MASVS mapping makes it easy to explain findings to stakeholders. Clean, professional reports.",
        author: "Mobile Dev Lead",
        title: "Fintech Startup",
    },
    {
        quote:
            "I use this before every Play Store submission. Catches secrets I accidentally left in builds.",
        author: "Indie Developer",
        title: "Solo Android Dev",
    },
] as const;

// FAQ items
export const FAQ_ITEMS = [
    {
        question: "Is my APK really never uploaded?",
        answer:
            "Correct. APK Auditor runs 100% in your browser using JavaScript. The APK file is read locally using the File API and JSZip. Open DevTools Network tab during a scan—you'll see zero requests.",
    },
    {
        question: "What's the maximum APK size supported?",
        answer:
            "We recommend APKs under 100MB for best performance. Files up to 200MB are supported but may be slower. Very large APKs (games with assets) may hit browser memory limits.",
    },
    {
        question: "How accurate is the secrets detection?",
        answer:
            "We use pattern matching (regex) for known key formats (AWS, Google, Stripe, etc.) plus entropy analysis for unknown secrets. Like any static scanner, there may be false positives—always verify findings.",
    },
    {
        question: "Does this replace a full security audit?",
        answer:
            "No. APK Auditor is a lightweight static scanner for quick checks. For production apps, complement with dynamic analysis, pentesting, and manual code review.",
    },
    {
        question: "Can I use this offline?",
        answer:
            "Yes. After the first load, the app is cached by a service worker. You can run scans completely offline—no internet connection required.",
    },
    {
        question: "Is the source code available?",
        answer:
            "Yes. APK Auditor is open source. You can audit the code, self-host, or contribute improvements.",
    },
] as const;

// Severity levels
export const SEVERITY_LEVELS = [
    { id: "critical", label: "Critical", color: "red" },
    { id: "high", label: "High", color: "orange" },
    { id: "medium", label: "Medium", color: "yellow" },
    { id: "low", label: "Low", color: "green" },
    { id: "info", label: "Info", color: "blue" },
] as const;
