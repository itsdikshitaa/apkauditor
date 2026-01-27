/**
 * AXML Parser - Android Binary XML Decoder
 * Parses binary AndroidManifest.xml format to readable XML
 */

// String pool chunk type
const CHUNK_TYPE_STRING_POOL = 0x0001;
// const CHUNK_TYPE_XML = 0x0003; // Unused
const CHUNK_TYPE_START_NAMESPACE = 0x0100;
// const CHUNK_TYPE_END_NAMESPACE = 0x0101; // Unused
const CHUNK_TYPE_START_ELEMENT = 0x0102;
const CHUNK_TYPE_END_ELEMENT = 0x0103;
const CHUNK_TYPE_TEXT = 0x0104;
// const CHUNK_TYPE_RESOURCE_MAP = 0x0180; // Unused

// Attribute types
// const TYPE_NULL = 0x00; // Unused
const TYPE_REFERENCE = 0x01;
const TYPE_STRING = 0x03;
const TYPE_FLOAT = 0x04;
const TYPE_INT_DEC = 0x10;
const TYPE_INT_HEX = 0x11;
const TYPE_INT_BOOLEAN = 0x12;

interface XmlAttribute {
    name: string;
    value: string;
}

interface ParsedElement {
    name: string;
    namespace: string;
    attributes: XmlAttribute[];
}

export interface Component {
    type: string;
    name: string;
    exported: boolean | null;
    permission: string;
    intentFilters: IntentFilter[];
}

export interface IntentFilter {
    actions: string[];
    categories: string[];
    data: IntentData[];
}

export interface IntentData {
    scheme?: string;
    host?: string;
    path?: string;
}

export interface ParsedManifest {
    package: string;
    versionCode: string;
    versionName: string;
    minSdkVersion: string;
    targetSdkVersion: string;
    permissions: string[];
    activities: Component[];
    services: Component[];
    receivers: Component[];
    providers: Component[];
    application: {
        debuggable?: boolean;
        allowBackup?: boolean;
        usesCleartextTraffic?: boolean;
        label?: string;
    };
    intentFilters: IntentFilter[];
    customSchemes: string[];
}

/**
 * Parse Android Binary XML to string
 */
export function parseAXML(buffer: ArrayBuffer): string {
    const view = new DataView(buffer);
    let offset = 0;

    // Read magic number
    const magic = view.getUint16(offset, true);
    if (magic !== 0x0003) {
        throw new Error("Invalid AXML magic number");
    }
    offset += 4; // Skip magic + header size

    // const fileSize = view.getUint32(offset, true); // Unused
    offset += 4;

    // Parse string pool
    const stringPool: string[] = [];
    const namespaces: Record<string, string> = {};
    const xmlOutput: string[] = [];
    let indent = 0;

    while (offset < buffer.byteLength) {
        const chunkType = view.getUint16(offset, true);
        // const headerSize = view.getUint16(offset + 2, true); // Unused
        const chunkSize = view.getUint32(offset + 4, true);

        if (chunkSize === 0) break;

        switch (chunkType) {
            case CHUNK_TYPE_STRING_POOL:
                parseStringPool(view, offset, stringPool);
                break;

            case CHUNK_TYPE_START_NAMESPACE: {
                const prefix = getString(view, stringPool, offset + 16);
                const uri = getString(view, stringPool, offset + 20);
                namespaces[uri] = prefix;
                break;
            }

            case CHUNK_TYPE_START_ELEMENT: {
                const element = parseStartElement(view, offset, stringPool, namespaces);
                const indentStr = "  ".repeat(indent);
                let attrs = element.attributes
                    .map((a) => `${a.name}="${escapeXml(a.value)}"`)
                    .join(" ");
                if (attrs) attrs = " " + attrs;
                xmlOutput.push(`${indentStr}<${element.name}${attrs}>`);
                indent++;
                break;
            }

            case CHUNK_TYPE_END_ELEMENT: {
                indent--;
                // const namespace = getString(view, stringPool, offset + 16); // Unused
                const name = getString(view, stringPool, offset + 20);
                const indentStr = "  ".repeat(indent);
                xmlOutput.push(`${indentStr}</${name}>`);
                break;
            }

            case CHUNK_TYPE_TEXT: {
                const text = getString(view, stringPool, offset + 16);
                if (text && text.trim()) {
                    const indentStr = "  ".repeat(indent);
                    xmlOutput.push(`${indentStr}${escapeXml(text)}`);
                }
                break;
            }
        }

        offset += chunkSize;
    }

    return '<?xml version="1.0" encoding="utf-8"?>\n' + xmlOutput.join("\n");
}

/**
 * Parse string pool from AXML
 */
function parseStringPool(
    view: DataView,
    chunkOffset: number,
    stringPool: string[]
) {
    const stringCount = view.getUint32(chunkOffset + 8, true);
    // const styleCount = view.getUint32(chunkOffset + 12, true); // Unused
    const flags = view.getUint32(chunkOffset + 16, true);
    const stringsStart = view.getUint32(chunkOffset + 20, true);
    const isUTF8 = (flags & 0x100) !== 0;

    const offsets: number[] = [];
    for (let i = 0; i < stringCount; i++) {
        offsets.push(view.getUint32(chunkOffset + 28 + i * 4, true));
    }

    const dataStart = chunkOffset + stringsStart;

    for (let i = 0; i < stringCount; i++) {
        const stringOffset = dataStart + offsets[i];
        try {
            if (isUTF8) {
                stringPool.push(readUTF8String(view, stringOffset));
            } else {
                stringPool.push(readUTF16String(view, stringOffset));
            }
        } catch (e) {
            console.warn("Failed to read string at index", i, e);
            stringPool.push("");
        }
    }
}

/**
 * Read UTF-8 string from position
 */
function readUTF8String(view: DataView, offset: number): string {
    // Skip char length (1-2 bytes)
    let charCount = view.getUint8(offset);
    offset++;
    if (charCount & 0x80) {
        charCount = ((charCount & 0x7f) << 8) | view.getUint8(offset);
        offset++;
    }

    // Read byte length (1-2 bytes)
    let byteCount = view.getUint8(offset);
    offset++;
    if (byteCount & 0x80) {
        byteCount = ((byteCount & 0x7f) << 8) | view.getUint8(offset);
        offset++;
    }

    const bytes = new Uint8Array(view.buffer, offset, byteCount);
    return new TextDecoder("utf-8").decode(bytes);
}

/**
 * Read UTF-16 string from position
 */
function readUTF16String(view: DataView, offset: number): string {
    let charCount = view.getUint16(offset, true);
    offset += 2;
    if (charCount & 0x8000) {
        charCount = ((charCount & 0x7fff) << 16) | view.getUint16(offset, true);
        offset += 2;
    }

    let result = "";
    for (let i = 0; i < charCount; i++) {
        const char = view.getUint16(offset + i * 2, true);
        if (char === 0) break;
        result += String.fromCharCode(char);
    }
    return result;
}

/**
 * Get string from pool by index
 */
function getString(
    view: DataView,
    stringPool: string[],
    offsetToIndex: number
): string {
    const index = view.getInt32(offsetToIndex, true);
    if (index < 0 || index >= stringPool.length) return "";
    return stringPool[index] || "";
}

/**
 * Parse start element with attributes
 */
function parseStartElement(
    view: DataView,
    offset: number,
    stringPool: string[],
    namespaces: Record<string, string>
): ParsedElement {
    const namespace = getString(view, stringPool, offset + 16);
    const name = getString(view, stringPool, offset + 20);
    // const attrStart = view.getUint16(offset + 24, true); // Unused
    // const attrSize = view.getUint16(offset + 26, true); // Unused
    const attrCount = view.getUint16(offset + 28, true);

    const attributes: XmlAttribute[] = [];
    let attrOffset = offset + 36;

    for (let i = 0; i < attrCount; i++) {
        const attrNamespace = getString(view, stringPool, attrOffset);
        const attrName = getString(view, stringPool, attrOffset + 4);
        const attrRawValue = getString(view, stringPool, attrOffset + 8);
        const typedValueType = view.getUint8(attrOffset + 15);
        const typedValueData = view.getInt32(attrOffset + 16, true);

        let value = attrRawValue;

        switch (typedValueType) {
            case TYPE_REFERENCE:
                value = `@${typedValueData.toString(16)}`;
                break;
            case TYPE_INT_DEC:
                value = typedValueData.toString();
                break;
            case TYPE_INT_HEX:
                value = `0x${typedValueData.toString(16)}`;
                break;
            case TYPE_INT_BOOLEAN:
                value = typedValueData !== 0 ? "true" : "false";
                break;
            case TYPE_FLOAT:
                const floatView = new DataView(new ArrayBuffer(4));
                floatView.setInt32(0, typedValueData, true);
                value = floatView.getFloat32(0, true).toString();
                break;
            case TYPE_STRING:
                value = attrRawValue || "";
                break;
        }

        // Build attribute name with namespace prefix
        let fullName = attrName;
        if (attrNamespace && namespaces[attrNamespace]) {
            fullName = `${namespaces[attrNamespace]}:${attrName}`;
        }

        attributes.push({ name: fullName, value: value });
        attrOffset += 20;
    }

    return { name, namespace, attributes };
}

/**
 * Escape XML special characters
 */
function escapeXml(str: string): string {
    if (!str) return "";
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

/**
 * Parse manifest XML string to object
 */
export function parseManifestXML(xmlString: string): ParsedManifest {
    const manifest: ParsedManifest = {
        package: "",
        versionCode: "",
        versionName: "",
        minSdkVersion: "",
        targetSdkVersion: "",
        permissions: [],
        activities: [],
        services: [],
        receivers: [],
        providers: [],
        application: {},
        intentFilters: [],
        customSchemes: [],
    };

    try {
        // Extract package name
        const packageMatch = xmlString.match(/package="([^"]+)"/);
        if (packageMatch) manifest.package = packageMatch[1];

        // Extract version info
        const versionCodeMatch = xmlString.match(/android:versionCode="([^"]+)"/);
        if (versionCodeMatch) manifest.versionCode = versionCodeMatch[1];

        const versionNameMatch = xmlString.match(/android:versionName="([^"]+)"/);
        if (versionNameMatch) manifest.versionName = versionNameMatch[1];

        // Extract SDK versions from uses-sdk
        const minSdkMatch = xmlString.match(/android:minSdkVersion="([^"]+)"/);
        if (minSdkMatch) manifest.minSdkVersion = minSdkMatch[1];

        const targetSdkMatch = xmlString.match(/android:targetSdkVersion="([^"]+)"/);
        if (targetSdkMatch) manifest.targetSdkVersion = targetSdkMatch[1];

        // Extract permissions
        const permRegex = /<uses-permission[^>]*android:name="([^"]+)"[^>]*\/?>/g;
        let match;
        while ((match = permRegex.exec(xmlString)) !== null) {
            manifest.permissions.push(match[1]);
        }

        // Extract application attributes
        const appMatch = xmlString.match(/<application([^>]*)>/);
        if (appMatch) {
            const appAttrs = appMatch[1];

            const debugMatch = appAttrs.match(/android:debuggable="([^"]+)"/);
            manifest.application.debuggable = debugMatch
                ? debugMatch[1] === "true"
                : false;

            const backupMatch = appAttrs.match(/android:allowBackup="([^"]+)"/);
            manifest.application.allowBackup = backupMatch
                ? backupMatch[1] !== "false"
                : true;

            const cleartextMatch = appAttrs.match(
                /android:usesCleartextTraffic="([^"]+)"/
            );
            manifest.application.usesCleartextTraffic = cleartextMatch
                ? cleartextMatch[1] === "true"
                : false;

            const labelMatch = appAttrs.match(/android:label="([^"]+)"/);
            manifest.application.label = labelMatch ? labelMatch[1] : "";
        }

        // Extract components
        const activityRegex = /<activity([^>]*)(?:\/>|>[\s\S]*?<\/activity>)/g;
        while ((match = activityRegex.exec(xmlString)) !== null) {
            const activity = parseComponent(match[0], "activity");
            manifest.activities.push(activity);
            if (activity.intentFilters.length > 0) {
                manifest.intentFilters.push(...activity.intentFilters);
            }
        }

        const serviceRegex = /<service([^>]*)(?:\/>|>[\s\S]*?<\/service>)/g;
        while ((match = serviceRegex.exec(xmlString)) !== null) {
            const service = parseComponent(match[0], "service");
            manifest.services.push(service);
        }

        const receiverRegex = /<receiver([^>]*)(?:\/>|>[\s\S]*?<\/receiver>)/g;
        while ((match = receiverRegex.exec(xmlString)) !== null) {
            const receiver = parseComponent(match[0], "receiver");
            manifest.receivers.push(receiver);
        }

        const providerRegex = /<provider([^>]*)(?:\/>|>[\s\S]*?<\/provider>)/g;
        while ((match = providerRegex.exec(xmlString)) !== null) {
            const provider = parseComponent(match[0], "provider");
            manifest.providers.push(provider);
        }

        // Extract custom URL schemes
        const schemeRegex = /<data[^>]*android:scheme="([^"]+)"[^>]*\/?>/g;
        while ((match = schemeRegex.exec(xmlString)) !== null) {
            if (!["http", "https", "content", "file"].includes(match[1])) {
                manifest.customSchemes.push(match[1]);
            }
        }
    } catch (e) {
        console.error("Error parsing manifest:", e);
    }

    return manifest;
}

/**
 * Parse a component (activity, service, receiver, provider) from XML
 */
function parseComponent(componentXml: string, type: string): Component {
    const component: Component = {
        type,
        name: "",
        exported: null,
        permission: "",
        intentFilters: [],
    };

    const nameMatch = componentXml.match(/android:name="([^"]+)"/);
    if (nameMatch) component.name = nameMatch[1];

    const exportedMatch = componentXml.match(/android:exported="([^"]+)"/);
    if (exportedMatch) component.exported = exportedMatch[1] === "true";

    const permMatch = componentXml.match(/android:permission="([^"]+)"/);
    if (permMatch) component.permission = permMatch[1];

    // Check for intent-filter (implies exported=true if not specified)
    const hasIntentFilter = componentXml.includes("<intent-filter");
    if (component.exported === null && hasIntentFilter) {
        // Prior to Android 12, having an intent-filter meant exported=true by default
        component.exported = true;
    }

    // Parse intent filters
    const filterRegex = /<intent-filter[\s\S]*?<\/intent-filter>/g;
    let match;
    while ((match = filterRegex.exec(componentXml)) !== null) {
        const filter: IntentFilter = {
            actions: [],
            categories: [],
            data: [],
        };

        const actionRegex = /<action[^>]*android:name="([^"]+)"/g;
        let actionMatch;
        while ((actionMatch = actionRegex.exec(match[0])) !== null) {
            filter.actions.push(actionMatch[1]);
        }

        const catRegex = /<category[^>]*android:name="([^"]+)"/g;
        let catMatch;
        while ((catMatch = catRegex.exec(match[0])) !== null) {
            filter.categories.push(catMatch[1]);
        }

        const dataRegex = /<data([^>]*)\/?>/g;
        let dataMatch;
        while ((dataMatch = dataRegex.exec(match[0])) !== null) {
            const dataAttrs = dataMatch[1];
            const data: IntentData = {};

            const schemeM = dataAttrs.match(/android:scheme="([^"]+)"/);
            if (schemeM) data.scheme = schemeM[1];

            const hostM = dataAttrs.match(/android:host="([^"]+)"/);
            if (hostM) data.host = hostM[1];

            const pathM = dataAttrs.match(/android:path="([^"]+)"/);
            if (pathM) data.path = pathM[1];

            if (Object.keys(data).length > 0) {
                filter.data.push(data);
            }
        }

        component.intentFilters.push(filter);
    }

    return component;
}
