/**
 * Generate Therapy Protocol & Shoulder Education Word Documents
 * James D. Oosten, MD — Upper Extremity Orthopedic Surgery
 *
 * Inspired by Yazdan Raji, MD protocol format:
 *   - Patient info fields (Name, Diagnosis, Date of Surgery)
 *   - Frequency/Duration
 *   - Phase-based rehabilitation with ROM goals, exercises, restrictions
 *   - Modalities
 *   - Signature/Date
 *
 * Run: node generate-therapy-protocols.js
 */

const fs = require('fs');
const path = require('path');
const {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    Header, Footer, AlignmentType, HeadingLevel, BorderStyle,
    WidthType, ShadingType, LevelFormat, PageNumber, TabStopType, TabStopPosition
} = require('docx');

const PROTO_DIR = path.join(__dirname, 'therapy-protocols');
const EDUC_DIR = path.join(__dirname, 'patient-resources');
if (!fs.existsSync(PROTO_DIR)) fs.mkdirSync(PROTO_DIR, { recursive: true });
if (!fs.existsSync(EDUC_DIR)) fs.mkdirSync(EDUC_DIR, { recursive: true });

// --- Shared Styles ---
const DOC_STYLES = {
    default: { document: { run: { font: "Calibri", size: 20 } } }, // 10pt for protocols (denser)
    paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 28, bold: true, font: "Calibri", color: "1a3a5c" },
          paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 0 } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 24, bold: true, font: "Calibri", color: "2a5a8c" },
          paragraph: { spacing: { before: 160, after: 60 }, outlineLevel: 1 } },
        { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 22, bold: true, font: "Calibri", color: "3d8eb9" },
          paragraph: { spacing: { before: 120, after: 40 }, outlineLevel: 2 } },
    ]
};

const NUMBERING = {
    config: [{
        reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 540, hanging: 270 } } } }]
    }, {
        reference: "subbullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u25E6",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 900, hanging: 270 } } } }]
    }]
};

const EDUC_STYLES = {
    default: { document: { run: { font: "Calibri", size: 22 } } },
    paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 36, bold: true, font: "Calibri", color: "1a3a5c" },
          paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 28, bold: true, font: "Calibri", color: "2a5a8c" },
          paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 } },
        { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 24, bold: true, font: "Calibri", color: "3d8eb9" },
          paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 2 } },
    ]
};

// --- Protocol Header ---
function protocolHeader() {
    return new Header({
        children: [
            new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { after: 40 },
                children: [
                    new TextRun({ text: "James D. Oosten, MD", font: "Calibri", size: 20, color: "1a3a5c", bold: true }),
                ],
            }),
            new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { after: 40 },
                children: [
                    new TextRun({ text: "Orthopedic Surgery \u2014 Upper Extremity, Hand & Shoulder", font: "Calibri", size: 16, color: "666666" }),
                ],
            }),
            new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                    new TextRun({ text: "jamesoostenmd.com", font: "Calibri", size: 16, color: "3d8eb9" }),
                ],
                border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "1a3a5c", space: 4 } }
            }),
        ]
    });
}

function protocolFooter() {
    return new Footer({
        children: [
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({ text: "This protocol is for patients under the care of Dr. Oosten. It supplements, but does not replace, individualized guidance.", font: "Calibri", size: 14, color: "999999", italics: true }),
                ],
                border: { top: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC", space: 4 } }
            }),
        ]
    });
}

function educHeader() {
    return new Header({
        children: [
            new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                    new TextRun({ text: "James D. Oosten, MD", font: "Calibri", size: 18, color: "1a3a5c", bold: true }),
                    new TextRun({ text: "  |  Upper Extremity Orthopedic Surgery", font: "Calibri", size: 18, color: "888888" }),
                ],
                border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "1a3a5c", space: 4 } }
            })
        ]
    });
}

function educFooter() {
    return new Footer({
        children: [
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({ text: "This document is for educational purposes only and does not replace personalized medical advice.", font: "Calibri", size: 16, color: "999999", italics: true }),
                ],
                border: { top: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC", space: 4 } }
            }),
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({ text: "jamesoostenmd.com", font: "Calibri", size: 16, color: "1a3a5c" }),
                    new TextRun({ text: "  |  Page ", font: "Calibri", size: 16, color: "999999" }),
                    new TextRun({ children: [PageNumber.CURRENT], font: "Calibri", size: 16, color: "999999" }),
                ]
            })
        ]
    });
}

// --- Helpers ---
function h1(t) { return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(t)] }); }
function h2(t) { return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] }); }
function h3(t) { return new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(t)] }); }
function p(t) { return new Paragraph({ spacing: { after: 80 }, children: [new TextRun(t)] }); }
function pBold(t) { return new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: t, bold: true })] }); }
function bullet(t) { return new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 }, children: [new TextRun(t)] }); }
function subBullet(t) { return new Paragraph({ numbering: { reference: "subbullets", level: 0 }, spacing: { after: 30 }, children: [new TextRun(t)] }); }
function bulletBold(label, text) {
    return new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 40 },
        children: [new TextRun({ text: label + ": ", bold: true }), new TextRun(text)] });
}

// Patient info fields for protocol header
function patientFields(title) {
    const line = "____________________________________________";
    return [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 200 },
            children: [new TextRun({ text: title, bold: true, size: 28, font: "Calibri", color: "1a3a5c" })] }),
        new Paragraph({ spacing: { after: 60 }, tabStops: [{ type: TabStopType.LEFT, position: 2000 }],
            children: [new TextRun({ text: "Name:", bold: true }), new TextRun("\t" + line)] }),
        new Paragraph({ spacing: { after: 60 }, tabStops: [{ type: TabStopType.LEFT, position: 2000 }],
            children: [new TextRun({ text: "Diagnosis:", bold: true }), new TextRun("\t" + line)] }),
        new Paragraph({ spacing: { after: 60 }, tabStops: [{ type: TabStopType.LEFT, position: 2000 }],
            children: [new TextRun({ text: "Date of Surgery:", bold: true }), new TextRun("\t" + line)] }),
        new Paragraph({ spacing: { after: 120 },
            children: [
                new TextRun({ text: "Frequency: ", bold: true }),
                new TextRun("2-3 times / week     "),
                new TextRun({ text: "Duration: ", bold: true }),
                new TextRun("1  2  3  4  5  6  Weeks")
            ] }),
    ];
}

function signatureLine() {
    return [
        new Paragraph({ spacing: { before: 200 }, children: [] }),
        new Paragraph({ spacing: { after: 40 },
            children: [
                new TextRun({ text: "Modalities: ", bold: true }),
                new TextRun("Per therapist, including electrical stimulation, ultrasound, heat before, ice after.")
            ] }),
        new Paragraph({ spacing: { before: 200 }, tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
            children: [
                new TextRun({ text: "Signature ________________________________", size: 18 }),
                new TextRun({ text: "\tDate: ______________", size: 18 })
            ] }),
    ];
}

// --- Document creators ---
async function createProtocol(filename, title, phases) {
    const children = [...patientFields(title), ...phases, ...signatureLine()];
    const doc = new Document({
        styles: DOC_STYLES, numbering: NUMBERING,
        sections: [{ properties: {
            page: { size: { width: 12240, height: 15840 }, margin: { top: 1200, right: 1080, bottom: 1080, left: 1080 } }
        }, headers: { default: protocolHeader() }, footers: { default: protocolFooter() }, children }]
    });
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(path.join(PROTO_DIR, filename), buffer);
    console.log(`  [Protocol] ${filename}`);
}

async function createEducDoc(filename, sections) {
    const doc = new Document({
        styles: EDUC_STYLES, numbering: NUMBERING,
        sections: [{ properties: {
            page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
        }, headers: { default: educHeader() }, footers: { default: educFooter() }, children: sections }]
    });
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(path.join(EDUC_DIR, filename), buffer);
    console.log(`  [Education] ${filename}`);
}

// =====================================================
// SHOULDER THERAPY PROTOCOLS
// =====================================================

const SHOULDER_PROTOCOLS = {
    "Shoulder-Rotator-Cuff-Repair.docx": ["ROTATOR CUFF REPAIR PROTOCOL", [
        pBold("Weeks 1-2: Period of Protection \u2014 No therapy for the first 2 weeks."),
        bullet("Sling with abduction pillow: Must wear at all times except for hygiene."),
        bullet("Range of Motion: No shoulder ROM allowed. Elbow/forearm/wrist/hand motion ONLY."),
        bullet("Exercises: Pendulums, grip strengthening; NO shoulder strengthening or motion exercises permitted."),
        pBold("Weeks 2-4 (Phase I):"),
        bullet("Sling with abduction pillow: Must wear at all times except for hygiene."),
        bulletBold("Range of Motion", "True PROM only! The rotator cuff tendon is healing back to the bone."),
        subBullet("Passive FF, ER, and ABD (within a comfortable range); No AROM/AAROM"),
        subBullet("ROM goals: 90\u00B0 FF / 40\u00B0 ER at side; ABD max 60-80\u00B0 without rotation"),
        bulletBold("Exercises", "Continue pendulums; begin scapular exercises (while in sling) including elevation with shrugs, depression, retraction, and protraction, grip strengthening, table slides."),
        subBullet("No resisted motions of the shoulder until 12 weeks post-op!"),
        subBullet("No canes / pulleys until 6 weeks post-op, as these are active assist exercises."),
        pBold("Weeks 4-8 (Phase II):"),
        bullet("Sling with abduction pillow: Discontinue at 6 weeks."),
        bulletBold("Range of Motion", "Progress PROM and begin AAROM \u2014 progress slowly!"),
        subBullet("Weeks 4-5: Perform in supine position."),
        subBullet("Weeks 5-6: Perform while back is propped up to 45\u00B0."),
        subBullet("Weeks 6+: Perform while in an upright position."),
        bullet("Exercises: Progress Phase I exercises; no shoulder strengthening yet."),
        pBold("Weeks 8-12 (Phase III):"),
        bulletBold("Range of Motion", "Progress to AROM in all planes \u2014 progress slowly!"),
        bulletBold("Exercises", "Begin isometric exercises (use pillow or folded towel without moving the shoulder); no resistance exercises until 12 weeks after surgery."),
        pBold("Weeks 12-16 (Phase IV):"),
        bulletBold("Range of Motion", "Progress to full, painless AROM in all planes."),
        bulletBold("Exercises", "Progress Phase III exercises, begin gentle resistance exercises with elastic band or light weights (1-5 lbs), including resisted scapular strengthening, rotator cuff strengthening, and deltoid strengthening."),
        subBullet("8-12 reps / 2-3 sets for rotator cuff, deltoid and scapular stabilizers."),
        subBullet("Strengthening only 3x/week to avoid rotator cuff tendonitis with rest between sessions."),
        subBullet("Begin eccentrically resisted motions, plyometrics (e.g., weighted ball toss), proprioception (e.g., body blade)."),
        subBullet("Do not do full or empty-can exercises \u2014 these place too much stress on the rotator cuff."),
        bullet("Begin sports-related rehab at 4.5 months, including advancing conditioning."),
        bullet("Return to throwing at 6 months; throw from pitcher\u2019s mound at 9 months."),
        bullet("Collision sports at 9 months; MMI usually at 9-12 months post-op."),
    ]],

    "Shoulder-Massive-RCR.docx": ["MASSIVE ROTATOR CUFF REPAIR PROTOCOL", [
        pBold("Weeks 1-2: Period of Protection \u2014 No therapy for the first 2 weeks."),
        bullet("Sling with abduction pillow: Must wear at all times except for hygiene."),
        bullet("Range of Motion: No shoulder ROM allowed. Elbow/forearm/wrist/hand motion ONLY."),
        bullet("Exercises: Pendulums, grip strengthening only."),
        pBold("Weeks 2-6 (Phase I):"),
        bullet("Sling with abduction pillow: Must wear at all times except for hygiene."),
        bulletBold("Range of Motion", "True PROM only! Massive repair requires extended protection."),
        subBullet("Passive FF to 90\u00B0, ER to 20-30\u00B0 at side; ABD max 60\u00B0 without rotation"),
        subBullet("No AROM/AAROM; No canes/pulleys"),
        bullet("Exercises: Pendulums, scapular exercises in sling, grip strengthening, table slides."),
        pBold("Weeks 6-10 (Phase II):"),
        bullet("Discontinue sling at 6-8 weeks (surgeon discretion based on repair quality)."),
        bulletBold("Range of Motion", "Begin AAROM cautiously. Progress slowly from supine to upright."),
        bullet("Exercises: Progress Phase I exercises; no shoulder strengthening yet."),
        pBold("Weeks 10-16 (Phase III):"),
        bulletBold("Range of Motion", "Progress to AROM in all planes \u2014 progress slowly!"),
        bullet("Begin isometric exercises at 12 weeks; no resistance until 14-16 weeks."),
        pBold("Weeks 16-24 (Phase IV):"),
        bullet("Begin gentle resistance exercises with elastic band or light weights (1-3 lbs)."),
        bullet("Progress to full strengthening by 6 months."),
        bullet("Sports-related rehab at 6+ months; MMI at 12+ months post-op."),
    ]],

    "Shoulder-Biceps-Tenodesis.docx": ["BICEPS TENODESIS PROTOCOL", [
        pBold("Weeks 1-2: Period of Protection"),
        bullet("Sling: Must wear at all times except for hygiene."),
        bullet("Range of Motion: No shoulder ROM. Elbow/forearm/wrist/hand motion ONLY."),
        bullet("No active elbow flexion against resistance for 6 weeks (biceps is healing)."),
        bullet("Exercises: Pendulums, grip strengthening."),
        pBold("Weeks 2-4 (Phase I):"),
        bullet("Sling: Continue wearing at all times except hygiene."),
        bulletBold("Range of Motion", "True PROM only. Passive FF to 90\u00B0, ER to 40\u00B0 at side."),
        bullet("No active elbow flexion against resistance."),
        bullet("Continue pendulums, scapular exercises in sling."),
        pBold("Weeks 4-8 (Phase II):"),
        bullet("Discontinue sling at 6 weeks."),
        bulletBold("Range of Motion", "Progress PROM and begin AAROM. Progress to AROM by 8 weeks."),
        bullet("Begin GENTLE active elbow flexion (no resistance) at 6 weeks."),
        pBold("Weeks 8-12 (Phase III):"),
        bullet("Progress to full AROM. Begin isometric exercises."),
        bullet("Begin gentle resistance for elbow flexion at 8-10 weeks."),
        pBold("Weeks 12-16 (Phase IV):"),
        bullet("Begin resistance exercises with elastic bands / light weights (1-5 lbs)."),
        bullet("Progress strengthening of rotator cuff, deltoid, scapular stabilizers, and biceps."),
        bullet("Sports-related rehab at 4.5 months; full return at 6 months."),
    ]],

    "Shoulder-Bankart-Repair.docx": ["ANTERIOR SHOULDER STABILIZATION / BANKART REPAIR PROTOCOL", [
        pBold("Weeks 1-2: Period of Protection"),
        bullet("Sling: Must wear at all times except for hygiene."),
        bullet("Range of Motion: No shoulder ROM. Elbow/forearm/wrist/hand motion ONLY."),
        bullet("No external rotation past neutral for 6 weeks."),
        bullet("Exercises: Pendulums, grip strengthening."),
        pBold("Weeks 2-6 (Phase I):"),
        bullet("Sling: Continue wearing at all times."),
        bulletBold("Range of Motion", "True PROM only."),
        subBullet("Passive FF to 90\u00B0; ER limited to 20-30\u00B0 at side (protect labral repair)"),
        subBullet("No ABD with ER; No AROM/AAROM"),
        bullet("Exercises: Pendulums, scapular exercises in sling, grip strengthening."),
        pBold("Weeks 6-10 (Phase II):"),
        bullet("Discontinue sling at 6 weeks."),
        bulletBold("Range of Motion", "Begin AAROM. Progress ER slowly (goal 45\u00B0 by 8 weeks)."),
        bullet("Exercises: Scapular stabilization, gentle ROM progression."),
        pBold("Weeks 10-14 (Phase III):"),
        bulletBold("Range of Motion", "Progress to AROM. Gradually increase ER goal."),
        bullet("Begin isometric strengthening at 10 weeks."),
        bullet("Begin resistance exercises at 12 weeks."),
        pBold("Weeks 14-24 (Phase IV):"),
        bullet("Progress strengthening: bands \u2192 light weights (1-5 lbs)."),
        bullet("Begin sport-specific training at 4-5 months."),
        bullet("Return to contact/collision sports at 6-9 months."),
        bullet("MMI usually at 9-12 months post-op."),
    ]],

    "Shoulder-Posterior-Stabilization.docx": ["POSTERIOR SHOULDER STABILIZATION PROTOCOL", [
        pBold("Weeks 1-2: Period of Protection"),
        bullet("Sling or brace in neutral rotation: Wear at all times except hygiene."),
        bullet("No shoulder ROM. Elbow/forearm/wrist/hand motion ONLY."),
        bullet("No internal rotation or cross-body adduction for 6 weeks."),
        bullet("Exercises: Pendulums, grip strengthening."),
        pBold("Weeks 2-6 (Phase I):"),
        bullet("Continue sling/brace at all times."),
        bulletBold("Range of Motion", "True PROM only. FF to 90\u00B0; ER permitted; NO IR past neutral."),
        bullet("Exercises: Pendulums, scapular exercises, grip strengthening."),
        pBold("Weeks 6-10 (Phase II):"),
        bullet("Discontinue sling. Begin AAROM."),
        bullet("Gradually introduce IR \u2014 progress slowly."),
        pBold("Weeks 10-16 (Phase III):"),
        bullet("Progress to AROM. Begin isometrics at 10 weeks, resistance at 12 weeks."),
        pBold("Weeks 16+ (Phase IV):"),
        bullet("Full strengthening progression. Sport-specific training at 5+ months."),
        bullet("Return to contact sports at 6-9 months. MMI at 9-12 months."),
    ]],

    "Shoulder-SLAP-Repair.docx": ["SUPERIOR LABRUM (SLAP) REPAIR PROTOCOL", [
        pBold("Weeks 1-2: Period of Protection"),
        bullet("Sling: Must wear at all times except for hygiene."),
        bullet("No shoulder ROM. Elbow/forearm/wrist/hand motion ONLY."),
        bullet("No active biceps contraction for 6 weeks (biceps anchor is healing)."),
        bullet("Exercises: Pendulums, grip strengthening."),
        pBold("Weeks 2-6 (Phase I):"),
        bullet("Continue sling. True PROM only."),
        subBullet("FF to 90\u00B0; ER to 30\u00B0 at side; No ABD with ER"),
        bullet("No active elbow flexion against resistance."),
        pBold("Weeks 6-10 (Phase II):"),
        bullet("Discontinue sling. Begin AAROM."),
        bullet("Begin gentle active elbow flexion (no resistance)."),
        pBold("Weeks 10-14 (Phase III):"),
        bullet("Progress to AROM. Begin isometrics. Resistance at 12 weeks."),
        pBold("Weeks 14-24 (Phase IV):"),
        bullet("Full strengthening. Sport-specific training at 4-5 months."),
        bullet("Return to throwing at 6 months. Contact sports at 9 months."),
    ]],

    "Shoulder-Latarjet.docx": ["CORACOID TRANSFER / LATARJET PROCEDURE PROTOCOL", [
        pBold("Weeks 1-2: Period of Protection"),
        bullet("Sling: Wear at all times except hygiene."),
        bullet("No shoulder ROM. Elbow/forearm/wrist/hand ONLY."),
        bullet("No active biceps contraction (coracoid is healing)."),
        pBold("Weeks 2-6 (Phase I):"),
        bullet("Sling at all times. True PROM only."),
        subBullet("FF to 90\u00B0; ER limited to 20-30\u00B0; No ABD with ER"),
        bullet("No active elbow flexion against resistance until 8 weeks."),
        pBold("Weeks 6-10 (Phase II):"),
        bullet("Discontinue sling. Begin AAROM."),
        bullet("Gentle active elbow flexion (no resistance)."),
        pBold("Weeks 10-16 (Phase III):"),
        bullet("Progress to AROM. Isometrics at 10 weeks. Resistance at 12 weeks."),
        pBold("Weeks 16+ (Phase IV):"),
        bullet("Full strengthening. Sport-specific at 5 months."),
        bullet("Contact sports at 6-9 months. MMI at 9-12 months."),
    ]],

    "Shoulder-MDI-Repair.docx": ["MULTIDIRECTIONAL INSTABILITY REPAIR PROTOCOL", [
        pBold("Weeks 1-4: Period of Protection"),
        bullet("Sling: Wear at all times except hygiene for 4-6 weeks."),
        bullet("No shoulder ROM for first 2 weeks. Begin gentle PROM at 2 weeks."),
        bullet("ROM limited in all directions \u2014 protect capsular plication."),
        pBold("Weeks 4-8 (Phase I):"),
        bullet("Discontinue sling at 6 weeks. Continue PROM, begin AAROM."),
        subBullet("FF to 120\u00B0; ER to 30-40\u00B0; controlled ABD"),
        pBold("Weeks 8-12 (Phase II):"),
        bullet("Progress to AROM. Begin isometrics."),
        pBold("Weeks 12-20 (Phase III):"),
        bullet("Begin resistance exercises. Progress strengthening."),
        bullet("Emphasis on scapular stabilization and dynamic rotator cuff strengthening."),
        pBold("Weeks 20+ (Phase IV):"),
        bullet("Sport-specific training. Return to sports at 6-9 months."),
    ]],

    "Shoulder-Total-Arthroplasty.docx": ["ANATOMIC TOTAL SHOULDER ARTHROPLASTY PROTOCOL", [
        pBold("Days 0-7:"),
        bullet("Home exercises: pendulums; ROM elbow, wrist, hand; grip strengthening."),
        bullet("Remain in sling for 6 weeks AT ALL TIMES (except for personal grooming)."),
        pBold("Weeks 1-6:"),
        bullet("True PROM only! The subscapularis tendon is healing back to the bone."),
        subBullet("ROM goals: Max 90\u00B0 FF / 0\u00B0 ER at side; ABD max 60\u00B0 without rotation"),
        bullet("Grip strengthening, table slides."),
        bullet("Heat before PT / Ice after PT."),
        bullet("No resisted motions of the shoulder until 12 weeks post-op!"),
        bullet("No canes / pulleys until 6 weeks post-op (these are active-assist exercises)."),
        pBold("Weeks 6-12:"),
        bullet("Begin AAROM. Advance to AROM as tolerated."),
        bullet("Light passive stretching at end ranges."),
        bullet("Begin scapular exercises, passive resistance for large muscle groups (pecs, lats)."),
        bullet("Isometrics with arm at side beginning at 8 weeks."),
        pBold("Months 3-12:"),
        bullet("Advance to full ROM as tolerated with passive stretching at end ranges."),
        bullet("Advance strengthening: isometrics \u2192 bands \u2192 light weights (1-5 lbs)."),
        subBullet("8-12 reps / 2-3 sets for rotator cuff, deltoid, and scapular stabilizers."),
        bullet("Only do strengthening 3x/week to avoid rotator cuff tendonitis."),
        bullet("Begin eccentrically resisted motions, plyometrics, proprioception."),
        bullet("Sports-related rehab at 4.5 months. Return to throwing at 6 months."),
        bullet("Collision sports at 9 months. MMI at 9-12 months."),
    ]],

    "Shoulder-Reverse-TSA-Standard.docx": ["REVERSE TOTAL SHOULDER ARTHROPLASTY PROTOCOL (STANDARD)", [
        pBold("Days 0-7:"),
        bullet("Home exercises: pendulums; ROM elbow, wrist, hand; grip strengthening."),
        bullet("Sling for 6 weeks AT ALL TIMES (except grooming)."),
        pBold("Weeks 1-6:"),
        bullet("True PROM only. The subscapularis (if repaired) and deltoid are healing."),
        subBullet("ROM goals: Max 90\u00B0 FF; No ER past neutral; ABD max 60\u00B0"),
        bullet("Grip strengthening, table slides. No resisted shoulder motions."),
        pBold("Weeks 6-12:"),
        bullet("Begin AAROM. Advance to AROM as tolerated."),
        bullet("Light stretching at end ranges. Isometrics at 8 weeks."),
        pBold("Months 3-6:"),
        bullet("Advance strengthening: isometrics \u2192 bands \u2192 light weights (1-3 lbs)."),
        bullet("Strengthening 3x/week maximum."),
        pBold("Months 6-12:"),
        bullet("Continue strengthening. Focus on deltoid and scapular stabilizers."),
        bullet("No overhead throwing or heavy lifting long-term (implant precaution)."),
        bullet("MMI at 6-12 months."),
    ]],

    "Shoulder-Reverse-TSA-Accelerated.docx": ["REVERSE TOTAL SHOULDER ARTHROPLASTY PROTOCOL (ACCELERATED)", [
        pBold("Days 0-7:"),
        bullet("Home exercises: pendulums; ROM elbow, wrist, hand; grip strengthening."),
        bullet("Sling for 4 weeks (accelerated due to intact subscapularis or surgeon discretion)."),
        pBold("Weeks 1-4:"),
        bullet("True PROM only. ROM goals: Max 90\u00B0 FF; ER to neutral; ABD max 60\u00B0."),
        bullet("Grip strengthening, table slides."),
        pBold("Weeks 4-8:"),
        bullet("Discontinue sling at 4 weeks. Begin AAROM."),
        bullet("Advance to AROM. Light stretching at end ranges."),
        pBold("Weeks 8-12:"),
        bullet("Isometrics progressing to resistance bands."),
        pBold("Months 3-6:"),
        bullet("Light weights (1-3 lbs). Focus on deltoid and scapular stabilizers."),
        bullet("No overhead throwing or heavy lifting long-term."),
        bullet("MMI at 6-12 months."),
    ]],

    "Shoulder-Hemiarthroplasty.docx": ["SHOULDER HEMIARTHROPLASTY PROTOCOL", [
        pBold("Days 0-7:"),
        bullet("Sling for 6 weeks. Pendulums, elbow/wrist/hand ROM, grip strengthening."),
        pBold("Weeks 1-6:"),
        bullet("True PROM only. Subscapularis healing."),
        subBullet("Max 90\u00B0 FF / 30\u00B0 ER at side; ABD max 60\u00B0"),
        pBold("Weeks 6-12:"),
        bullet("Begin AAROM, progress to AROM. Isometrics at 8 weeks."),
        pBold("Months 3-12:"),
        bullet("Progress strengthening. Sports rehab at 4.5 months. MMI at 9-12 months."),
    ]],

    "Shoulder-Subacromial-Decompression.docx": ["SUBACROMIAL DECOMPRESSION PROTOCOL (+/- DISTAL CLAVICLE RESECTION)", [
        pBold("Days 0-3:"),
        bullet("Sling for comfort (may discontinue early per surgeon)."),
        bullet("Begin AROM as tolerated. Cryotherapy for swelling."),
        pBold("Weeks 1-3 (Phase I):"),
        bullet("Discontinue sling. AROM in all planes as tolerated."),
        bullet("ROM goals: Full FF, ER, IR, ABD by 3-4 weeks."),
        bullet("Scapular exercises, pendulums."),
        pBold("Weeks 3-6 (Phase II):"),
        bullet("Full AROM expected. Begin isometric and light resistance exercises."),
        pBold("Weeks 6-12 (Phase III):"),
        bullet("Progressive strengthening with bands and weights (1-5 lbs)."),
        bullet("Rotator cuff, deltoid, and scapular stabilizer strengthening."),
        pBold("Weeks 12+ (Phase IV):"),
        bullet("Return to sports/full activity at 3-4 months."),
    ]],

    "Shoulder-Clavicle-ORIF-Midshaft.docx": ["MIDSHAFT CLAVICLE ORIF PROTOCOL", [
        pBold("Weeks 0-2: Period of Protection"),
        bullet("Sling for comfort. Elbow/wrist/hand ROM immediately."),
        bullet("Pendulums. No shoulder FF past 90\u00B0 or ABD past 90\u00B0."),
        pBold("Weeks 2-6 (Phase I):"),
        bullet("AAROM: FF and ABD to 90\u00B0, progressing as tolerated."),
        bullet("Discontinue sling at 3-4 weeks (as comfort allows)."),
        pBold("Weeks 6-12 (Phase II):"),
        bullet("AROM: Full ROM expected by 8 weeks."),
        bullet("Begin resistance exercises at 6-8 weeks."),
        pBold("Weeks 12+ (Phase III):"),
        bullet("Full strengthening. Contact sports at 3-4 months after radiographic union."),
    ]],

    "Shoulder-Clavicle-ORIF-Distal.docx": ["DISTAL CLAVICLE ORIF PROTOCOL", [
        pBold("Weeks 0-2: Period of Protection"),
        bullet("Sling at all times except hygiene. Elbow/wrist/hand ROM."),
        bullet("Pendulums only. No active shoulder motion."),
        pBold("Weeks 2-6 (Phase I):"),
        bullet("PROM: FF to 90\u00B0, ABD to 60\u00B0. No cross-body adduction."),
        bullet("Discontinue sling at 4-6 weeks."),
        pBold("Weeks 6-12 (Phase II):"),
        bullet("AAROM progressing to AROM. Begin isometrics at 8 weeks."),
        pBold("Weeks 12+ (Phase III):"),
        bullet("Progressive strengthening. Return to sport at 4-6 months."),
    ]],

    "Shoulder-Proximal-Humerus-ORIF.docx": ["PROXIMAL HUMERUS ORIF PROTOCOL", [
        pBold("Weeks 0-2: Period of Protection"),
        bullet("Sling at all times. Elbow/wrist/hand ROM. Pendulums."),
        bullet("No active shoulder motion."),
        pBold("Weeks 2-6 (Phase I):"),
        bullet("PROM only: FF to 90-120\u00B0, ER to 30\u00B0, ABD to 60-80\u00B0."),
        bullet("Continue sling between therapy sessions."),
        pBold("Weeks 6-10 (Phase II):"),
        bullet("Discontinue sling. Begin AAROM, progress to AROM."),
        bullet("Isometrics at 8 weeks."),
        pBold("Weeks 10-16 (Phase III):"),
        bullet("Progressive strengthening with bands and light weights."),
        pBold("Weeks 16+ (Phase IV):"),
        bullet("Full strengthening. Return to activity at 4-6 months per radiographic healing."),
    ]],

    "Shoulder-AC-Joint-Reconstruction.docx": ["ACROMIOCLAVICULAR (AC) JOINT RECONSTRUCTION PROTOCOL", [
        pBold("Weeks 0-6: Period of Protection"),
        bullet("Sling at all times for 6 weeks."),
        bullet("No shoulder motion for 2 weeks. Begin PROM at 2 weeks."),
        subBullet("FF to 90\u00B0; No cross-body adduction; No heavy lifting"),
        pBold("Weeks 6-12 (Phase II):"),
        bullet("Discontinue sling. Begin AAROM, progress to AROM."),
        bullet("Isometrics at 8 weeks."),
        pBold("Weeks 12-20 (Phase III):"),
        bullet("Progressive strengthening. No bench press or dips for 5-6 months."),
        pBold("Weeks 20+ (Phase IV):"),
        bullet("Full strengthening. Contact sports at 6+ months."),
    ]],

    "Shoulder-SC-Joint-Reconstruction.docx": ["STERNOCLAVICULAR (SC) JOINT RECONSTRUCTION PROTOCOL", [
        pBold("Weeks 0-6: Period of Protection"),
        bullet("Sling at all times for 6 weeks. No shoulder motion for 2 weeks."),
        bullet("Begin PROM at 2 weeks: FF to 90\u00B0, limited ER and ABD."),
        pBold("Weeks 6-12:"),
        bullet("Discontinue sling. AAROM to AROM. Isometrics at 8 weeks."),
        pBold("Weeks 12+:"),
        bullet("Progressive strengthening. Full return at 6+ months."),
    ]],

    "Shoulder-Pec-Major-Repair.docx": ["PECTORALIS MAJOR TENDON REPAIR PROTOCOL", [
        pBold("Weeks 0-2: Period of Protection"),
        bullet("Sling with arm at side. No shoulder ER, extension, or horizontal ABD."),
        bullet("Elbow/wrist/hand ROM. Pendulums."),
        pBold("Weeks 2-6 (Phase I):"),
        bullet("PROM: FF to 90\u00B0. No ER past neutral. No horizontal ABD."),
        pBold("Weeks 6-10 (Phase II):"),
        bullet("Discontinue sling. Begin AAROM. Gradually increase ER and ABD."),
        pBold("Weeks 10-16 (Phase III):"),
        bullet("AROM in all planes. Begin isometrics. Light resistance at 12 weeks."),
        pBold("Weeks 16+ (Phase IV):"),
        bullet("Progressive strengthening. No bench press until 5-6 months."),
        bullet("Full return to lifting at 6-9 months. MMI at 9-12 months."),
    ]],

    "Shoulder-Lower-Trap-Transfer.docx": ["LOWER TRAPEZIUS TENDON TRANSFER PROTOCOL", [
        pBold("Weeks 0-6: Period of Protection"),
        bullet("Sling with abduction pillow at all times for 6 weeks."),
        bullet("No active shoulder motion. Elbow/wrist/hand ONLY. Pendulums."),
        pBold("Weeks 6-12 (Phase I):"),
        bullet("Discontinue sling. Begin PROM, progress to AAROM."),
        bullet("Scapular activation exercises under therapist guidance."),
        pBold("Weeks 12-20 (Phase II):"),
        bullet("AROM. Isometrics. Begin gentle resistance."),
        pBold("Weeks 20+ (Phase III):"),
        bullet("Progressive strengthening. Full return at 9-12 months."),
    ]],

    "Shoulder-RCR-Biceps-Tenodesis.docx": ["ROTATOR CUFF REPAIR WITH BICEPS TENODESIS PROTOCOL", [
        pBold("Follow the Rotator Cuff Repair Protocol with the following additional restrictions:"),
        bullet("No active elbow flexion against resistance for 6 weeks (biceps tenodesis healing)."),
        bullet("No weight-bearing through the arm for 6 weeks."),
        bullet("Begin gentle active elbow flexion (no resistance) at 6 weeks."),
        bullet("Begin light resistance for elbow flexion at 8-10 weeks."),
        bullet("All other shoulder ROM and strengthening milestones follow the standard rotator cuff repair protocol."),
    ]],

    "Shoulder-RCR-Subscap.docx": ["ROTATOR CUFF REPAIR WITH SUBSCAPULARIS REPAIR PROTOCOL", [
        pBold("Follow the Rotator Cuff Repair Protocol with the following additional restrictions:"),
        bullet("Absolutely NO active internal rotation for 6 weeks."),
        bullet("No passive internal rotation behind the back for 8 weeks."),
        bullet("ER limited to 0-20\u00B0 at side for first 6 weeks (protect subscapularis repair)."),
        bullet("Begin gentle active IR at 8 weeks."),
        bullet("IR strengthening not until 12-16 weeks."),
        bullet("All other milestones follow the standard rotator cuff repair protocol."),
    ]],
};

// =====================================================
// ELBOW THERAPY PROTOCOLS
// =====================================================

const ELBOW_PROTOCOLS = {
    "Elbow-Epicondylitis-Debridement.docx": ["LATERAL/MEDIAL EPICONDYLITIS DEBRIDEMENT PROTOCOL", [
        pBold("Days 0-7:"),
        bullet("Posterior splint or brace for comfort. Active finger/wrist ROM."),
        pBold("Weeks 1-3 (Phase I):"),
        bullet("Discontinue splint. Begin AROM elbow flexion/extension, forearm rotation."),
        bullet("Gentle wrist ROM. No resisted wrist extension/flexion."),
        pBold("Weeks 3-6 (Phase II):"),
        bullet("Full elbow ROM. Begin gentle isometric wrist exercises."),
        bullet("Progress to eccentric strengthening at 4-5 weeks."),
        pBold("Weeks 6-12 (Phase III):"),
        bullet("Progressive resistance exercises. Counterforce brace for activities."),
        bullet("Return to sport/full activity at 3-4 months."),
    ]],

    "Elbow-Epicondylitis-Repair.docx": ["LATERAL/MEDIAL EPICONDYLITIS REPAIR PROTOCOL", [
        pBold("Weeks 0-2: Period of Protection"),
        bullet("Posterior splint at 90\u00B0 elbow flexion. Finger motion ONLY."),
        pBold("Weeks 2-6 (Phase I):"),
        bullet("Hinged elbow brace. Begin AROM elbow and forearm."),
        bullet("No resisted wrist extension (lateral) or flexion (medial) for 6 weeks."),
        pBold("Weeks 6-10 (Phase II):"),
        bullet("Full elbow ROM. Begin isometric wrist strengthening."),
        bullet("Progress to eccentric exercises at 8 weeks."),
        pBold("Weeks 10-16 (Phase III):"),
        bullet("Progressive strengthening. Return to full activity at 4-5 months."),
    ]],

    "Elbow-Distal-Biceps-Repair.docx": ["DISTAL BICEPS TENDON REPAIR PROTOCOL", [
        pBold("Weeks 0-2: Period of Protection"),
        bullet("Posterior splint at 90\u00B0 flexion, forearm in neutral to slight supination."),
        bullet("NO active elbow flexion or forearm supination."),
        bullet("Finger/wrist/shoulder ROM permitted."),
        pBold("Weeks 2-6 (Phase I):"),
        bullet("Hinged elbow brace: 30-120\u00B0 initially, progress 10\u00B0 extension/week."),
        bullet("PROM and AAROM elbow flexion/extension."),
        bullet("No active supination against resistance. No lifting."),
        pBold("Weeks 6-10 (Phase II):"),
        bullet("Discontinue brace. Full AROM. Begin gentle active supination."),
        bullet("Isometric biceps at 8 weeks."),
        pBold("Weeks 10-16 (Phase III):"),
        bullet("Progressive resistance: bands \u2192 weights (1-5 lbs)."),
        bullet("Begin eccentric biceps exercises."),
        pBold("Weeks 16+ (Phase IV):"),
        bullet("Full strengthening. Return to heavy lifting at 5-6 months."),
    ]],

    "Elbow-Triceps-Repair.docx": ["TRICEPS TENDON REPAIR PROTOCOL", [
        pBold("Weeks 0-2: Period of Protection"),
        bullet("Posterior splint at 30-45\u00B0 flexion."),
        bullet("NO active elbow extension. Finger/wrist ROM permitted."),
        pBold("Weeks 2-6 (Phase I):"),
        bullet("Hinged brace. PROM and AAROM. No active extension against gravity."),
        pBold("Weeks 6-10 (Phase II):"),
        bullet("Begin AROM extension (gravity-assisted, then against gravity)."),
        bullet("Isometrics at 8 weeks."),
        pBold("Weeks 10-16 (Phase III):"),
        bullet("Progressive strengthening. Resistance exercises at 12 weeks."),
        pBold("Weeks 16+:"),
        bullet("Full strengthening. Return to sport at 5-6 months."),
    ]],

    "Elbow-UCL-Reconstruction.docx": ["ULNAR COLLATERAL LIGAMENT (UCL) RECONSTRUCTION PROTOCOL", [
        pBold("Weeks 0-2: Period of Protection"),
        bullet("Posterior splint at 90\u00B0. No valgus stress."),
        bullet("Finger/wrist/shoulder ROM. Grip strengthening."),
        pBold("Weeks 2-6 (Phase I):"),
        bullet("Hinged brace: 30-120\u00B0 progressing to full ROM."),
        bullet("AROM elbow and forearm. Wrist curls at 4 weeks."),
        pBold("Weeks 6-12 (Phase II):"),
        bullet("Full ROM expected. Begin progressive strengthening."),
        bullet("Isometric and isotonic rotator cuff, scapular, and elbow exercises."),
        pBold("Weeks 12-24 (Phase III):"),
        bullet("Advanced strengthening. Plyometric program at 4 months."),
        bullet("Begin interval throwing program at 4-5 months."),
        pBold("Months 6-12 (Phase IV):"),
        bullet("Progress throwing: long toss \u2192 mound at 8-9 months."),
        bullet("Return to competitive throwing at 10-14 months."),
    ]],

    "Elbow-UCL-Repair.docx": ["ULNAR COLLATERAL LIGAMENT (UCL) REPAIR PROTOCOL", [
        pBold("Weeks 0-2: Period of Protection"),
        bullet("Posterior splint at 90\u00B0. No valgus stress. Grip strengthening."),
        pBold("Weeks 2-6:"),
        bullet("Hinged brace: 30-120\u00B0 progressing to full ROM."),
        bullet("AROM elbow and forearm. Light wrist exercises at 4 weeks."),
        pBold("Weeks 6-12:"),
        bullet("Full ROM. Progressive strengthening."),
        pBold("Months 3-6:"),
        bullet("Advanced strengthening. Begin interval throwing at 4 months."),
        bullet("Return to competitive play at 6-9 months (faster than reconstruction)."),
    ]],

    "Elbow-LUCL-Reconstruction.docx": ["LATERAL ULNAR COLLATERAL LIGAMENT (LUCL) RECONSTRUCTION PROTOCOL", [
        pBold("Weeks 0-2: Period of Protection"),
        bullet("Posterior splint at 90\u00B0. No varus stress. No forearm supination against resistance."),
        pBold("Weeks 2-6:"),
        bullet("Hinged brace: 30-120\u00B0 progressing. AROM flexion/extension."),
        bullet("Avoid positions that stress lateral ligament (arm overhead with forearm supinated)."),
        pBold("Weeks 6-12:"),
        bullet("Full ROM. Isometrics. Begin light resistance at 8 weeks."),
        pBold("Weeks 12+:"),
        bullet("Progressive strengthening. Return to sport at 4-6 months."),
    ]],

    "Elbow-Radial-Head-Olecranon-ORIF.docx": ["RADIAL HEAD / OLECRANON ORIF PROTOCOL", [
        pBold("Days 0-7:"),
        bullet("Posterior splint. Finger/wrist ROM immediately."),
        pBold("Weeks 1-3 (Phase I):"),
        bullet("Begin AROM elbow flexion/extension and forearm rotation (if stable fixation)."),
        bullet("ROM goals: 30-120\u00B0 initially, progressing to full."),
        bullet("No resisted elbow extension (olecranon) or heavy lifting."),
        pBold("Weeks 3-6 (Phase II):"),
        bullet("Full AROM expected. Gentle isometrics."),
        pBold("Weeks 6-12 (Phase III):"),
        bullet("Progressive strengthening with bands and light weights."),
        bullet("Return to full activity at 3-4 months per radiographic healing."),
    ]],

    "Elbow-UCL-Conservative.docx": ["ELBOW UCL CONSERVATIVE TREATMENT PROTOCOL", [
        pBold("Phase I (Weeks 0-2): Acute Phase"),
        bullet("Rest from throwing and aggravating activities."),
        bullet("Hinged brace for comfort. Ice and NSAIDs."),
        bullet("AROM elbow/forearm as tolerated."),
        pBold("Phase II (Weeks 2-6): Recovery Phase"),
        bullet("Full pain-free ROM. Begin isometric strengthening."),
        bullet("Progress to isotonic exercises for forearm, wrist, and shoulder."),
        pBold("Phase III (Weeks 6-12): Strengthening Phase"),
        bullet("Progressive resistance for entire upper extremity."),
        bullet("Scapular stabilization. Core strengthening."),
        pBold("Phase IV (Months 3-6): Return to Throwing"),
        bullet("Begin interval throwing program when pain-free with full strength."),
        bullet("Progress gradually: flat ground \u2192 mound \u2192 competitive."),
    ]],

    "Elbow-Throwing-Program-Phase1.docx": ["INTERVAL THROWING PROGRAM \u2014 PHASE I (FLAT GROUND)", [
        pBold("Prerequisites: Full pain-free ROM, 90%+ strength compared to uninjured arm."),
        p("Throw every other day. Stop if pain occurs. Ice after each session."),
        pBold("Step 1 (Sessions 1-3):"),
        bullet("45 feet, 25 throws at 50% effort. Rest 5 minutes. Repeat."),
        pBold("Step 2 (Sessions 4-6):"),
        bullet("60 feet, 25 throws at 50% effort. Rest 5 min. 25 throws at 75%."),
        pBold("Step 3 (Sessions 7-9):"),
        bullet("90 feet, 25 throws at 50%. Rest 5 min. 25 throws at 75%."),
        pBold("Step 4 (Sessions 10-12):"),
        bullet("120 feet, 25 throws at 50%. Rest. 25 throws at 75%."),
        pBold("Step 5 (Sessions 13-15):"),
        bullet("150 feet, 25 throws at 50%. Rest. 25 throws at 75%."),
        pBold("Step 6 (Sessions 16-18):"),
        bullet("180 feet, 25 throws at 75%. Rest. 25 throws at 100%."),
        p("If all steps completed pain-free, advance to Phase II (Mound Program)."),
    ]],

    "Elbow-Throwing-Program-Phase2.docx": ["INTERVAL THROWING PROGRAM \u2014 PHASE II (MOUND)", [
        pBold("Prerequisites: Completed Phase I (Flat Ground) pain-free."),
        p("Throw from mound every other day. Ice after each session."),
        pBold("Step 1 (Sessions 1-2):"),
        bullet("15 fastballs at 50%. 15 fastballs at 75%."),
        pBold("Step 2 (Sessions 3-4):"),
        bullet("30 fastballs. 15 at 50%, 15 at 75%."),
        pBold("Step 3 (Sessions 5-6):"),
        bullet("30 fastballs at 75%. 15 at 80-85%."),
        pBold("Step 4 (Sessions 7-8):"),
        bullet("30 fastballs at 80%. 15 at 85-90%. Begin mixing in off-speed."),
        pBold("Step 5 (Sessions 9-10):"),
        bullet("45 pitches. Fastballs at 85-95%. Mix in breaking pitches."),
        pBold("Step 6+ (Sessions 11+):"),
        bullet("Simulated innings. Progress to 60-75 pitches. Advance to live batters."),
        p("Progress to competitive play per surgeon clearance."),
    ]],
};

// =====================================================
// HAND / WRIST THERAPY PROTOCOLS
// =====================================================

const HAND_WRIST_PROTOCOLS = {
    "Hand-Flexor-Tendon-Repair-Protocol.docx": ["FLEXOR TENDON REPAIR REHABILITATION PROTOCOL", [
        pBold("Weeks 0-4 (Phase I): Early Protected Motion"),
        bullet("Dorsal blocking splint: Wrist 20-30\u00B0 flexion, MCP 60-70\u00B0 flexion, IP joints extended."),
        bullet("Passive flexion within the splint. Active extension to splint limits."),
        bullet("Rubber band traction (modified Duran or modified Kleinert protocol) per surgeon preference."),
        bullet("Place-and-hold exercises starting at 3-4 weeks (gentle active hold in flexion)."),
        bullet("Edema management. Scar massage once incisions closed."),
        pBold("Weeks 4-6 (Phase II): Active Motion"),
        bullet("Continue dorsal blocking splint between exercises."),
        bullet("Begin gentle active flexion/extension within protective range."),
        bullet("Tendon gliding exercises: straight fist, hook fist, full fist."),
        bullet("Blocking exercises for FDP and FDS."),
        pBold("Weeks 6-8 (Phase III): Progressive Motion"),
        bullet("Discontinue splint (unless surgeon specifies otherwise)."),
        bullet("Full AROM. Composite fist. Light functional activities."),
        bullet("Begin gentle resistance at 8 weeks."),
        pBold("Weeks 8-12 (Phase IV): Strengthening"),
        bullet("Progressive grip strengthening with putty and hand exerciser."),
        bullet("Functional activities with increasing resistance."),
        pBold("Weeks 12+ (Phase V): Return to Activity"),
        bullet("Full strengthening. Return to sports/heavy labor at 3-4 months."),
        bullet("Maximum grip strength recovery at 4-6 months."),
    ]],

    "Hand-Extensor-Tendon-Repair-Protocol.docx": ["EXTENSOR TENDON REPAIR REHABILITATION PROTOCOL", [
        pBold("Zone I-II (Mallet Finger / DIP):"),
        bullet("DIP extension splint for 6-8 weeks continuously."),
        bullet("Active PIP and MCP motion encouraged."),
        bullet("Night splinting for additional 4-6 weeks."),
        bullet("No active DIP flexion until 8 weeks."),
        pBold("Zone III-IV (Boutonniere / PIP):"),
        bullet("PIP extension splint for 6 weeks continuously."),
        bullet("Active DIP flexion exercises (important to prevent lateral band adhesion)."),
        bullet("Active PIP flexion begins at 6 weeks."),
        pBold("Zone V-VI (Hand/Wrist):"),
        bullet("Wrist and MCP in extension splint for 4-6 weeks."),
        bullet("Controlled flexion protocol or relative motion splint per surgeon."),
        bullet("Active flexion begins at 4-6 weeks."),
        bullet("Resistance at 8 weeks. Full strengthening at 12 weeks."),
        pBold("Zone VII-VIII (Wrist/Forearm):"),
        bullet("Similar to Zone V-VI with longer immobilization if needed."),
        bullet("Wrist motion begins at 4-6 weeks. Strengthening at 10-12 weeks."),
    ]],

    "Hand-Mallet-Finger-Splinting.docx": ["MALLET FINGER SPLINTING PROTOCOL", [
        pBold("Weeks 0-6: Continuous Splinting"),
        bullet("DIP joint must be held in full extension (slight hyperextension) AT ALL TIMES."),
        bullet("Stack splint, aluminum foam splint, or custom thermoplastic splint."),
        bullet("PIP joint must remain FREE \u2014 do not immobilize."),
        bulletBold("CRITICAL", "Do NOT let the DIP joint drop into flexion even for a moment. If the splint is removed (for skin care), support the DIP in extension on a flat surface at all times."),
        bullet("Clean skin under splint daily. Alternate splints if needed for hygiene."),
        pBold("Weeks 6-8: Weaning"),
        bullet("Begin gentle active DIP flexion (remove splint for exercises only)."),
        bullet("Wear splint between exercises and at night."),
        bullet("If extensor lag develops \u2192 return to full-time splinting for 2 more weeks."),
        pBold("Weeks 8-12:"),
        bullet("Continue nighttime splinting."),
        bullet("Progress DIP active ROM. Light functional use."),
        pBold("Weeks 12+:"),
        bullet("Discontinue splint. Full activity. Residual slight extensor lag (5-10\u00B0) is common and usually functional."),
    ]],

    "Hand-Trigger-Finger-Release-Protocol.docx": ["TRIGGER FINGER RELEASE REHABILITATION PROTOCOL", [
        pBold("Days 0-3:"),
        bullet("Keep dressing clean and dry. Begin active finger ROM immediately."),
        bullet("Make a full fist and fully extend fingers 10x every hour while awake."),
        pBold("Weeks 1-2:"),
        bullet("Suture removal at 10-14 days."),
        bullet("Full AROM. Light functional activities."),
        bullet("Scar massage once incision fully closed."),
        pBold("Weeks 2-4:"),
        bullet("Progressive grip strengthening. Return to full activities."),
        bullet("Most patients fully recovered by 3-4 weeks."),
    ]],

    "Hand-Carpal-Tunnel-Release-Protocol.docx": ["CARPAL TUNNEL RELEASE REHABILITATION PROTOCOL", [
        pBold("Days 0-3:"),
        bullet("Soft dressing. Active finger motion immediately and frequently."),
        bullet("Elevate hand above heart level. Ice for 15-20 minutes as needed."),
        pBold("Weeks 1-2:"),
        bullet("Suture removal at 10-14 days. Light daily activities permitted."),
        bullet("Gentle wrist ROM: flexion/extension, radial/ulnar deviation."),
        bullet("Grip strengthening with therapy putty."),
        pBold("Weeks 2-6:"),
        bullet("Progressive return to full activities. Scar massage and desensitization."),
        bullet("Pillar pain (palm soreness) is common \u2014 gradually resolves over 2-3 months."),
        pBold("Weeks 6-12:"),
        bullet("Full activities. Grip strength continues to improve."),
        bullet("Numbness/tingling improvement may continue for 3-6 months."),
    ]],

    "Hand-Cubital-Tunnel-Release-Protocol.docx": ["CUBITAL TUNNEL RELEASE REHABILITATION PROTOCOL", [
        pBold("Days 0-7:"),
        bullet("Soft dressing or posterior splint. Finger/wrist ROM immediately."),
        bullet("Avoid leaning on elbow."),
        pBold("Weeks 1-4:"),
        bullet("Suture removal at 10-14 days. Full elbow ROM."),
        bullet("Avoid prolonged elbow flexion past 90\u00B0 for 4 weeks."),
        bullet("Nerve gliding exercises as instructed by therapist."),
        pBold("Weeks 4-8:"),
        bullet("Progressive return to full activities."),
        bullet("Strengthening as tolerated."),
        pBold("Weeks 8+:"),
        bullet("Full activity. Nerve recovery may continue for 3-12 months."),
    ]],

    "Wrist-Distal-Radius-ORIF-Protocol.docx": ["DISTAL RADIUS FRACTURE ORIF REHABILITATION PROTOCOL", [
        pBold("Weeks 0-2 (Phase I): Protection"),
        bullet("Splint immobilization. Elevate frequently."),
        bullet("Active finger, thumb, elbow, and shoulder ROM."),
        bullet("Tendon gliding exercises for fingers."),
        pBold("Weeks 2-6 (Phase II): Early Motion"),
        bullet("Transition to removable splint."),
        bullet("Begin active wrist flexion/extension, radial/ulnar deviation."),
        bullet("Forearm rotation (supination/pronation)."),
        bullet("Gentle grip strengthening with putty."),
        pBold("Weeks 6-12 (Phase III): Strengthening"),
        bullet("Progressive grip and pinch strengthening."),
        bullet("Weight-bearing as tolerated."),
        bullet("Functional activities (cooking, opening jars)."),
        pBold("Weeks 12+ (Phase IV): Return to Full Activity"),
        bullet("Sport-specific training. Impact activities at 3-6 months."),
    ]],

    "Wrist-TFCC-Repair-Protocol.docx": ["TFCC REPAIR REHABILITATION PROTOCOL", [
        pBold("Weeks 0-4 (Phase I): Immobilization"),
        bullet("Long-arm or sugar-tong splint/cast. No forearm rotation."),
        bullet("Active finger, elbow (flex/ext only), and shoulder ROM."),
        pBold("Weeks 4-8 (Phase II): Early Motion"),
        bullet("Transition to short-arm splint. Begin gentle forearm rotation."),
        bullet("Active wrist flexion/extension. No ulnar deviation loading."),
        pBold("Weeks 8-12 (Phase III): Progressive Motion"),
        bullet("Full AROM. Gentle grip strengthening."),
        bullet("Avoid heavy gripping and twisting."),
        pBold("Weeks 12+ (Phase IV): Strengthening"),
        bullet("Progressive strengthening. Return to sport at 3-6 months."),
    ]],

    "Wrist-Scaphoid-Fixation-Protocol.docx": ["SCAPHOID FRACTURE FIXATION REHABILITATION PROTOCOL", [
        pBold("Weeks 0-6 (Phase I): Protection"),
        bullet("Thumb spica splint or cast. Active finger motion (excluding thumb)."),
        pBold("Weeks 6-10 (Phase II): Early Motion"),
        bullet("Transition to removable splint. Begin gentle wrist and thumb ROM."),
        bullet("X-ray confirmation of healing before advancing."),
        pBold("Weeks 10-16 (Phase III): Strengthening"),
        bullet("Progressive grip/pinch strengthening. Functional activities."),
        pBold("Weeks 16+ (Phase IV):"),
        bullet("Full activity. Return to contact sports when radiographic union confirmed."),
    ]],

    "Wrist-Fusion-Protocol.docx": ["WRIST FUSION (ARTHRODESIS) REHABILITATION PROTOCOL", [
        pBold("Weeks 0-6 (Phase I): Immobilization"),
        bullet("Cast or splint immobilization while bones fuse."),
        bullet("Active finger, thumb, elbow, and shoulder ROM."),
        pBold("Weeks 6-12 (Phase II): Transition"),
        bullet("X-ray confirmation of fusion. Transition to removable splint."),
        bullet("Forearm rotation exercises. Grip strengthening."),
        bullet("Note: Wrist flexion/extension will be eliminated; forearm rotation preserved."),
        pBold("Weeks 12+ (Phase III):"),
        bullet("Progressive strengthening. Full return to heavy activities at 3-6 months."),
    ]],

    "Hand-Thumb-CMC-Arthroplasty-Protocol.docx": ["THUMB CMC ARTHROPLASTY (LRTI) REHABILITATION PROTOCOL", [
        pBold("Weeks 0-6 (Phase I): Immobilization"),
        bullet("Thumb spica cast or splint. Finger motion (index-small) immediately."),
        pBold("Weeks 6-10 (Phase II): Early Motion"),
        bullet("Transition to hand-based thumb spica splint."),
        bullet("Begin gentle thumb ROM: opposition, flexion/extension, palmar abduction."),
        bullet("Light pinch activities."),
        pBold("Weeks 10-16 (Phase III): Strengthening"),
        bullet("Progressive pinch and grip strengthening with putty."),
        bullet("Functional activities. Wear splint for heavy tasks."),
        pBold("Weeks 16+ (Phase IV):"),
        bullet("Discontinue splint. Progressive strengthening."),
        bullet("Full recovery and max pinch strength at 6-12 months."),
    ]],

    "Hand-Dupuytrens-Fasciectomy-Protocol.docx": ["DUPUYTREN'S FASCIECTOMY REHABILITATION PROTOCOL", [
        pBold("Weeks 0-2: Wound Healing"),
        bullet("Bulky dressing. Active finger motion ASAP \u2014 focus on extension."),
        bullet("Suture removal at 10-14 days."),
        pBold("Weeks 2-6:"),
        bullet("Night extension splint: wear every night for 3-6 months."),
        bullet("Active and passive finger ROM. Focus on maintaining extension gained in surgery."),
        bullet("Scar massage and edema management."),
        pBold("Weeks 6-12:"),
        bullet("Progressive grip strengthening."),
        bullet("Continue night splinting. Functional activities."),
        pBold("Months 3-6:"),
        bullet("Continue night splint for 6 months total to maintain correction."),
        bullet("Full return to activities."),
    ]],

    "Hand-DeQuervains-Release-Protocol.docx": ["DE QUERVAIN'S RELEASE REHABILITATION PROTOCOL", [
        pBold("Days 0-7:"),
        bullet("Thumb spica splint for comfort. Active finger motion."),
        pBold("Weeks 1-2:"),
        bullet("Suture removal at 10-14 days. Gentle thumb and wrist ROM."),
        bullet("Discontinue splint as comfort allows."),
        pBold("Weeks 2-6:"),
        bullet("Full ROM. Progressive grip strengthening."),
        bullet("Return to full activities at 4-6 weeks."),
    ]],
};

// =====================================================
// NON-OPERATIVE PROGRAMS
// =====================================================

const NONOP_PROTOCOLS = {
    "NonOp-Shoulder-Impingement.docx": ["SHOULDER IMPINGEMENT & ROTATOR CUFF TENDONITIS HOME PROGRAM", [
        p("This program is designed for patients with shoulder impingement syndrome or rotator cuff tendonitis who are being managed non-operatively. Perform exercises daily unless otherwise instructed."),
        pBold("Phase I: Pain Relief & Mobility (Weeks 0-2)"),
        bullet("Ice 15-20 minutes after activity. Anti-inflammatory medication as directed."),
        bullet("Pendulum exercises: Lean forward, let arm hang. Swing gently in circles and back-and-forth. 2 minutes, 3x/day."),
        bullet("Passive shoulder stretching: Use a cane or opposite hand to assist with forward elevation and external rotation. Hold 15-30 seconds, 5 reps."),
        bullet("Scapular squeezes: Squeeze shoulder blades together and hold 5 seconds. 10 reps, 3x/day."),
        pBold("Phase II: Strengthening (Weeks 2-6)"),
        bullet("Continue stretching. Add:"),
        bullet("Isometric external rotation: Stand with elbow at side, push back of hand into wall. Hold 5 sec, 10 reps."),
        bullet("Isometric internal rotation: Stand with elbow at side, push palm into wall. Hold 5 sec, 10 reps."),
        bullet("Sidelying external rotation: Lie on uninvolved side. Elbow at 90\u00B0 at side. Rotate forearm upward with light weight (1-2 lbs). 10-15 reps, 2 sets."),
        bullet("Prone Y, T, I exercises: Lie face down. Raise arms in Y, T, and I positions. 10 reps each, 2 sets."),
        pBold("Phase III: Advanced Strengthening (Weeks 6-12)"),
        bullet("Resistance band internal/external rotation: 3 sets of 15 reps."),
        bullet("Progress weights for sidelying ER (3-5 lbs)."),
        bullet("Wall push-ups progressing to standard push-ups."),
        bullet("Return to overhead activities gradually."),
    ]],

    "NonOp-Frozen-Shoulder.docx": ["SHOULDER STIFFNESS & FROZEN SHOULDER HOME PROGRAM", [
        p("Adhesive capsulitis (frozen shoulder) progresses through freezing, frozen, and thawing stages. This program focuses on maintaining and restoring range of motion. Consistency is key."),
        pBold("Stretching Program (Perform 3-4x daily)"),
        bullet("Pendulum exercises: 2-3 minutes. Let gravity assist gentle motion."),
        bullet("Wall walk: Face wall, walk fingers up as high as tolerable. Hold 15 seconds. Repeat 10x."),
        bullet("Cross-body stretch: Pull affected arm across chest with opposite hand. Hold 30 sec. 5 reps."),
        bullet("External rotation stretch: Stand in doorway, elbow at 90\u00B0. Gently rotate body away from hand. Hold 30 sec."),
        bullet("Towel stretch (IR): Place towel behind back. Use uninvolved hand to pull affected hand upward. Hold 30 sec."),
        bullet("Supine forward flexion: Lie on back. Use opposite hand to raise affected arm overhead. Hold 15-30 sec. 10 reps."),
        pBold("Strengthening (Begin when pain decreases and motion improves)"),
        bullet("Isometric exercises: ER, IR, flexion, ABD. Hold 5 seconds. 10 reps each."),
        bullet("Resistance bands when isometrics are comfortable."),
        pBold("Important Notes"),
        bullet("Stretching should cause mild discomfort but not severe pain."),
        bullet("Heat before exercises (warm shower or heating pad) helps improve flexibility."),
        bullet("Ice after exercises to control inflammation."),
        bullet("Recovery from frozen shoulder may take 6-18 months."),
    ]],

    "NonOp-Tennis-Elbow.docx": ["TENNIS ELBOW (LATERAL EPICONDYLITIS) HOME EXERCISE PROGRAM", [
        p("This program is for patients with lateral epicondylitis being managed non-operatively. Eccentric strengthening is the cornerstone of treatment."),
        pBold("Phase I: Pain Control (Weeks 0-2)"),
        bullet("Counterforce brace (forearm strap) worn during activities."),
        bullet("Ice 15-20 minutes after activity, 2-3x/day."),
        bullet("Avoid repetitive gripping and wrist extension activities."),
        bullet("Gentle wrist flexion/extension stretching. Hold 30 sec, 3 reps, 3x/day."),
        pBold("Phase II: Eccentric Strengthening (Weeks 2-8)"),
        bulletBold("Tyler Twist with FlexBar", "Hold FlexBar with affected hand (wrist extended). Twist with opposite hand. Slowly release with affected hand (eccentric extension). 3 sets of 15, 1-2x/day."),
        bullet("Eccentric wrist extension: Support forearm on table, palm down, wrist off edge. Hold 1-2 lb weight. Use opposite hand to extend wrist up. Slowly lower with affected hand (3-second descent). 3 sets of 15."),
        bullet("Ball squeeze: 10 seconds hold, 10 reps, 3x/day."),
        pBold("Phase III: Progressive Strengthening (Weeks 8-12)"),
        bullet("Increase resistance for eccentric exercises."),
        bullet("Wrist curls (flexion and extension) with 2-5 lb weights."),
        bullet("Forearm pronation/supination with hammer or weighted bar."),
        bullet("Gradual return to aggravating activities."),
    ]],

    "NonOp-Elbow-Stiffness-Home.docx": ["ELBOW STIFFNESS HOME EXERCISE PROGRAM", [
        p("Elbow stiffness can follow injury, surgery, or prolonged immobilization. Low-load, prolonged stretching is more effective than forceful manipulation."),
        pBold("Stretching (Perform 4-6x daily)"),
        bullet("Active elbow flexion/extension: Slowly bend and straighten elbow to maximum comfortable range. 15 reps."),
        bullet("Forearm rotation: Elbow at side, 90\u00B0. Rotate palm up (supination) and down (pronation). 15 reps."),
        bullet("Wall-assisted extension stretch: Place palm flat on wall, arm straight. Lean in gently. Hold 30 sec."),
        bullet("Self-assisted flexion: Use opposite hand to gently push into further flexion. Hold 30 sec."),
        pBold("Sustained Stretching"),
        bullet("Extension: Straighten arm on a table or flat surface with a light weight (1-2 lbs) on the forearm. Hold 10-15 minutes."),
        bullet("Flexion: Sit with elbow on table, hand near shoulder. Let gravity assist. Hold 10-15 minutes."),
        pBold("Important Notes"),
        bullet("Heat before exercises. Ice after."),
        bullet("Avoid aggressive forcing \u2014 this can worsen stiffness."),
        bullet("Consistency is more important than intensity."),
    ]],
};

// =====================================================
// NEW SHOULDER PATIENT EDUCATION DOCS
// =====================================================

const SHOULDER_EDUCATION = {
    "Rotator-Cuff-Tears.docx": [
        h1("Rotator Cuff Tears"),
        h2("What Is the Rotator Cuff?"),
        p("The rotator cuff is a group of four muscles and tendons (supraspinatus, infraspinatus, teres minor, and subscapularis) that surround the shoulder joint, keeping the ball of the upper arm bone (humerus) centered in the socket (glenoid). They are essential for lifting and rotating the arm."),
        h2("Types of Rotator Cuff Tears"),
        bulletBold("Partial tear", "The tendon is damaged but not completely severed."),
        bulletBold("Full-thickness tear", "The tendon is completely torn from the bone. This does not heal on its own."),
        bulletBold("Massive tear", "Two or more rotator cuff tendons are torn."),
        h2("Symptoms"),
        bullet("Pain at rest and at night, especially when lying on the affected shoulder"),
        bullet("Pain when lifting and lowering the arm"),
        bullet("Weakness when lifting or rotating the arm"),
        bullet("Catching or crackling sensation with shoulder movement"),
        h2("Non-Surgical Treatment"),
        bulletBold("Activity modification and rest", "Avoid overhead activities that aggravate symptoms"),
        bulletBold("Physical therapy", "Strengthening the remaining rotator cuff muscles and scapular stabilizers"),
        bulletBold("Anti-inflammatory medications", "NSAIDs for pain and swelling"),
        bulletBold("Corticosteroid injection", "Can provide temporary pain relief"),
        h2("Surgical Treatment"),
        p("Arthroscopic rotator cuff repair involves reattaching the torn tendon to the bone using suture anchors through small incisions. Recovery requires diligent rehabilitation over 4-6 months."),
        h2("When to Call Your Doctor"),
        bullet("Sudden weakness after a fall or injury"),
        bullet("Inability to lift the arm"),
        bullet("Night pain that disrupts sleep despite treatment"),
    ],

    "Shoulder-Instability.docx": [
        h1("Shoulder Instability & Labral Tears"),
        h2("What Is Shoulder Instability?"),
        p("Shoulder instability occurs when the structures that surround the shoulder joint (labrum, ligaments, and capsule) are damaged, allowing the humeral head to move partially (subluxation) or completely (dislocation) out of the socket."),
        h2("Types"),
        bulletBold("Traumatic", "Caused by a specific injury (fall, collision). Often results in a Bankart lesion (torn labrum and ligaments)."),
        bulletBold("Atraumatic / Multidirectional", "Caused by general looseness of the shoulder capsule, often in patients with naturally flexible joints."),
        h2("Symptoms"),
        bullet("Sensation of the shoulder slipping or \"giving way\""),
        bullet("Pain with overhead activities or reaching behind"),
        bullet("History of shoulder dislocation(s)"),
        bullet("Apprehension with certain arm positions"),
        h2("Surgical Options"),
        bulletBold("Arthroscopic Bankart repair", "Reattaching the torn labrum and tightening the capsule"),
        bulletBold("Latarjet procedure", "Bone block transfer for recurrent instability with bone loss"),
        bulletBold("Posterior stabilization", "For posterior instability patterns"),
        h2("Recovery"),
        p("Sling for 4-6 weeks. Therapy for 4-6 months. Return to contact sports at 6-9 months."),
    ],

    "Shoulder-Arthritis-Replacement.docx": [
        h1("Shoulder Arthritis & Shoulder Replacement"),
        h2("What Is Shoulder Arthritis?"),
        p("Shoulder arthritis is the loss of smooth cartilage surfaces within the shoulder joint (glenohumeral joint). This can result from aging (osteoarthritis), prior injury (post-traumatic), inflammatory conditions (rheumatoid arthritis), or rotator cuff failure (cuff tear arthropathy)."),
        h2("Symptoms"),
        bullet("Deep aching pain in the shoulder, often worse with activity"),
        bullet("Stiffness and loss of range of motion"),
        bullet("Grinding or catching sensation"),
        bullet("Night pain that disrupts sleep"),
        h2("Non-Surgical Treatment"),
        bullet("Activity modification, physical therapy, NSAIDs"),
        bullet("Corticosteroid injection for temporary relief"),
        h2("Shoulder Replacement Options"),
        bulletBold("Anatomic total shoulder", "Replaces ball and socket with metal and plastic components. Best for intact rotator cuff."),
        bulletBold("Reverse total shoulder", "Switches the ball and socket configuration. Used when the rotator cuff is deficient."),
        bulletBold("Hemiarthroplasty", "Replaces only the ball (humeral head). Used in select fracture or arthritis cases."),
        h2("Recovery"),
        p("Sling for 4-6 weeks. Therapy for 3-6 months. Most patients achieve significant pain relief and improved function. MMI at 9-12 months."),
    ],

    "Frozen-Shoulder.docx": [
        h1("Frozen Shoulder (Adhesive Capsulitis)"),
        h2("What Is Frozen Shoulder?"),
        p("Frozen shoulder is a condition in which the capsule surrounding the shoulder joint becomes thickened and inflamed, causing pain and progressive loss of motion. It typically progresses through three stages over 1-3 years."),
        h2("Stages"),
        bulletBold("Freezing (2-9 months)", "Gradual onset of pain with progressive loss of motion."),
        bulletBold("Frozen (4-12 months)", "Pain may decrease but stiffness persists. Significant loss of ROM."),
        bulletBold("Thawing (5-24 months)", "Gradual return of motion."),
        h2("Risk Factors"),
        bullet("Diabetes (most significant risk factor)"),
        bullet("Thyroid disease"),
        bullet("Prolonged immobilization after injury or surgery"),
        bullet("Age 40-60, more common in women"),
        h2("Treatment"),
        bulletBold("Physical therapy", "Gentle stretching program is the cornerstone of treatment"),
        bulletBold("NSAIDs", "For pain and inflammation"),
        bulletBold("Corticosteroid injection", "Can help with pain, especially during the freezing stage"),
        bulletBold("Hydrodilatation", "Injection of fluid to stretch the capsule under image guidance"),
        bulletBold("Manipulation under anesthesia", "For refractory cases"),
        bulletBold("Arthroscopic capsular release", "Surgical release for severe, persistent stiffness"),
    ],

    "Clavicle-Fractures.docx": [
        h1("Clavicle (Collarbone) Fractures"),
        h2("What Is a Clavicle Fracture?"),
        p("The clavicle (collarbone) connects the shoulder blade to the breastbone. Clavicle fractures are common injuries, often resulting from falls, sports collisions, or direct blows to the shoulder."),
        h2("Types"),
        bulletBold("Midshaft (most common \u2014 80%)", "Fracture of the middle third of the clavicle"),
        bulletBold("Distal (lateral)", "Fracture near the AC joint \u2014 may involve ligament injury"),
        bulletBold("Medial", "Fracture near the breastbone \u2014 least common"),
        h2("Non-Surgical Treatment"),
        p("Many clavicle fractures heal well with a sling for 4-6 weeks, followed by progressive range of motion and strengthening. Non-displaced and minimally displaced midshaft fractures are often treated non-operatively."),
        h2("Surgical Treatment (ORIF)"),
        p("Displaced, shortened, or comminuted fractures may benefit from surgical fixation with a plate and screws. This restores bone length and alignment and may allow earlier return to activity."),
        h2("Recovery"),
        bullet("Sling for 2-6 weeks depending on treatment"),
        bullet("Motion exercises begin at 2-4 weeks"),
        bullet("Full healing at 6-12 weeks"),
        bullet("Contact sports at 3-4 months after confirmed healing"),
    ],

    "AC-Joint-Injuries.docx": [
        h1("Acromioclavicular (AC) Joint Injuries"),
        h2("What Is the AC Joint?"),
        p("The acromioclavicular (AC) joint is where the collarbone (clavicle) meets the shoulder blade (acromion) at the top of the shoulder. AC joint injuries (\"separated shoulder\") are common in contact sports and falls."),
        h2("Classification"),
        bulletBold("Type I-II", "Sprain of AC ligaments. Treated non-operatively with sling and rehab."),
        bulletBold("Type III", "Complete AC and coracoclavicular (CC) ligament disruption. May be treated operatively or non-operatively depending on patient factors."),
        bulletBold("Type IV-VI", "Severe displacement. Usually requires surgical reconstruction."),
        h2("Treatment"),
        p("Low-grade injuries heal well with conservative management. High-grade injuries may require surgical reconstruction of the CC ligaments, using a graft to restore stability."),
    ],

    "Proximal-Humerus-Fractures.docx": [
        h1("Proximal Humerus (Shoulder) Fractures"),
        h2("What Is a Proximal Humerus Fracture?"),
        p("A proximal humerus fracture is a break in the upper portion of the arm bone near the shoulder joint. These fractures are common in older adults from falls and in younger patients from high-energy trauma."),
        h2("Treatment Options"),
        bulletBold("Non-operative", "Sling immobilization for 2-4 weeks followed by progressive therapy. Appropriate for non-displaced or minimally displaced fractures."),
        bulletBold("ORIF (plate and screws)", "For displaced fractures in patients with good bone quality."),
        bulletBold("Shoulder replacement", "For severe comminuted fractures or fractures in elderly patients with poor bone quality."),
        h2("Recovery"),
        p("Early finger, wrist, and elbow motion is essential. Shoulder motion begins at 2-6 weeks depending on fracture stability. Full recovery takes 3-6 months."),
    ],

    "Biceps-Tendon-Injuries.docx": [
        h1("Biceps Tendon Injuries"),
        h2("Overview"),
        p("The biceps muscle has two tendons at the shoulder (long head and short head) and one at the elbow (distal biceps). Injuries to these tendons are common and can range from inflammation to complete rupture."),
        h2("Long Head of Biceps (Shoulder)"),
        bullet("Tendonitis: Pain in the front of the shoulder with overhead activities"),
        bullet("SLAP tear: Injury to the labrum where the biceps anchors (see SLAP Tears)"),
        bullet("Rupture: \"Popeye\" deformity of the upper arm. Often treated non-operatively in older patients."),
        bulletBold("Biceps tenodesis", "Reattachment of the long head biceps tendon to the humerus. Performed when the biceps is a source of pain."),
        h2("Distal Biceps (Elbow)"),
        bullet("Rupture: Sudden pop at the elbow with loss of flexion and supination strength."),
        bullet("Almost always repaired surgically within 2-3 weeks for best outcomes."),
        bullet("Recovery: 4-6 months to full strength. No active elbow flexion against resistance for 6 weeks."),
    ],
};

// =====================================================
// GENERATE ALL DOCUMENTS
// =====================================================

async function main() {
    console.log("Generating therapy protocols and shoulder education documents...\n");
    let count = 0;

    console.log("--- SHOULDER THERAPY PROTOCOLS ---");
    for (const [fn, [title, phases]] of Object.entries(SHOULDER_PROTOCOLS)) {
        await createProtocol(fn, title, phases); count++;
    }

    console.log("\n--- ELBOW THERAPY PROTOCOLS ---");
    for (const [fn, [title, phases]] of Object.entries(ELBOW_PROTOCOLS)) {
        await createProtocol(fn, title, phases); count++;
    }

    console.log("\n--- HAND & WRIST THERAPY PROTOCOLS ---");
    for (const [fn, [title, phases]] of Object.entries(HAND_WRIST_PROTOCOLS)) {
        await createProtocol(fn, title, phases); count++;
    }

    console.log("\n--- NON-OPERATIVE PROGRAMS ---");
    for (const [fn, [title, phases]] of Object.entries(NONOP_PROTOCOLS)) {
        await createProtocol(fn, title, phases); count++;
    }

    console.log("\n--- SHOULDER PATIENT EDUCATION ---");
    for (const [fn, sections] of Object.entries(SHOULDER_EDUCATION)) {
        await createEducDoc(fn, sections); count++;
    }

    console.log(`\nDone! ${count} documents created.`);
    console.log(`  Protocols: ${PROTO_DIR}`);
    console.log(`  Education: ${EDUC_DIR}`);
}

main().catch(console.error);
