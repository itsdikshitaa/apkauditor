/**
 * APK Auditor - Premium Dark PDF Report Generator
 * Design System: AMOLED Dark, Teal Accents, Pixel-Perfect Audit Style
 */

import { jsPDF } from "jspdf";
import { CheckResults } from "./check-runner";

// --- Design Tokens ---

const THEME = {
    colors: {
        bg: [0, 0, 0], // True Black
        surface: [18, 18, 18], // Dark Grey for Cards
        surfaceHighlight: [30, 30, 35], // Lighter for headers/interactions
        border: [40, 40, 40],
        accent: [20, 184, 166], // Teal-500 (#14b8a6)
        text: {
            primary: [255, 255, 255],
            secondary: [161, 161, 170], // Zinc-400
            muted: [82, 82, 91], // Zinc-600
        },
        severity: {
            critical: [239, 68, 68], // Red-500
            high: [249, 115, 22], // Orange-500
            medium: [234, 179, 8], // Yellow-500
            low: [34, 197, 94], // Green-500
            info: [59, 130, 246], // Blue-500
        },
    },
    layout: {
        margin: 20,
        grid: 8, // Base grid unit
        pageWidth: 210, // A4 width in mm
        pageHeight: 297, // A4 height in mm
    },
    typography: {
        h1: 24,
        h2: 18,
        h3: 14,
        body: 10,
        small: 8,
        code: 9,
    },
};

interface AppInfo {
    appName: string;
    packageName: string;
    versionName: string;
    minSdk: string | number;
    targetSdk: string | number;
    fileSize: string;
}

// --- Helper Functions ---

/**
 * Draws the AMOLED background on the current page
 */
function drawPageBackground(doc: jsPDF) {
    doc.setFillColor(
        THEME.colors.bg[0],
        THEME.colors.bg[1],
        THEME.colors.bg[2]
    );
    doc.rect(
        0,
        0,
        THEME.layout.pageWidth,
        THEME.layout.pageHeight,
        "F"
    );
}

/**
 * Draws the standard header and footer
 */
function drawHeaderFooter(doc: jsPDF, pageNum: number, totalPages: number, appName: string) {
    const { margin, pageWidth, pageHeight } = THEME.layout;

    // -- Header --
    // Tiny accent line at top
    doc.setDrawColor(THEME.colors.accent[0], THEME.colors.accent[1], THEME.colors.accent[2]);
    doc.setLineWidth(1);
    doc.line(0, 0, pageWidth, 0);

    // App Name (Top Right)
    doc.setFontSize(8);
    doc.setTextColor(THEME.colors.text.muted[0], THEME.colors.text.muted[1], THEME.colors.text.muted[2]);
    doc.text(appName, pageWidth - margin, 15, { align: "right" });

    // -- Footer --
    const footerY = pageHeight - 15;

    // Privacy Badge
    doc.setTextColor(THEME.colors.accent[0], THEME.colors.accent[1], THEME.colors.accent[2]);
    doc.setFont("helvetica", "bold");
    doc.text("PRIVACY GUARANTEED", margin, footerY);

    doc.setTextColor(THEME.colors.text.muted[0], THEME.colors.text.muted[1], THEME.colors.text.muted[2]);
    doc.setFont("helvetica", "normal");
    doc.text(" |  Analyzed locally on device", margin + 40, footerY);

    // Page Numbers
    // Note: Total pages might not be known during stream generation, but we pass it if we can or just "Page X"
    const pageText = totalPages ? `Page ${pageNum} of ${totalPages}` : `Page ${pageNum}`;
    doc.text(pageText, pageWidth - margin, footerY, { align: "right" });
}

/**
 * Draws a rounded card background
 */
function drawCard(doc: jsPDF, x: number, y: number, w: number, h: number) {
    doc.setFillColor(THEME.colors.surface[0], THEME.colors.surface[1], THEME.colors.surface[2]);
    doc.setDrawColor(THEME.colors.border[0], THEME.colors.border[1], THEME.colors.border[2]);
    doc.roundedRect(x, y, w, h, 2, 2, "FD");
}

/**
 * Draws a severity pill/badge
 */
function drawSeverityBadge(doc: jsPDF, severity: string, x: number, y: number) {
    const color = getSeverityColor(severity);
    const width = 24;
    const height = 6;

    // Pill background
    doc.setFillColor(color[0], color[1], color[2]);
    doc.roundedRect(x, y, width, height, 2, 2, "F");

    // Text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text(severity.toUpperCase(), x + (width / 2), y + 4.2, { align: "center" });
}

function getSeverityColor(severity: string) {
    switch (severity?.toLowerCase()) {
        case "critical": return THEME.colors.severity.critical;
        case "high": return THEME.colors.severity.high;
        case "medium": return THEME.colors.severity.medium;
        case "low": return THEME.colors.severity.low;
        case "info": return THEME.colors.severity.info;
        default: return THEME.colors.severity.info;
    }
}

/**
 * Main PDF Generation Function
 */
export function generatePdfReport(appInfo: AppInfo, results: CheckResults): jsPDF {
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    let currentPage = 1;
    const { margin, pageWidth, pageHeight } = THEME.layout;
    const contentWidth = pageWidth - (margin * 2);

    const checkPageBreak = (neededHeight: number) => {
        if (currentY + neededHeight > pageHeight - 30) {
            doc.addPage();
            currentPage++;
            drawPageBackground(doc);
            drawHeaderFooter(doc, currentPage, 0, appInfo.appName);
            currentY = margin + 10;
            return true;
        }
        return false;
    };

    // --- PAGE 1: COVER ---
    drawPageBackground(doc);

    let currentY = 60;

    // Title Block
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(THEME.colors.accent[0], THEME.colors.accent[1], THEME.colors.accent[2]);
    doc.text("APK AUDITOR SECURITY REPORT", margin, currentY);

    currentY += 15;
    doc.setFontSize(32);
    doc.setTextColor(THEME.colors.text.primary[0], THEME.colors.text.primary[1], THEME.colors.text.primary[2]);
    doc.text("Security\nAssessment", margin, currentY);

    currentY += 25;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(THEME.typography.body);
    doc.setTextColor(THEME.colors.text.secondary[0], THEME.colors.text.secondary[1], THEME.colors.text.secondary[2]);
    const dateStr = new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' });
    doc.text(`Generated on ${dateStr}`, margin, currentY);

    // App Metadata Card
    currentY += 30;
    const cardHeight = 50;
    drawCard(doc, margin, currentY, contentWidth, cardHeight);

    // Inside Card
    let cardY = currentY + 15;
    const labelX = margin + 10;

    // Row 1: App Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(THEME.colors.text.primary[0], THEME.colors.text.primary[1], THEME.colors.text.primary[2]);
    doc.text(appInfo.appName, labelX, cardY);

    cardY += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(THEME.colors.text.secondary[0], THEME.colors.text.secondary[1], THEME.colors.text.secondary[2]);
    doc.text(appInfo.packageName, labelX, cardY);

    // Meta Grid inside card
    cardY += 15;
    const metaItems = [
        { label: "Version", value: appInfo.versionName },
        { label: "Size", value: appInfo.fileSize },
        { label: "Min SDK", value: appInfo.minSdk?.toString() },
        { label: "Target SDK", value: appInfo.targetSdk?.toString() }
    ];

    let metaX = labelX;
    metaItems.forEach(item => {
        doc.setFontSize(8);
        doc.setTextColor(THEME.colors.text.muted[0], THEME.colors.text.muted[1], THEME.colors.text.muted[2]);
        doc.text(item.label.toUpperCase(), metaX, cardY);

        doc.setFontSize(10);
        doc.setTextColor(THEME.colors.text.primary[0], THEME.colors.text.primary[1], THEME.colors.text.primary[2]);
        doc.text(item.value || "N/A", metaX, cardY + 5);

        metaX += 35;
    });

    // Privacy Badge
    const badgeY = pageHeight - 50;
    doc.setDrawColor(THEME.colors.accent[0], THEME.colors.accent[1], THEME.colors.accent[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, badgeY, margin + 10, badgeY);

    doc.setFontSize(10);
    doc.setTextColor(THEME.colors.accent[0], THEME.colors.accent[1], THEME.colors.accent[2]);
    doc.text("100% Client-Side Analysis", margin, badgeY + 10);
    doc.setTextColor(THEME.colors.text.secondary[0], THEME.colors.text.secondary[1], THEME.colors.text.secondary[2]);
    doc.text("No data was uploaded to any server.", margin, badgeY + 15);


    // --- PAGE 2: EXECUTIVE SUMMARY ---
    doc.addPage();
    currentPage++;
    drawPageBackground(doc);
    drawHeaderFooter(doc, currentPage, 0, appInfo.appName);
    currentY = margin + 10;

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(THEME.typography.h1);
    doc.setTextColor(THEME.colors.text.primary[0], THEME.colors.text.primary[1], THEME.colors.text.primary[2]);
    doc.text("Executive Summary", margin, currentY);
    currentY += 15;

    // Severity Cards
    const cardGap = 5;
    const cardWidth = (contentWidth - (cardGap * 3)) / 4;
    const statsHeight = 25;

    const stats = [
        { label: "Critical", val: results.summary.critical, col: THEME.colors.severity.critical },
        { label: "High", val: results.summary.high, col: THEME.colors.severity.high },
        { label: "Medium", val: results.summary.medium, col: THEME.colors.severity.medium },
        { label: "Info", val: results.summary.low + results.summary.info, col: THEME.colors.severity.info }
    ];

    stats.forEach((stat, i) => {
        const x = margin + (i * (cardWidth + cardGap));
        drawCard(doc, x, currentY, cardWidth, statsHeight);

        doc.setFontSize(14);
        doc.setTextColor(stat.col[0], stat.col[1], stat.col[2]);
        doc.text(stat.val.toString(), x + (cardWidth / 2), currentY + 12, { align: "center" });

        doc.setFontSize(8);
        doc.setTextColor(THEME.colors.text.muted[0], THEME.colors.text.muted[1], THEME.colors.text.muted[2]);
        doc.text(stat.label.toUpperCase(), x + (cardWidth / 2), currentY + 20, { align: "center" });
    });

    currentY += statsHeight + 15;

    // Overview
    doc.setFontSize(THEME.typography.h2);
    doc.setTextColor(THEME.colors.text.primary[0], THEME.colors.text.primary[1], THEME.colors.text.primary[2]);
    doc.text("Overview & Top Risks", margin, currentY);
    currentY += 10;

    const allFindings = [...results.permissions, ...results.secrets, ...results.manifest]
        .filter(f => f.severity === 'critical' || f.severity === 'high')
        .slice(0, 5);

    if (allFindings.length > 0) {
        allFindings.forEach(finding => {
            drawCard(doc, margin, currentY, contentWidth, 18);

            const col = getSeverityColor(finding.severity);
            doc.setFillColor(col[0], col[1], col[2]);
            doc.circle(margin + 8, currentY + 9, 2, "F");

            doc.setFontSize(10);
            doc.setTextColor(THEME.colors.text.primary[0], THEME.colors.text.primary[1], THEME.colors.text.primary[2]);
            doc.text(finding.title, margin + 16, currentY + 7);

            doc.setFontSize(8);
            doc.setTextColor(THEME.colors.text.muted[0], THEME.colors.text.muted[1], THEME.colors.text.muted[2]);
            doc.text(`${finding.id} • ${finding.severity.toUpperCase()}`, margin + 16, currentY + 12);

            currentY += 22;
        });
    } else {
        doc.setFontSize(10);
        doc.setTextColor(THEME.colors.text.secondary[0], THEME.colors.text.secondary[1], THEME.colors.text.secondary[2]);
        doc.text("No critical or high severity risks detected.", margin, currentY);
        currentY += 10;
    }
    currentY += 10;

    // --- PAGE 3: FINDINGS TABLE ---
    checkPageBreak(50);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(THEME.typography.h2);
    doc.setTextColor(THEME.colors.text.primary[0], THEME.colors.text.primary[1], THEME.colors.text.primary[2]);
    doc.text("Findings Summary", margin, currentY);
    currentY += 12;

    const colX = { id: margin + 2, title: margin + 50, severity: pageWidth - margin - 25 };
    doc.setFillColor(THEME.colors.surfaceHighlight[0], THEME.colors.surfaceHighlight[1], THEME.colors.surfaceHighlight[2]);
    doc.rect(margin, currentY, contentWidth, 8, "F");

    doc.setFontSize(8);
    doc.setTextColor(THEME.colors.text.secondary[0], THEME.colors.text.secondary[1], THEME.colors.text.secondary[2]);
    doc.text("ID", colX.id, currentY + 5);
    doc.text("TITLE / CATEGORY", colX.title, currentY + 5);
    doc.text("SEVERITY", colX.severity, currentY + 5);

    currentY += 8;

    const allSorted = [...results.permissions, ...results.secrets, ...results.manifest]
        .sort((a, b) => {
            const order = { critical: 0, high: 1, medium: 2, low: 3, info: 4 };
            return (order[a.severity] ?? 5) - (order[b.severity] ?? 5);
        });

    allSorted.forEach((finding, i) => {
        checkPageBreak(10);

        if (i % 2 !== 0) {
            doc.setFillColor(THEME.colors.surface[0], THEME.colors.surface[1], THEME.colors.surface[2]);
            doc.rect(margin, currentY, contentWidth, 8, "F");
        }

        doc.setFont("helvetica", "normal");
        doc.setFontSize(7);

        doc.setTextColor(THEME.colors.text.primary[0], THEME.colors.text.primary[1], THEME.colors.text.primary[2]);
        doc.text(truncateText(finding.id, 20), colX.id, currentY + 5);
        doc.text(truncateText(finding.title, 55), colX.title, currentY + 5);

        const sevCol = getSeverityColor(finding.severity);
        doc.setTextColor(sevCol[0], sevCol[1], sevCol[2]);
        doc.setFont("helvetica", "bold");
        doc.text(finding.severity.toUpperCase(), colX.severity, currentY + 5);

        currentY += 8;
    });
    currentY += 20;

    // --- DETAILS PAGES ---
    const sections = [
        { name: "Permissions", items: results.permissions },
        { name: "Secrets", items: results.secrets },
        { name: "Manifest", items: results.manifest }
    ];

    sections.forEach(section => {
        if (section.items.length === 0) return;

        checkPageBreak(40);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(THEME.typography.h1);
        doc.setTextColor(THEME.colors.text.primary[0], THEME.colors.text.primary[1], THEME.colors.text.primary[2]);
        doc.text(section.name, margin, currentY);

        doc.setDrawColor(THEME.colors.border[0], THEME.colors.border[1], THEME.colors.border[2]);
        doc.line(margin, currentY + 3, pageWidth - margin, currentY + 3);

        currentY += 15;

        section.items.forEach(finding => {
            const neededHeight = 55 + (finding.match ? 20 : 0);
            checkPageBreak(neededHeight);

            // Row 1: Severity badge + Title (truncated)
            drawSeverityBadge(doc, finding.severity, margin, currentY);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(THEME.colors.text.primary[0], THEME.colors.text.primary[1], THEME.colors.text.primary[2]);
            const titleText = truncateText(finding.title, 70);
            doc.text(titleText, margin + 30, currentY + 4.5);

            currentY += 9;

            // Row 2: ID | MASVS (on its own line)
            doc.setFont("helvetica", "normal");
            doc.setFontSize(7);
            doc.setTextColor(THEME.colors.text.muted[0], THEME.colors.text.muted[1], THEME.colors.text.muted[2]);
            const metaText = finding.masvs ? `${finding.id} | ${finding.masvs}` : finding.id;
            doc.text(metaText, margin, currentY);

            currentY += 6;

            // Description
            doc.setFontSize(9);
            doc.setTextColor(THEME.colors.text.secondary[0], THEME.colors.text.secondary[1], THEME.colors.text.secondary[2]);
            const descLines = doc.splitTextToSize(finding.description, contentWidth);
            doc.text(descLines, margin, currentY);
            currentY += (descLines.length * 4) + 4;

            if (finding.match) {
                doc.setFillColor(THEME.colors.surface[0], THEME.colors.surface[1], THEME.colors.surface[2]);
                doc.roundedRect(margin, currentY, contentWidth, 12, 1, 1, "F");

                doc.setFont("courier", "normal");
                doc.setFontSize(8);
                doc.setTextColor(THEME.colors.accent[0], THEME.colors.accent[1], THEME.colors.accent[2]);
                const matchText = truncateText(finding.match, 95);
                doc.text(matchText, margin + 3, currentY + 7);
                currentY += 16;
            }

            if (finding.remediation) {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(8);
                doc.setTextColor(THEME.colors.text.primary[0], THEME.colors.text.primary[1], THEME.colors.text.primary[2]);
                doc.text("REMEDIATION:", margin, currentY);

                doc.setFont("helvetica", "normal");
                doc.setTextColor(THEME.colors.text.secondary[0], THEME.colors.text.secondary[1], THEME.colors.text.secondary[2]);
                const remLines = doc.splitTextToSize(finding.remediation, contentWidth - 25);
                doc.text(remLines, margin + 25, currentY);
                currentY += (remLines.length * 4) + 8;
            } else {
                currentY += 8;
            }

            doc.setDrawColor(THEME.colors.surfaceHighlight[0], THEME.colors.surfaceHighlight[1], THEME.colors.surfaceHighlight[2]);
            doc.line(margin, currentY - 4, contentWidth + margin, currentY - 4);
        });
        currentY += 10;
    });

    // --- FINAL: DISCLAIMER ---
    checkPageBreak(40);
    doc.setDrawColor(THEME.colors.border[0], THEME.colors.border[1], THEME.colors.border[2]);
    doc.line(margin, currentY, contentWidth + margin, currentY);
    currentY += 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(THEME.colors.text.muted[0], THEME.colors.text.muted[1], THEME.colors.text.muted[2]);
    doc.text("DISCLAIMER", margin, currentY);

    currentY += 5;
    doc.setFont("helvetica", "normal");
    const disclamer = "This automated report is detected using static analysis techniques and may contain false positives. It is intended to aid security researchers and developers in identifying potential vulnerabilities. The authors of APK Auditor assume no liability for the accuracy of these results or any damages caused by their use.";
    const dLines = doc.splitTextToSize(disclamer, contentWidth);
    doc.text(dLines, margin, currentY);

    const totalPages = currentPage;
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFillColor(THEME.colors.bg[0], THEME.colors.bg[1], THEME.colors.bg[2]);
        doc.rect(pageWidth - margin - 30, pageHeight - 20, 30, 10, "F");

        doc.setFontSize(8);
        doc.setTextColor(THEME.colors.text.muted[0], THEME.colors.text.muted[1], THEME.colors.text.muted[2]);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 15, { align: "right" });
    }

    return doc;
}

function truncateText(text: string, maxLength: number) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + "...";
}

/**
 * Export PDF
 */
export function downloadPdf(doc: jsPDF, filename: string) {
    doc.save(filename);
}
