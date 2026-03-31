/**
 * Generate Patient Education Word Documents
 * James D. Oosten, MD — Upper Extremity Orthopedic Surgery
 *
 * Run: node generate-patient-docs.js
 * Output: patient-resources/*.docx
 */

const fs = require('fs');
const path = require('path');
const {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
    Header, Footer, AlignmentType, HeadingLevel, BorderStyle,
    WidthType, ShadingType, LevelFormat, PageNumber, PageBreak
} = require('docx');

const OUTPUT_DIR = path.join(__dirname, 'patient-resources');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// --- Shared Styles ---
const DOC_STYLES = {
    default: {
        document: {
            run: { font: "Calibri", size: 22 } // 11pt
        }
    },
    paragraphStyles: [
        {
            id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
            run: { size: 36, bold: true, font: "Calibri", color: "1a3a5c" },
            paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
        },
        {
            id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
            run: { size: 28, bold: true, font: "Calibri", color: "2a5a8c" },
            paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 }
        },
        {
            id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
            run: { size: 24, bold: true, font: "Calibri", color: "3d8eb9" },
            paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 2 }
        },
    ]
};

const NUMBERING = {
    config: [
        {
            reference: "bullets",
            levels: [{
                level: 0, format: LevelFormat.BULLET, text: "\u2022",
                alignment: AlignmentType.LEFT,
                style: { paragraph: { indent: { left: 720, hanging: 360 } } }
            }]
        },
    ]
};

function makeHeader() {
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

function makeFooter() {
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

function h1(text) { return new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(text)] }); }
function h2(text) { return new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] }); }
function h3(text) { return new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(text)] }); }
function p(text) { return new Paragraph({ spacing: { after: 120 }, children: [new TextRun(text)] }); }
function pBold(text) { return new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text, bold: true })] }); }
function bullet(text) { return new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 }, children: [new TextRun(text)] }); }
function bulletBold(label, text) {
    return new Paragraph({
        numbering: { reference: "bullets", level: 0 }, spacing: { after: 60 },
        children: [new TextRun({ text: label + ": ", bold: true }), new TextRun(text)]
    });
}
function spacer() { return new Paragraph({ spacing: { after: 120 }, children: [] }); }

function importantBox(text) {
    return new Paragraph({
        spacing: { before: 120, after: 120 },
        indent: { left: 360, right: 360 },
        children: [
            new TextRun({ text: "IMPORTANT: ", bold: true, color: "CC0000", font: "Calibri" }),
            new TextRun({ text, italics: true, color: "333333" }),
        ]
    });
}

async function createDoc(filename, sections) {
    const doc = new Document({
        styles: DOC_STYLES,
        numbering: NUMBERING,
        sections: [{
            properties: {
                page: {
                    size: { width: 12240, height: 15840 },
                    margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
                }
            },
            headers: { default: makeHeader() },
            footers: { default: makeFooter() },
            children: sections
        }]
    });

    const buffer = await Packer.toBuffer(doc);
    const outPath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(outPath, buffer);
    console.log(`  Created: ${filename}`);
}

// =====================================================
// DOCUMENT DEFINITIONS
// =====================================================

const DOCUMENTS = {

    "Trigger-Finger.docx": () => [
        h1("Trigger Finger (Stenosing Tenosynovitis)"),
        h2("What Is Trigger Finger?"),
        p("Trigger finger occurs when the flexor tendon in your finger becomes irritated and swollen, making it difficult to glide smoothly through the surrounding sheath (a tunnel called the A1 pulley). This results in catching, locking, or painful snapping of the affected finger."),
        h2("Symptoms"),
        bullet("Finger stiffness, especially in the morning"),
        bullet("A painful clicking or snapping sensation when bending or straightening the finger"),
        bullet("A tender bump (nodule) at the base of the affected finger in the palm"),
        bullet("Finger locking in a bent position that suddenly pops straight"),
        bullet("In severe cases, the finger may become locked and unable to straighten"),
        h2("Causes & Risk Factors"),
        bullet("Repetitive gripping activities or occupational hand use"),
        bullet("More common in women and individuals over age 40"),
        bullet("Associated with diabetes, rheumatoid arthritis, and hypothyroidism"),
        bullet("Can occur in multiple fingers simultaneously"),
        h2("Non-Surgical Treatment"),
        bulletBold("Activity modification", "Reducing repetitive gripping may decrease symptoms"),
        bulletBold("Splinting", "A splint may be used to keep the finger in a straight position, especially at night"),
        bulletBold("Anti-inflammatory medications", "NSAIDs (ibuprofen, naproxen) may help reduce pain and swelling"),
        bulletBold("Corticosteroid injection", "An injection into the tendon sheath is often the first-line treatment and is effective in many patients"),
        h2("Surgical Treatment: Trigger Finger Release"),
        p("If non-surgical measures fail, a minor surgical procedure called an A1 pulley release may be recommended. This outpatient procedure involves making a small incision in the palm to release the constricted portion of the tendon sheath, allowing the tendon to glide freely."),
        pBold("What to expect after surgery:"),
        bullet("The procedure is typically performed under local anesthesia"),
        bullet("You can move your finger immediately after surgery"),
        bullet("Soreness at the incision site is normal for several weeks"),
        bullet("Most patients return to normal activities within 2-4 weeks"),
        bullet("Hand therapy may be recommended if stiffness persists"),
        h2("When to Call Your Doctor"),
        bullet("Signs of infection: increasing redness, warmth, swelling, or drainage"),
        bullet("Fever above 101.5\u00B0F"),
        bullet("Numbness or tingling in the finger that does not resolve"),
        bullet("Inability to move the finger after surgery"),
    ],

    "Flexor-Tendon-Injury.docx": () => [
        h1("Flexor Tendon Injury"),
        h2("What Are Flexor Tendons?"),
        p("Flexor tendons are cord-like structures that connect the muscles of the forearm to the bones of the fingers and thumb. When these muscles contract, the flexor tendons allow you to bend (flex) your fingers to make a fist, grip objects, and perform fine motor tasks."),
        h2("How Do Flexor Tendon Injuries Occur?"),
        bullet("Cuts or lacerations to the palm, wrist, or finger (most common cause)"),
        bullet("Jersey finger: when a flexor tendon is torn from the bone during forceful gripping (e.g., grabbing a jersey in sports)"),
        bullet("Crush injuries or fractures that damage the tendon"),
        p("Flexor tendons cannot heal on their own when completely cut. Surgical repair is required to restore finger bending function."),
        h2("Diagnosis"),
        bullet("Physical examination testing the ability to bend each finger joint"),
        bullet("X-rays to rule out associated fractures or foreign bodies"),
        bullet("Ultrasound or MRI may be used in certain cases"),
        h2("Surgical Repair"),
        p("Flexor tendon repair is performed in the operating room. The severed tendon ends are stitched together using specialized suture techniques. The goal is to create a strong repair that allows early protected motion during healing."),
        pBold("Key points about surgery:"),
        bullet("Ideally performed within 1-2 weeks of injury for best outcomes"),
        bullet("General or regional anesthesia is typically used"),
        bullet("The incision may be extended to find retracted tendon ends"),
        bullet("Associated nerve or blood vessel injuries are repaired at the same time"),
        h2("Recovery & Rehabilitation"),
        importantBox("Hand therapy is critical to a successful outcome. Tendons need both protection and controlled motion to heal properly and avoid stiffness."),
        bulletBold("Weeks 0-4", "A protective splint is worn at all times. Your hand therapist will guide you through specific protected motion exercises."),
        bulletBold("Weeks 4-8", "Gradual increase in active motion. Splint use may be decreased."),
        bulletBold("Weeks 8-12", "Progressive strengthening begins. Return to light activities."),
        bulletBold("3-6 months", "Full recovery of grip strength. Return to unrestricted activities varies by individual."),
        h2("Potential Complications"),
        bullet("Tendon adhesions (scar tissue limiting glide) \u2014 the most common complication"),
        bullet("Re-rupture of the repair (risk is highest in the first 6-8 weeks)"),
        bullet("Finger stiffness requiring additional therapy or surgery"),
        bullet("Infection at the surgical site"),
        h2("When to Call Your Doctor"),
        bullet("Sudden loss of finger bending after a pop or snap"),
        bullet("Signs of infection: increasing redness, swelling, warmth, or drainage"),
        bullet("Numbness or color changes in the finger"),
    ],

    "Extensor-Tendon-Injury.docx": () => [
        h1("Extensor Tendon Injury"),
        h2("What Are Extensor Tendons?"),
        p("Extensor tendons run along the back of the hand and fingers, connecting the forearm muscles to the finger bones. They allow you to straighten (extend) your fingers and wrist. Because they lie just beneath the skin, they are vulnerable to injury."),
        h2("Common Types of Extensor Tendon Injuries"),
        h3("Mallet Finger"),
        p("A mallet finger occurs when the extensor tendon at the fingertip is damaged, causing the tip of the finger to droop. This commonly results from a ball striking the end of an extended finger."),
        bullet("Treatment: Continuous splinting of the fingertip in a straight position for 6-8 weeks"),
        bullet("Surgery may be needed if a large fracture fragment is present"),
        h3("Boutonniere Deformity"),
        p("This occurs when the central slip of the extensor tendon over the middle joint (PIP joint) is disrupted. The middle joint bends down while the fingertip hyperextends."),
        bullet("Treatment: Splinting of the PIP joint in extension for 6 weeks with active DIP flexion exercises"),
        bullet("Surgical repair may be necessary for chronic or severe cases"),
        h3("Lacerations on the Back of the Hand"),
        p("Cuts over the back of the hand or wrist can sever extensor tendons. Surgical repair is typically recommended for complete tendon lacerations."),
        h2("Surgical Repair"),
        p("Extensor tendon repair involves stitching the torn tendon ends together. Recovery protocols vary based on the zone of injury (location along the finger, hand, or wrist)."),
        h2("Rehabilitation"),
        bulletBold("Weeks 0-4", "Protective splinting. Controlled motion exercises as guided by your hand therapist."),
        bulletBold("Weeks 4-8", "Gradual increase in active range of motion."),
        bulletBold("Weeks 8-12", "Progressive strengthening and return to activities."),
        importantBox("Compliance with splinting instructions is essential. Removing a mallet finger splint too early can restart the healing process from the beginning."),
        h2("When to Call Your Doctor"),
        bullet("Inability to straighten the finger after injury"),
        bullet("Increasing pain, swelling, or signs of infection after repair"),
        bullet("Loss of motion that was previously achieved"),
    ],

    "Distal-Radius-Fracture.docx": () => [
        h1("Distal Radius Fracture (Wrist Fracture)"),
        h2("What Is a Distal Radius Fracture?"),
        p("A distal radius fracture is a break in the radius bone near the wrist joint. It is one of the most common fractures seen in orthopedic practice, often resulting from a fall onto an outstretched hand (FOOSH injury)."),
        h2("Types of Wrist Fractures"),
        bullet("Non-displaced: The bone is cracked but remains properly aligned"),
        bullet("Displaced: The bone fragments have shifted out of their normal position"),
        bullet("Intra-articular: The fracture extends into the wrist joint surface"),
        bullet("Open (compound): The bone breaks through the skin"),
        bullet("Comminuted: The bone is broken into multiple fragments"),
        h2("Diagnosis"),
        bullet("Physical examination of the wrist"),
        bullet("X-rays to identify the fracture pattern"),
        bullet("CT scan may be ordered for complex or intra-articular fractures"),
        h2("Non-Surgical Treatment (Casting)"),
        p("Stable, non-displaced, or minimally displaced fractures may be treated with a cast or splint for approximately 6 weeks. Regular follow-up X-rays are taken to ensure the fracture maintains alignment during healing."),
        h2("Surgical Treatment (ORIF)"),
        p("Displaced, unstable, or intra-articular fractures often benefit from surgery. Open reduction and internal fixation (ORIF) involves realigning the bone fragments and securing them with a metal plate and screws."),
        pBold("What to expect:"),
        bullet("Outpatient surgery typically performed under regional anesthesia"),
        bullet("A splint is worn for 1-2 weeks post-operatively"),
        bullet("Sutures are removed at approximately 10-14 days"),
        bullet("Finger motion is encouraged immediately after surgery"),
        bullet("Wrist motion begins at 2-6 weeks based on fracture healing"),
        h2("Rehabilitation Timeline"),
        bulletBold("Weeks 0-2", "Splint immobilization. Active finger, thumb, and elbow motion. Elevation to reduce swelling."),
        bulletBold("Weeks 2-6", "Transition to removable brace. Begin gentle wrist range of motion exercises with hand therapy."),
        bulletBold("Weeks 6-12", "Progressive strengthening. Increasing functional use of the hand."),
        bulletBold("3-6 months", "Full recovery of strength and motion. Return to sports and heavy activities."),
        h2("When to Call Your Doctor"),
        bullet("Increasing pain, swelling, or numbness despite elevation"),
        bullet("Fingers turning blue, white, or feeling very cold"),
        bullet("Inability to move your fingers"),
        bullet("Signs of infection: fever, increasing redness, or wound drainage"),
    ],

    "Carpal-Tunnel-Syndrome.docx": () => [
        h1("Carpal Tunnel Syndrome"),
        h2("What Is Carpal Tunnel Syndrome?"),
        p("Carpal tunnel syndrome (CTS) is the most common nerve compression condition of the upper extremity. It occurs when the median nerve is compressed as it passes through the carpal tunnel \u2014 a narrow passageway in the wrist formed by bones and a thick ligament (the transverse carpal ligament)."),
        h2("Symptoms"),
        bullet("Numbness and tingling in the thumb, index, middle, and ring fingers"),
        bullet("Symptoms often worse at night or when holding objects (driving, reading, phone use)"),
        bullet("Aching pain in the wrist, hand, or forearm"),
        bullet("Weakness and clumsiness with fine motor tasks (buttoning, gripping)"),
        bullet("In advanced cases: persistent numbness, muscle wasting at the base of the thumb"),
        h2("Causes & Risk Factors"),
        bullet("Repetitive hand and wrist motions"),
        bullet("Pregnancy and hormonal changes"),
        bullet("Diabetes, thyroid disorders, and rheumatoid arthritis"),
        bullet("Wrist fractures or dislocations that narrow the carpal tunnel"),
        bullet("More common in women and adults over 40"),
        h2("Diagnosis"),
        bullet("Physical examination including Tinel, Phalen, and compression tests"),
        bullet("Nerve conduction studies / electromyography (NCS/EMG) to confirm and grade severity"),
        h2("Non-Surgical Treatment"),
        bulletBold("Wrist splinting", "A neutral-position wrist splint worn at night keeps the carpal tunnel open and reduces symptoms"),
        bulletBold("Activity modification", "Avoiding prolonged wrist flexion/extension and repetitive gripping"),
        bulletBold("Anti-inflammatory medications", "NSAIDs may provide short-term relief"),
        bulletBold("Corticosteroid injection", "An injection into the carpal tunnel can reduce swelling and provide temporary relief, also useful as a diagnostic tool"),
        h2("Surgical Treatment: Carpal Tunnel Release"),
        p("When non-surgical treatment fails or nerve compression is severe, carpal tunnel release surgery is recommended. The transverse carpal ligament is divided to relieve pressure on the median nerve."),
        pBold("Procedure details:"),
        bullet("Performed as an outpatient procedure under local anesthesia (often WALANT \u2014 Wide Awake Local Anesthesia No Tourniquet)"),
        bullet("Small incision in the palm (~2-3 cm)"),
        bullet("Procedure takes approximately 10-15 minutes"),
        bullet("Immediate finger motion is encouraged"),
        h2("Recovery After Surgery"),
        bulletBold("Week 1", "Keep hand elevated. Move fingers frequently. Light activities permitted."),
        bulletBold("Weeks 2-4", "Suture removal. Gradual return to daily activities. Grip and pinch strengthening begins."),
        bulletBold("Weeks 4-12", "Progressive return to full activities. Pillar pain (soreness at the palm incision) is common and gradually resolves."),
        p("Numbness and tingling typically improve quickly after surgery. In severe or longstanding cases, nerve recovery may take several months, and some residual numbness may persist."),
        h2("When to Call Your Doctor"),
        bullet("Signs of infection at the incision site"),
        bullet("Worsening numbness or new weakness after surgery"),
        bullet("Persistent symptoms beyond 3 months post-surgery"),
    ],

    "Cubital-Tunnel-Syndrome.docx": () => [
        h1("Cubital Tunnel Syndrome"),
        h2("What Is Cubital Tunnel Syndrome?"),
        p("Cubital tunnel syndrome is compression of the ulnar nerve at the elbow. The ulnar nerve runs through a narrow passage called the cubital tunnel on the inner (medial) side of the elbow \u2014 the area commonly known as the \"funny bone.\""),
        h2("Symptoms"),
        bullet("Numbness and tingling in the ring and small fingers"),
        bullet("Symptoms often worse with elbow bending (sleeping, phone use, driving)"),
        bullet("Aching pain on the inner side of the elbow"),
        bullet("Weakness in grip and pinch strength"),
        bullet("In advanced cases: muscle wasting in the hand, difficulty with fine motor tasks"),
        h2("Non-Surgical Treatment"),
        bulletBold("Activity modification", "Avoid prolonged elbow flexion and leaning on the elbow"),
        bulletBold("Night splinting", "An elbow extension splint or towel wrap prevents excessive bending during sleep"),
        bulletBold("Nerve gliding exercises", "Gentle exercises to promote ulnar nerve mobility"),
        h2("Surgical Treatment"),
        p("Surgery is recommended when non-operative treatment fails or nerve compression is progressing. Options include:"),
        bulletBold("In-situ release", "Releasing the ligament roof of the cubital tunnel to decompress the nerve in its native position"),
        bulletBold("Anterior transposition", "Moving the ulnar nerve from behind the elbow to the front, protecting it from further compression"),
        h2("Recovery"),
        bulletBold("Weeks 0-2", "Soft dressing or splint. Early elbow and finger motion."),
        bulletBold("Weeks 2-6", "Progressive range of motion. Activity as tolerated."),
        bulletBold("6-12 weeks", "Gradual return to full activity and strengthening."),
        p("Nerve recovery can take several months. Tingling symptoms often improve first, followed by gradual return of strength."),
    ],

    "TFCC-Injury.docx": () => [
        h1("Ulnar-Sided Wrist Pain & TFCC Injury"),
        h2("What Is the TFCC?"),
        p("The triangular fibrocartilage complex (TFCC) is a cartilage and ligament structure on the ulnar (pinky) side of the wrist. It stabilizes the wrist joint, cushions the small wrist bones, and allows smooth forearm rotation."),
        h2("How TFCC Injuries Occur"),
        bullet("Fall onto an outstretched hand"),
        bullet("Rotational injuries to the wrist (e.g., using a drill, swinging a racket)"),
        bullet("Degenerative wear with aging"),
        bullet("Positive ulnar variance (the ulna bone is longer than the radius)"),
        h2("Symptoms"),
        bullet("Pain on the pinky side of the wrist, especially with gripping or twisting motions"),
        bullet("Clicking or popping with forearm rotation"),
        bullet("Weakness with gripping"),
        bullet("Tenderness over the ulnar side of the wrist"),
        h2("Diagnosis"),
        bullet("Physical examination with provocative tests (fovea sign, press test)"),
        bullet("MRI or MR arthrogram to visualize the TFCC"),
        bullet("Wrist arthroscopy may serve as both diagnostic and therapeutic"),
        h2("Treatment"),
        h3("Non-Surgical"),
        bullet("Wrist splinting or bracing to immobilize the wrist"),
        bullet("Anti-inflammatory medications"),
        bullet("Corticosteroid injection"),
        bullet("Hand therapy for wrist stabilization exercises"),
        h3("Surgical (Arthroscopic)"),
        p("When conservative treatment fails, wrist arthroscopy allows direct visualization and repair of the TFCC through small incisions. Procedures may include debridement (trimming damaged tissue), repair of the TFCC to bone, or ulnar shortening osteotomy if ulnar variance is a contributing factor."),
        h2("Recovery After Arthroscopic TFCC Repair"),
        bulletBold("Weeks 0-4", "Splint or cast immobilization."),
        bulletBold("Weeks 4-8", "Gentle range of motion with hand therapy."),
        bulletBold("Weeks 8-12", "Progressive strengthening."),
        bulletBold("3-6 months", "Full return to sports and heavy activities."),
    ],

    "Wrist-Arthritis-Fusion.docx": () => [
        h1("Wrist Arthritis & Wrist Fusion"),
        h2("What Is Wrist Arthritis?"),
        p("Wrist arthritis is the loss of the smooth cartilage surfaces within the wrist joint. This can result from previous fractures (post-traumatic arthritis), ligament injuries (SLAC/SNAC wrist), inflammatory conditions (rheumatoid arthritis), or age-related wear."),
        h2("Symptoms"),
        bullet("Wrist pain that worsens with activity and improves with rest"),
        bullet("Stiffness and decreased range of motion"),
        bullet("Swelling around the wrist joint"),
        bullet("Weakness with gripping and lifting"),
        bullet("Grinding sensation with wrist motion"),
        h2("Non-Surgical Treatment"),
        bulletBold("Activity modification and bracing", "A wrist brace can reduce pain during activities"),
        bulletBold("Anti-inflammatory medications", "NSAIDs for pain relief"),
        bulletBold("Corticosteroid injections", "Can provide temporary relief and help confirm the diagnosis"),
        bulletBold("Hand therapy", "Strengthening and range of motion exercises"),
        h2("Surgical Options"),
        h3("Partial Wrist Fusion (Limited Arthrodesis)"),
        p("When arthritis affects only part of the wrist, a partial fusion (e.g., four-corner fusion, scaphoid excision) eliminates the painful joint surfaces while preserving some wrist motion."),
        h3("Total Wrist Fusion (Arthrodesis)"),
        p("For severe, diffuse wrist arthritis, total wrist fusion eliminates all wrist motion but provides a pain-free, stable, and strong wrist. A metal plate and screws are used to fuse the wrist bones to the forearm bone (radius) and hand bones (metacarpals)."),
        pBold("What to expect:"),
        bullet("Wrist motion is eliminated, but forearm rotation is preserved"),
        bullet("Grip strength is typically maintained or improved"),
        bullet("Finger motion is unaffected"),
        bullet("Most patients report significant pain relief"),
        h2("Recovery"),
        bulletBold("Weeks 0-6", "Cast or splint immobilization while bones fuse."),
        bulletBold("Weeks 6-12", "Gradual return to activities. X-rays to confirm healing."),
        bulletBold("3-6 months", "Full healing. Return to heavy activities."),
        h3("Proximal Row Carpectomy"),
        p("An alternative to fusion for certain patterns of arthritis. The three bones of the proximal row of the wrist are removed, allowing the remaining wrist bones to articulate with the radius. This preserves some wrist motion."),
    ],

    "Thumb-CMC-Arthritis.docx": () => [
        h1("Thumb CMC Joint Arthritis (Basal Joint Arthritis)"),
        h2("What Is Thumb CMC Arthritis?"),
        p("The carpometacarpal (CMC) joint at the base of the thumb is one of the most common sites of arthritis in the hand. This joint allows the thumb to pinch, grip, and oppose the fingers. When the cartilage wears away, bone-on-bone contact causes pain and limits function."),
        h2("Symptoms"),
        bullet("Pain at the base of the thumb with pinching, gripping, or opening jars"),
        bullet("Swelling and tenderness at the thumb base"),
        bullet("Decreased pinch and grip strength"),
        bullet("Stiffness and limited thumb motion"),
        bullet("A bony prominence or bump at the thumb base"),
        h2("Non-Surgical Treatment"),
        bulletBold("Thumb spica splint", "A rigid or semi-rigid splint supports the thumb base and reduces pain during activities"),
        bulletBold("Anti-inflammatory medications", "NSAIDs for pain management"),
        bulletBold("Corticosteroid injection", "Can provide significant temporary pain relief"),
        bulletBold("Hand therapy", "Strengthening and stabilization exercises"),
        h2("Surgical Treatment"),
        p("When non-surgical treatment no longer provides adequate relief, surgical options include:"),
        bulletBold("Trapeziectomy with LRTI", "Removal of the arthritic trapezium bone and reconstruction using a tendon graft (ligament reconstruction tendon interposition). This is the most commonly performed procedure."),
        bulletBold("CMC arthroplasty", "Joint replacement with an implant in select cases"),
        bulletBold("CMC arthrodesis (fusion)", "Fusing the joint for younger, high-demand patients"),
        h2("Recovery After Trapeziectomy"),
        bulletBold("Weeks 0-6", "Thumb spica cast or splint immobilization."),
        bulletBold("Weeks 6-12", "Hand therapy to restore thumb motion and begin gentle strengthening."),
        bulletBold("3-6 months", "Progressive strengthening. Gradual return to full activities."),
        p("Full recovery and maximum grip/pinch strength may take up to 6-12 months."),
    ],

    "Dupuytrens-Contracture.docx": () => [
        h1("Dupuytren's Contracture"),
        h2("What Is Dupuytren's Disease?"),
        p("Dupuytren's disease is a condition in which abnormal collagen deposits (cords and nodules) form in the fascia of the palm and fingers. Over time, these cords can contract and pull the fingers into a bent position, making it difficult to straighten them fully."),
        h2("Symptoms"),
        bullet("Firm nodules or lumps in the palm"),
        bullet("Thick cords extending from the palm into the fingers"),
        bullet("Progressive inability to straighten one or more fingers (most commonly the ring and small fingers)"),
        bullet("Difficulty with tasks like placing hands flat on a table, wearing gloves, or shaking hands"),
        h2("Risk Factors"),
        bullet("Northern European descent (historically called \"Viking disease\")"),
        bullet("Male gender, typically over age 50"),
        bullet("Family history of Dupuytren's"),
        bullet("Associated with diabetes, smoking, and heavy alcohol use"),
        h2("When Is Treatment Recommended?"),
        p("Treatment is typically recommended when you can no longer lay your hand flat on a table (positive \"tabletop test\") or when the contracture interferes with daily activities. Mild nodules without contracture are usually observed."),
        h2("Treatment Options"),
        h3("Needle Aponeurotomy (NA)"),
        p("An office-based procedure in which a needle is used to perforate and weaken the Dupuytren cord, followed by manipulation to straighten the finger. Performed under local anesthesia with minimal downtime. Recurrence rates are higher than with surgery."),
        h3("Open Fasciectomy"),
        p("A surgical procedure to remove the diseased fascia through an incision in the palm and/or finger. This provides the most durable correction but requires a longer recovery."),
        h2("Recovery"),
        bulletBold("After needle aponeurotomy", "Minimal downtime. Hand therapy and splinting for several weeks."),
        bulletBold("After open fasciectomy", "Wound care for 2-3 weeks. Hand therapy for 2-3 months. Night extension splinting for up to 6 months to maintain correction."),
    ],

    "DeQuervains-Tenosynovitis.docx": () => [
        h1("De Quervain's Tenosynovitis"),
        h2("What Is De Quervain's?"),
        p("De Quervain's tenosynovitis is inflammation of the tendons on the thumb side of the wrist (the first dorsal compartment). These tendons (abductor pollicis longus and extensor pollicis brevis) help move the thumb away from the hand. When the sheath around them thickens, the tendons cannot glide smoothly, causing pain."),
        h2("Symptoms"),
        bullet("Pain on the thumb side of the wrist, especially with gripping, twisting, or thumb motion"),
        bullet("Swelling near the base of the thumb"),
        bullet("A \"sticking\" or snapping sensation when moving the thumb"),
        bullet("Pain with the Finkelstein test (bending the thumb across the palm and tilting the wrist)"),
        h2("Causes & Risk Factors"),
        bullet("Repetitive thumb and wrist motions (texting, gaming, lifting a baby)"),
        bullet("New parents (\"new mom's thumb\" or \"de Quervain's of parenthood\")"),
        bullet("Hormonal changes (pregnancy, postpartum)"),
        bullet("Rheumatoid arthritis"),
        h2("Non-Surgical Treatment"),
        bulletBold("Thumb spica splint", "Immobilizes the thumb and wrist to rest the inflamed tendons"),
        bulletBold("Anti-inflammatory medications", "NSAIDs for pain and inflammation"),
        bulletBold("Corticosteroid injection", "Highly effective. Studies show 60-80% resolution with a single injection."),
        bulletBold("Activity modification", "Avoid repetitive thumb pinching and wrist deviation"),
        h2("Surgical Treatment"),
        p("If injections and splinting fail, a surgical release of the first dorsal compartment is performed. This outpatient procedure involves a small incision over the thumb side of the wrist to open the tight tendon sheath."),
        h2("Recovery After Surgery"),
        bullet("Suture removal at 10-14 days"),
        bullet("Gentle thumb and wrist motion begins immediately"),
        bullet("Most patients return to full activities within 4-6 weeks"),
    ],

    "Scaphoid-Fracture.docx": () => [
        h1("Scaphoid Fracture"),
        h2("What Is the Scaphoid?"),
        p("The scaphoid is a small, cashew-shaped bone on the thumb side of the wrist. It is the most commonly fractured carpal (wrist) bone, typically from a fall onto an outstretched hand."),
        h2("Why Are Scaphoid Fractures Important?"),
        p("The scaphoid has a limited blood supply, which means certain fractures (especially those at the waist or proximal pole) are at risk for avascular necrosis (AVN) \u2014 loss of blood supply leading to bone death. Early diagnosis and proper treatment are critical to prevent complications."),
        h2("Symptoms"),
        bullet("Pain in the anatomical snuffbox (the hollow space at the base of the thumb)"),
        bullet("Wrist pain with gripping or thumb motion"),
        bullet("Swelling may be minimal initially"),
        importantBox("Scaphoid fractures are often missed on initial X-rays. If a scaphoid fracture is suspected clinically, you may be placed in a splint and have repeat imaging (X-ray, CT, or MRI) in 1-2 weeks."),
        h2("Treatment"),
        h3("Non-Displaced Fractures"),
        p("A thumb spica cast for 8-12 weeks, with regular X-rays to monitor healing."),
        h3("Displaced or Unstable Fractures"),
        p("Surgical fixation with a headless compression screw provides rigid fixation and may allow earlier motion and faster return to activity."),
        h2("Recovery"),
        bullet("Scaphoid fractures can take 8-16 weeks to heal, depending on location"),
        bullet("Proximal pole fractures take the longest due to limited blood supply"),
        bullet("Hand therapy begins after immobilization is complete"),
        bullet("Return to sports typically at 3-4 months, depending on healing"),
    ],

    "Ganglion-Cyst.docx": () => [
        h1("Ganglion Cyst"),
        h2("What Is a Ganglion Cyst?"),
        p("A ganglion cyst is a fluid-filled sac that develops near a joint or tendon, most commonly at the wrist. They are the most common soft tissue mass in the hand and wrist. Ganglion cysts are benign (non-cancerous) and filled with a thick, clear, jelly-like fluid."),
        h2("Common Locations"),
        bullet("Dorsal (back) wrist \u2014 most common (60-70% of cases)"),
        bullet("Volar (palm side) wrist"),
        bullet("Finger flexor tendon sheath (retinacular cyst)"),
        bullet("Base of the finger (mucous cyst associated with DIP joint arthritis)"),
        h2("Symptoms"),
        bullet("A visible or palpable bump that may change in size"),
        bullet("Aching pain with wrist activity or pressure on the cyst"),
        bullet("Many ganglions are painless and only a cosmetic concern"),
        h2("Treatment"),
        h3("Observation"),
        p("Many ganglion cysts resolve on their own. If the cyst is painless and not interfering with function, watchful waiting is a reasonable option."),
        h3("Aspiration"),
        p("A needle is used to drain the fluid from the cyst in the office. Recurrence after aspiration is common (approximately 50%)."),
        h3("Surgical Excision"),
        p("For persistent or recurrent cysts, surgical excision removes the cyst along with a portion of the joint capsule or tendon sheath at its base. Recurrence after excision is approximately 5-10%."),
    ],

    "Finger-Stiffness-Protocol.docx": () => [
        h1("Finger Stiffness: Rehabilitation Protocol"),
        h2("Overview"),
        p("Finger stiffness is a common problem following hand injuries, fractures, tendon repairs, and surgery. The goal of rehabilitation is to restore as much motion as possible while protecting healing structures. This guide outlines general principles \u2014 your surgeon and hand therapist will provide a protocol specific to your condition."),
        h2("Causes of Finger Stiffness"),
        bullet("Prolonged immobilization in a cast or splint"),
        bullet("Scar tissue and tendon adhesions after surgery"),
        bullet("Swelling (edema) that limits joint motion"),
        bullet("Joint contracture from prolonged positioning"),
        bullet("Pain avoidance leading to disuse"),
        h2("General Principles"),
        bulletBold("Elevation", "Keep the hand above heart level to reduce swelling, especially in the first 2 weeks after injury/surgery"),
        bulletBold("Edema control", "Compression wraps (Coban), retrograde massage, and active pumping exercises"),
        bulletBold("Early motion", "Moving fingers as early as safely allowed prevents adhesions"),
        bulletBold("Consistency", "Perform exercises 4-6 times daily for best results"),
        h2("Basic Exercises"),
        h3("Tendon Gliding Exercises"),
        p("These exercises move the tendons through their full range to prevent adhesions. Perform each position and hold for 5 seconds:"),
        bullet("Straight (table-top) \u2192 Hook fist \u2192 Full fist \u2192 Straight fist \u2192 Full extension"),
        h3("Passive Range of Motion"),
        p("Using the opposite hand, gently bend and straighten each finger joint to maintain flexibility. Hold stretches for 10-15 seconds."),
        h3("Blocking Exercises"),
        p("Isolate individual finger joints by stabilizing one joint while bending the next. This targets specific areas of stiffness."),
        h2("Splinting for Stiffness"),
        bullet("Static progressive splints apply a gentle, sustained stretch to contracted joints"),
        bullet("Dynamic splints use rubber bands or springs to provide continuous low-load stretching"),
        bullet("Night extension splints maintain gains achieved during therapy sessions"),
        h2("When to Seek Additional Help"),
        bullet("Stiffness that is not improving despite consistent therapy (6-8 weeks)"),
        bullet("Your surgeon may recommend surgical release (tenolysis or capsulotomy) for severe, refractory stiffness"),
    ],

    "Elbow-Stiffness-Protocol.docx": () => [
        h1("Elbow Stiffness: Rehabilitation Protocol"),
        h2("Overview"),
        p("The elbow is particularly prone to stiffness after injury, fracture, or surgery. Even a small loss of elbow motion can significantly impact daily activities. Early intervention and dedicated rehabilitation are essential for the best outcomes."),
        h2("Functional Elbow Motion"),
        p("Normal elbow range of motion is 0\u00B0 (full extension) to 145\u00B0 (full flexion). Research shows that most daily activities can be accomplished with 30-130\u00B0 of flexion and 50\u00B0 of forearm rotation in each direction (pronation and supination)."),
        h2("Causes of Elbow Stiffness"),
        bullet("Fractures (especially distal humerus, radial head, and olecranon)"),
        bullet("Elbow dislocation"),
        bullet("Prolonged immobilization"),
        bullet("Burns or soft tissue injury around the elbow"),
        bullet("Heterotopic ossification (abnormal bone formation in soft tissues)"),
        h2("Rehabilitation Principles"),
        bulletBold("Early motion", "Begin motion as soon as safely allowed by your surgeon"),
        bulletBold("Low-load, prolonged stretch", "Gentle, sustained stretching is more effective than forceful manipulation"),
        bulletBold("Avoid aggressive passive stretching", "Forcing the elbow can trigger more inflammation and worsen stiffness"),
        bulletBold("Consistent daily exercises", "Perform range of motion exercises 4-6 times per day"),
        h2("Exercise Program"),
        h3("Active Range of Motion"),
        bullet("Elbow flexion/extension: Slowly bend and straighten the elbow to your maximum comfortable range. 10-15 repetitions."),
        bullet("Forearm rotation: With the elbow at your side bent to 90\u00B0, rotate the forearm palm-up (supination) and palm-down (pronation). 10-15 repetitions."),
        h3("Static Progressive Splinting"),
        p("Turnbuckle or adjustable splints can be used to apply a sustained stretch at end-range. Wear for 20-30 minute sessions, 3-4 times daily."),
        h2("Surgical Options for Refractory Stiffness"),
        p("If stiffness does not improve with therapy (typically after 4-6 months), surgical options include:"),
        bullet("Arthroscopic or open capsular release"),
        bullet("Removal of heterotopic ossification"),
        bullet("Hardware removal if symptomatic"),
    ],

    "Tennis-Elbow.docx": () => [
        h1("Tennis Elbow (Lateral Epicondylitis)"),
        h2("What Is Tennis Elbow?"),
        p("Lateral epicondylitis, commonly known as \"tennis elbow,\" is a painful condition affecting the tendons on the outside of the elbow. Despite its name, it most commonly results from repetitive occupational or recreational activities rather than tennis. It involves microscopic tearing and degeneration of the extensor carpi radialis brevis (ECRB) tendon."),
        h2("Symptoms"),
        bullet("Pain on the outside of the elbow that may radiate down the forearm"),
        bullet("Weak grip strength"),
        bullet("Pain with gripping, twisting, or lifting activities"),
        bullet("Tenderness directly over the lateral epicondyle (bony bump on the outer elbow)"),
        h2("Non-Surgical Treatment"),
        p("The vast majority of tennis elbow cases (80-90%) resolve with non-surgical treatment within 6-12 months."),
        bulletBold("Activity modification", "Avoid repetitive gripping and wrist extension activities"),
        bulletBold("Counterforce brace", "A forearm strap worn just below the elbow reduces stress on the affected tendon"),
        bulletBold("Physical therapy", "Eccentric strengthening exercises are the cornerstone of treatment"),
        bulletBold("Anti-inflammatory measures", "Ice, NSAIDs, and topical anti-inflammatories"),
        bulletBold("Corticosteroid injection", "May provide short-term relief but evidence suggests limited long-term benefit"),
        h2("Surgical Treatment"),
        p("For persistent symptoms beyond 6-12 months of conservative treatment, surgical debridement of the degenerated tendon tissue may be recommended. This can be performed as an open or arthroscopic procedure with good long-term outcomes."),
        h2("Recovery After Surgery"),
        bulletBold("Weeks 0-2", "Splint immobilization. Gentle finger and shoulder motion."),
        bulletBold("Weeks 2-6", "Progressive elbow range of motion and gentle strengthening."),
        bulletBold("Weeks 6-12", "Progressive strengthening and return to activities."),
        bulletBold("3-6 months", "Full return to sports and heavy labor."),
    ],

    "Elbow-Fracture-Care.docx": () => [
        h1("Elbow Fracture Care"),
        h2("Overview"),
        p("Elbow fractures are common injuries that can involve the distal humerus (upper arm bone), olecranon (tip of the elbow), or radial head (forearm bone at the elbow). Treatment depends on the specific fracture pattern, degree of displacement, and joint involvement."),
        h2("Common Elbow Fractures"),
        h3("Radial Head Fracture"),
        p("The most common elbow fracture in adults. Often occurs from a fall onto an outstretched hand. Treatment ranges from sling immobilization (non-displaced) to surgical fixation or replacement (displaced/comminuted)."),
        h3("Olecranon Fracture"),
        p("A fracture of the bony tip of the elbow. Because the triceps tendon attaches here, displaced fractures almost always require surgical repair with pins, screws, or plates to restore the ability to straighten the elbow."),
        h3("Distal Humerus Fracture"),
        p("Fractures involving the end of the upper arm bone at the elbow joint. These are more common in elderly patients and often require surgical fixation with plates and screws."),
        h2("General Treatment Principles"),
        bullet("Non-displaced, stable fractures may be treated with brief immobilization followed by early motion"),
        bullet("Displaced or intra-articular fractures typically require surgery to restore the joint surface"),
        bullet("Early range of motion is critical to prevent elbow stiffness"),
        importantBox("Elbow stiffness is the most common complication after elbow fractures. Following your motion protocol and attending hand therapy appointments is essential."),
        h2("Post-Operative Guidelines"),
        bulletBold("Elevation", "Keep elbow elevated above heart level for the first 48-72 hours"),
        bulletBold("Ice", "Apply ice for 20 minutes at a time to reduce swelling"),
        bulletBold("Motion", "Begin gentle range of motion exercises as directed by your surgeon"),
        bulletBold("Weight restrictions", "Avoid lifting with the affected arm as instructed"),
    ],

    "Nerve-Injury-Recovery.docx": () => [
        h1("Nerve Injury & Recovery"),
        h2("Understanding Peripheral Nerves"),
        p("Peripheral nerves carry signals between the brain/spinal cord and the muscles and skin of the upper extremity. When a nerve is injured, it can cause numbness, tingling, weakness, or pain in the areas supplied by that nerve."),
        h2("Types of Nerve Injury"),
        bulletBold("Neurapraxia", "Nerve bruise. The nerve is stretched but not torn. Recovery is typically complete within weeks to months."),
        bulletBold("Axonotmesis", "Nerve fibers are damaged but the outer sheath is intact. The nerve can regenerate along its original pathway. Recovery takes months."),
        bulletBold("Neurotmesis", "Complete nerve transection. Surgical repair is required. Recovery is slow and may be incomplete."),
        h2("Nerve Repair Surgery"),
        p("When a nerve is completely cut, surgical repair reconnects the severed ends. If a gap exists, a nerve graft (from a donor nerve) or nerve conduit may be used to bridge the gap."),
        pBold("Factors affecting recovery:"),
        bullet("Age (younger patients recover better)"),
        bullet("Level of injury (injuries closer to the target muscles recover faster)"),
        bullet("Time from injury to repair (earlier repair yields better results)"),
        bullet("Type and severity of injury"),
        h2("Nerve Recovery Timeline"),
        p("After repair, nerves regenerate at approximately 1 mm per day (about 1 inch per month). Recovery is measured in months to years, depending on the distance from the repair to the target muscle or skin."),
        bulletBold("Tingling (Tinel sign)", "As the nerve regenerates, you may feel tingling that gradually moves toward the fingertips \u2014 this is a positive sign of recovery"),
        bulletBold("Sensation", "Returns gradually, often starting with protective sensation"),
        bulletBold("Motor function", "Muscle recovery depends on nerve-to-muscle distance and may be incomplete"),
        h2("Nerve Stimulator Protocol"),
        p("In some cases, your surgeon may recommend the use of a nerve stimulator to aid in nerve recovery and monitor regeneration. This may involve:"),
        bullet("Electrical nerve stimulation to promote nerve growth"),
        bullet("Serial examination with advancing Tinel sign"),
        bullet("Sensory re-education exercises with your hand therapist"),
        h2("Sensory Re-education"),
        p("Once protective sensation begins to return, sensory re-education exercises help the brain reinterpret the new nerve signals. These exercises involve:"),
        bullet("Texture discrimination (rough vs. smooth surfaces)"),
        bullet("Object identification with eyes closed"),
        bullet("Localization exercises (determining where on the skin a touch is felt)"),
    ],

    "Post-Op-Hand-Therapy.docx": () => [
        h1("Post-Operative Hand Therapy Guide"),
        h2("Overview"),
        p("Hand therapy after surgery is essential for achieving the best possible outcome. This guide provides general guidelines for the early post-operative period. Your surgeon and certified hand therapist (CHT) will provide a protocol specific to your procedure."),
        h2("General Post-Operative Instructions"),
        h3("Wound Care"),
        bullet("Keep the surgical dressing clean and dry until your first follow-up appointment"),
        bullet("Do not remove the dressing unless instructed by your surgeon"),
        bullet("Once cleared, keep the incision clean with gentle soap and water"),
        bullet("Apply a thin layer of antibiotic ointment (if directed) and a clean bandage"),
        bullet("Avoid soaking the hand in water (no baths, pools, or hot tubs) until fully healed"),
        h3("Swelling Management"),
        bulletBold("Elevation", "Keep the hand above heart level as much as possible for the first 1-2 weeks. Sleep with the hand on a pillow."),
        bulletBold("Ice", "Apply ice for 15-20 minutes at a time, with a cloth barrier, to reduce swelling"),
        bulletBold("Compression", "Gentle Coban wrap or compression glove as directed by your therapist"),
        bulletBold("Active pumping", "Open and close the fingers frequently to pump swelling out of the hand"),
        h3("Pain Management"),
        bullet("Take prescribed pain medication as directed"),
        bullet("Transition to over-the-counter medications (acetaminophen, ibuprofen) as pain decreases"),
        bullet("Ice and elevation are effective non-pharmacologic pain relievers"),
        h2("Scar Management"),
        p("Beginning approximately 2-3 weeks after surgery (once the incision is fully closed):"),
        bullet("Scar massage: Firmly rub the scar in circular motions for 5 minutes, 3-4 times daily"),
        bullet("Silicone gel sheets or silicone scar cream can help flatten and soften scars"),
        bullet("Desensitization: If the scar is hypersensitive, gradually expose it to different textures"),
        h2("When to Call Your Doctor"),
        bullet("Fever above 101.5\u00B0F"),
        bullet("Increasing redness, warmth, or swelling around the incision"),
        bullet("Wound drainage that is cloudy, yellow, or foul-smelling"),
        bullet("Sudden increase in pain not relieved by medication"),
        bullet("Numbness, tingling, or color changes in the fingers"),
        bullet("Any concerns about your recovery"),
    ],

    "Wrist-Fracture-Rehab.docx": () => [
        h1("Wrist Fracture Rehabilitation Protocol"),
        h2("Overview"),
        p("This protocol provides general guidelines for rehabilitation after a distal radius (wrist) fracture treated with casting or surgical fixation (ORIF). Your surgeon will modify this timeline based on your specific fracture and healing progress."),
        h2("Phase 1: Protection (Weeks 0-2)"),
        pBold("Goals: Protect the fracture, control swelling, maintain finger motion"),
        bullet("Elevate the hand above heart level frequently"),
        bullet("Active range of motion: fingers, thumb, elbow, and shoulder"),
        bullet("Gentle finger tendon gliding exercises"),
        bullet("No wrist motion unless specifically cleared"),
        h2("Phase 2: Early Motion (Weeks 2-6)"),
        pBold("Goals: Begin gentle wrist motion, continue swelling control"),
        bullet("Transition to removable splint (if surgical fixation)"),
        bullet("Active wrist flexion/extension and radial/ulnar deviation"),
        bullet("Forearm rotation (supination/pronation)"),
        bullet("Grip strengthening with therapy putty (light resistance)"),
        bullet("Continue finger range of motion exercises"),
        h2("Phase 3: Strengthening (Weeks 6-12)"),
        pBold("Goals: Restore strength and functional use"),
        bullet("Progressive grip and pinch strengthening"),
        bullet("Weight-bearing as tolerated (push-ups, weight lifting)"),
        bullet("Functional activities (cooking, opening jars, carrying groceries)"),
        bullet("Stretching for any residual stiffness"),
        h2("Phase 4: Return to Full Activity (3-6 Months)"),
        pBold("Goals: Full return to work, sports, and activities"),
        bullet("Sport-specific or work-specific training"),
        bullet("Impact activities (contact sports, heavy lifting) typically allowed at 3-6 months"),
        bullet("Maximum strength and motion improvement may continue for up to 1 year"),
        h2("Expected Outcomes"),
        bullet("Most patients recover 80-90% of their pre-injury wrist motion"),
        bullet("Grip strength typically returns to near-normal by 6 months"),
        bullet("Some wrist stiffness or weather-related achiness is common and usually mild"),
    ],
};

// =====================================================
// GENERATE ALL DOCUMENTS
// =====================================================

async function main() {
    console.log("Generating patient education documents...\n");

    const entries = Object.entries(DOCUMENTS);
    for (const [filename, contentFn] of entries) {
        try {
            await createDoc(filename, contentFn());
        } catch (err) {
            console.error(`  ERROR creating ${filename}: ${err.message}`);
        }
    }

    console.log(`\nDone! ${entries.length} documents created in: ${OUTPUT_DIR}`);
}

main().catch(console.error);
