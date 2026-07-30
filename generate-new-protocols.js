/**
 * Generate Updated Therapy Protocol Docs from Google Doc parsed JSON
 * 9pt body, 6pt references (italic), 12pt title (bold centered), 0.5" margins
 * Max one page per protocol
 *
 * Run: node generate-new-protocols.js
 */

const fs = require('fs');
const path = require('path');
const {
    Document, Packer, Paragraph, TextRun,
    Header, Footer, AlignmentType, BorderStyle, PageOrientation,
    convertInchesToTwip,
} = require('docx');

const PROTO_DIR = path.join(__dirname, 'therapy-protocols');
const PARSED = path.join(__dirname, 'protocols-parsed.json');
if (!fs.existsSync(PROTO_DIR)) fs.mkdirSync(PROTO_DIR, { recursive: true });

const { protocols } = JSON.parse(fs.readFileSync(PARSED, 'utf8'));

// docx uses half-points; size: 18 = 9pt, size: 24 = 12pt, size: 12 = 6pt

const FONT = "Calibri";

function clean(text) {
    return text
        .replace(/\\!/g, '!')
        .replace(/\\\*/g, '*')
        .replace(/\*\*/g, '')
        .replace(/\u2014/g, '\u2014')
        .replace(/[ \t]+/g, ' ')
        .trim();
}

function prettifyTitle(name) {
    // Strip trailing "PROTOCOL" or "PROGRAM" and title case it
    let t = name.replace(/\s+/g, ' ').trim();
    // Keep PROTOCOL suffix; just convert ALL CAPS to Title Case
    return t.split(' ').map(w => {
        // Keep common acronyms uppercase
        if (/^(AC|SC|ACL|UCL|LUCL|MDI|SLAP|RCR|TSA|ORIF|ROM|MFC|CMC|LRTI|PIP|DIP|MCP|MP|DRUJ|TFCC|EPL|EPB|FDS|FDP|APL|APB|FCU|FCR|ECU|ECRL|ECRB|ED|EI|EIP|EDM|AIN|PIN|EMG|NCS|CT|MRI|XR|NSAID|ROM|AROM|PROM|AAROM|USA|MD|PT|OT|CHT|I|II|III|IV|V|VI|POD|AAOS|AOFAS|ASSH|ASES|JBJS|JSES|LHB|RCR)$/i.test(w.replace(/[().,:;]/g, ''))) {
            return w.toUpperCase();
        }
        if (w === '&' || w === '-' || w === '/' || w === '+') return w;
        if (w.length === 0) return w;
        return w[0].toUpperCase() + w.slice(1).toLowerCase();
    }).join(' ');
}

// Small helper builders (all Calibri)
function text(str, opts = {}) {
    return new TextRun({ text: str, font: FONT, size: opts.size || 18, bold: opts.bold || false, italics: opts.italic || false, color: opts.color || "000000" });
}

function para(runs, opts = {}) {
    return new Paragraph({
        alignment: opts.alignment || AlignmentType.LEFT,
        spacing: { before: opts.before || 0, after: opts.after || 0, line: opts.line || 200 },
        indent: opts.indent,
        children: Array.isArray(runs) ? runs : [runs],
    });
}

function headerElem() {
    return new Header({
        children: [
            new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { after: 20 },
                border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "1a3a5c", space: 2 } },
                children: [
                    new TextRun({ text: "James D. Oosten, MD", font: FONT, size: 16, bold: true, color: "1a3a5c" }),
                    new TextRun({ text: "   \u2014   Upper Extremity Orthopedic Surgery   \u2014   ", font: FONT, size: 12, color: "666666" }),
                    new TextRun({ text: "jamesoostenmd.com", font: FONT, size: 12, color: "3d8eb9" }),
                ],
            }),
        ],
    });
}

function footerElem() {
    return new Footer({
        children: [
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({ text: "For educational purposes. Modify per clinical judgment and patient-specific factors.", font: FONT, size: 12, italics: true, color: "999999" }),
                ],
            }),
        ],
    });
}

// ---------- Parser for rawText ----------

function parseProtocol(raw) {
    // Normalize: collapse multiple blank lines, split to paragraphs
    const lines = raw.split(/\n/).map(l => clean(l)).filter(l => l.length > 0);
    const p = {
        patientFields: [],  // e.g. ["Name: ___", "Diagnosis: ___"]
        freqDuration: [],   // Frequency/Duration lines
        sections: [],       // [{ header: "Weeks 2-6 (Phase I)", bullets: ["...", "..."] }]
        modalities: null,
        reference: null,
        signature: null,
        notes: [],          // miscellaneous "Note:" blocks
    };

    let currentSection = null;
    const patientKeys = /^(Name|Diagnosis|Date of Surgery):/i;
    const freqKey = /^(Frequency|Duration):/i;
    const phaseHeader = /^(Weeks?\s+[\d+\-\u2013]+|Days?\s+[\d+\-\u2013]+|Phase\s+[IV\d]+|POD\s+\d|Day\s+[\d+\-\u2013]+|Months?\s+[\d+\-\u2013]+|Stage\s+[\d]+|Beginning|Immediate|Early|Late|Long-?Term|Post-?Op|Return to).{0,120}[:]?$/i;
    const modalitiesKey = /^Modalities?:/i;
    const refKey = /^(Primary Reference|Reference|References|Source|Citations?):/i;
    const sigKey = /^(Signature|Therapist Signature|MD Signature)/i;
    const noteKey = /^Note:/i;
    const donorKey = /^(Donor Site|Contralateral)/i;

    for (const line of lines) {
        if (patientKeys.test(line)) {
            p.patientFields.push(line);
        } else if (freqKey.test(line)) {
            p.freqDuration.push(line);
        } else if (modalitiesKey.test(line)) {
            p.modalities = line;
            currentSection = null;
        } else if (refKey.test(line)) {
            p.reference = line;
            currentSection = null;
        } else if (sigKey.test(line)) {
            p.signature = line;
            currentSection = null;
        } else if (noteKey.test(line)) {
            p.notes.push(line);
            currentSection = null;
        } else if (phaseHeader.test(line) && line.length < 150) {
            // Looks like a phase header
            currentSection = { header: line.replace(/:$/, ''), bullets: [] };
            p.sections.push(currentSection);
        } else if (donorKey.test(line)) {
            currentSection = { header: line.replace(/:$/, ''), bullets: [] };
            p.sections.push(currentSection);
        } else {
            // Body content
            if (!currentSection) {
                // Floating content before any phase — create a "General" section
                currentSection = { header: '', bullets: [] };
                p.sections.push(currentSection);
            }
            currentSection.bullets.push(line);
        }
    }

    return p;
}

// ---------- Render a parsed protocol into paragraphs ----------

function buildParagraphs(name, parsed) {
    const paras = [];
    const title = prettifyTitle(name);

    // Title: 12pt bold centered
    paras.push(new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 60, line: 220 },
        children: [ new TextRun({ text: title, font: FONT, size: 24, bold: true, color: "1a3a5c" }) ],
    }));

    // Patient fields - compress into 2 lines with tabs
    if (parsed.patientFields.length > 0) {
        // Build a compact 2-line block: Name  Diagnosis | Date of Surgery
        const byKey = {};
        parsed.patientFields.forEach(f => {
            const [k, v] = f.split(':');
            byKey[k.trim().toLowerCase()] = (v || '').trim();
        });
        paras.push(new Paragraph({
            spacing: { before: 40, after: 20, line: 200 },
            children: [
                new TextRun({ text: "Name: ", font: FONT, size: 18, bold: true }),
                new TextRun({ text: "_______________________________  ", font: FONT, size: 18 }),
                new TextRun({ text: "Date of Surgery: ", font: FONT, size: 18, bold: true }),
                new TextRun({ text: "_______________________________", font: FONT, size: 18 }),
            ],
        }));
        paras.push(new Paragraph({
            spacing: { before: 0, after: 40, line: 200 },
            children: [
                new TextRun({ text: "Diagnosis: ", font: FONT, size: 18, bold: true }),
                new TextRun({ text: "________________________________________________________________________", font: FONT, size: 18 }),
            ],
        }));
    }

    // Frequency/Duration on single compact line
    if (parsed.freqDuration.length > 0) {
        const runs = [];
        parsed.freqDuration.forEach((fd, i) => {
            const [k, v] = fd.split(':');
            if (i > 0) runs.push(new TextRun({ text: "    ", font: FONT, size: 18 }));
            runs.push(new TextRun({ text: (k || '').trim() + ": ", font: FONT, size: 18, bold: true }));
            runs.push(new TextRun({ text: (v || '').trim(), font: FONT, size: 18 }));
        });
        paras.push(new Paragraph({
            spacing: { before: 0, after: 60, line: 200 },
            children: runs,
            border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "dddddd", space: 4 } },
        }));
    }

    // Sections: phase header (bold) + bulleted content
    parsed.sections.forEach(sec => {
        if (sec.header) {
            paras.push(new Paragraph({
                spacing: { before: 60, after: 20, line: 200 },
                children: [ new TextRun({ text: sec.header, font: FONT, size: 18, bold: true, color: "2a5a8c" }) ],
            }));
        }
        sec.bullets.forEach(b => {
            paras.push(new Paragraph({
                spacing: { before: 0, after: 10, line: 200 },
                indent: { left: 180, hanging: 140 },
                children: [
                    new TextRun({ text: "\u2022  ", font: FONT, size: 18 }),
                    new TextRun({ text: b, font: FONT, size: 18 }),
                ],
            }));
        });
    });

    // Notes
    parsed.notes.forEach(n => {
        paras.push(new Paragraph({
            spacing: { before: 40, after: 20, line: 200 },
            children: [
                new TextRun({ text: n, font: FONT, size: 16, italics: true, color: "444444" }),
            ],
        }));
    });

    // Modalities: small single line
    if (parsed.modalities) {
        paras.push(new Paragraph({
            spacing: { before: 40, after: 20, line: 200 },
            children: [ new TextRun({ text: parsed.modalities, font: FONT, size: 16, italics: true, color: "444444" }) ],
        }));
    }

    // Reference: 6pt italic
    if (parsed.reference) {
        paras.push(new Paragraph({
            spacing: { before: 40, after: 20, line: 180 },
            children: [ new TextRun({ text: parsed.reference, font: FONT, size: 12, italics: true, color: "666666" }) ],
        }));
    }

    // Signature line
    paras.push(new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 60, after: 0, line: 200 },
        children: [
            new TextRun({ text: "Therapist Signature: ", font: FONT, size: 16 }),
            new TextRun({ text: "_______________________  ", font: FONT, size: 16 }),
            new TextRun({ text: "Date: ", font: FONT, size: 16 }),
            new TextRun({ text: "__________", font: FONT, size: 16 }),
        ],
    }));

    return paras;
}

async function buildDocForProtocol(proto) {
    const parsed = parseProtocol(proto.rawText);
    const children = buildParagraphs(proto.name, parsed);
    const doc = new Document({
        creator: "James D. Oosten, MD",
        title: proto.name,
        description: "Rehabilitation protocol",
        styles: {
            default: { document: { run: { font: FONT, size: 18 } } },
        },
        sections: [{
            properties: {
                page: {
                    size: { orientation: PageOrientation.PORTRAIT },
                    margin: {
                        top: convertInchesToTwip(0.5),
                        right: convertInchesToTwip(0.5),
                        bottom: convertInchesToTwip(0.5),
                        left: convertInchesToTwip(0.5),
                    },
                },
            },
            headers: { default: headerElem() },
            footers: { default: footerElem() },
            children,
        }],
    });
    const buf = await Packer.toBuffer(doc);
    const outPath = path.join(PROTO_DIR, proto.filename);
    fs.writeFileSync(outPath, buf);
    return outPath;
}

(async () => {
    console.log(`Generating ${protocols.length} protocols to ${PROTO_DIR}...`);
    let ok = 0, fail = 0;
    for (const p of protocols) {
        try {
            await buildDocForProtocol(p);
            ok++;
        } catch (e) {
            console.error('FAILED:', p.filename, e.message);
            fail++;
        }
    }
    console.log(`Done. OK: ${ok}, Failed: ${fail}`);
})();
