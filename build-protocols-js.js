/**
 * Build js/protocols.js from parsed JSON.
 * Generates card entries for all new protocols plus 1 kept legacy file.
 */
const fs = require('fs');
const path = require('path');
const d = require('./protocols-parsed.json');

function prettifyTitle(name) {
    let t = name.replace(/\s+PROTOCOL\s*$/i, '').replace(/\s+/g, ' ').trim();
    return t.split(' ').map(w => {
        const clean = w.replace(/[().,:;]/g, '');
        if (/^(AC|SC|ACL|UCL|LUCL|MDI|SLAP|TSA|ORIF|ROM|MFC|CMC|LRTI|PIP|DIP|MCP|MP|DRUJ|TFCC|I|II|III|IV|V)$/i.test(clean)) {
            return w.toUpperCase();
        }
        if (w === '&' || w === '-' || w === '/' || w === '+') return w;
        if (w.length === 0) return w;
        return w[0].toUpperCase() + w.slice(1).toLowerCase();
    }).join(' ');
}

function categoryFor(p) {
    // NonOp by name prefix
    if (p.bodyPart === 'NonOp') return 'nonop';
    if (p.bodyPart === 'Shoulder') return 'shoulder-proto';
    if (p.bodyPart === 'Elbow') return 'elbow-proto';
    // Hand and Wrist share 'hand-proto' filter in current UI
    return 'hand-proto';
}

function shortDescription(p) {
    // Manual overrides for key ones; otherwise generate from first phase or body part
    const overrides = {
        'Shoulder-Rotator-Cuff-Repair.docx': 'Phase-based rehab following arthroscopic rotator cuff repair with sling, ROM progression, and strengthening milestones.',
        'Shoulder-Massive-Rotator-Cuff-Repair.docx': 'Extended protection protocol for massive (multi-tendon) rotator cuff repairs with delayed strengthening.',
        'Shoulder-Rotator-Cuff-Repair-With-Biceps-Tenodesis.docx': 'Combined rotator cuff repair and biceps tenodesis with elbow flexion restrictions.',
        'Shoulder-Rotator-Cuff-Repair-With-Subscapularis-Repair.docx': 'Rotator cuff repair with subscapularis component — internal rotation restrictions.',
        'Shoulder-Biceps-Tenodesis.docx': 'Subpectoral or arthroscopic biceps tenodesis with biceps loading restrictions.',
        'Shoulder-Anterior-Shoulder-Stabilization-Bankart-Repair.docx': 'Arthroscopic labral repair for anterior instability with external rotation restrictions.',
        'Shoulder-Posterior-Shoulder-Stabilization.docx': 'Posterior labral repair with internal rotation and cross-body adduction restrictions.',
        'Shoulder-Multidirectional-Instability-MDI-Repair.docx': 'Capsular plication for multidirectional instability with ROM restrictions in all planes.',
        'Shoulder-Superior-Labrum-SLAP-Repair.docx': 'Superior labrum repair with biceps anchor protection.',
        'Shoulder-Coracoid-Transfer-Latarjet.docx': 'Coracoid transfer for recurrent instability with bone loss — biceps/ER restrictions.',
        'Shoulder-Latarjet-With-Remplissage.docx': 'Latarjet with posterior Hill-Sachs remplissage — combined stabilization with ER and IR restrictions.',
        'Shoulder-Anatomic-Total-Shoulder-Arthroplasty.docx': 'Total shoulder replacement rehab with subscapularis protection and phased ROM/strengthening.',
        'Shoulder-Reverse-Total-Shoulder-Arthroplasty.docx': 'Reverse TSA for cuff-deficient shoulders with deltoid-focused rehab.',
        'Shoulder-Hemiarthroplasty.docx': 'Humeral head replacement rehabilitation protocol.',
        'Shoulder-Subacromial-Decompression.docx': 'Accelerated protocol following subacromial decompression with or without distal clavicle excision.',
        'Shoulder-Midshaft-Clavicle-ORIF.docx': 'Plate fixation of midshaft clavicle fracture rehab.',
        'Shoulder-Distal-Clavicle-ORIF.docx': 'Distal clavicle fracture fixation with cross-body adduction restriction.',
        'Shoulder-Proximal-Humerus-ORIF.docx': 'Proximal humerus fracture fixation (2-3 part) with phased ROM progression.',
        'Shoulder-Proximal-Humerus-ORIF-4-Part.docx': 'Extended protection protocol for 4-part proximal humerus ORIF.',
        'Shoulder-Proximal-Humerus-Intramedullary-Nail-4-Part.docx': 'IM nail fixation for 4-part proximal humerus fracture rehab.',
        'Shoulder-Acromioclavicular-AC-Joint-Reconstruction.docx': 'AC joint reconstruction with extended protection phase.',
        'Shoulder-Sternoclavicular-SC-Joint-Reconstruction.docx': 'Sternoclavicular joint reconstruction rehab.',
        'Shoulder-Pectoralis-Major-Tendon-Repair.docx': 'Pec major tendon repair with horizontal adduction and ER restrictions.',
        'Shoulder-Pectoralis-Major-Tendon-Reconstruction.docx': 'Pec major tendon reconstruction with autograft/allograft — extended protection.',
        'Shoulder-Lower-Trapezius-Tendon-Transfer.docx': 'Lower trapezius tendon transfer for irreparable posterosuperior cuff tears.',

        'Elbow-Lateral-Medial-Epicondylitis-Debridement.docx': 'Post-debridement protocol for tennis/golfer\'s elbow with eccentric strengthening focus.',
        'Elbow-Lateral-Medial-Epicondylitis-Repair.docx': 'Tendon repair for chronic epicondylitis with extended protection.',
        'Elbow-Distal-Biceps-Tendon-Repair.docx': 'Distal biceps repair with flexion/supination restrictions and hinged brace progression.',
        'Elbow-Distal-Biceps-Tendon-Reconstruction.docx': 'Chronic distal biceps reconstruction with allograft — extended protection and delayed strengthening.',
        'Elbow-Triceps-Tendon-Repair.docx': 'Triceps repair with active extension restrictions.',
        'Elbow-Ulnar-Collateral-Ligament-UCL-Reconstruction.docx': 'UCL reconstruction (Tommy John) with interval throwing program timeline.',
        'Elbow-Ulnar-Collateral-Ligament-UCL-Repair.docx': 'UCL primary repair with accelerated return vs. reconstruction.',
        'Elbow-Lateral-Ulnar-Collateral-Ligament-LUCL-Reconstruction.docx': 'LUCL reconstruction for posterolateral rotatory instability.',
        'Elbow-Radial-Head-Olecranon-ORIF.docx': 'Elbow fracture fixation emphasizing early motion to prevent stiffness.',
        'Elbow-Interval-Throwing-Program-Phase-I.docx': 'Flat-ground progressive throwing program for return to throwing.',
        'Elbow-Interval-Throwing-Program-Phase-II-Mound.docx': 'Mound throwing program progressing to competitive pitching.',

        'Wrist-Distal-Radius-Fracture-ORIF.docx': 'Wrist fracture fixation rehab with phased ROM and strengthening.',
        'Wrist-Scaphoid-Fracture-Fixation.docx': 'Scaphoid screw fixation with thumb spica immobilization and phased return.',
        'Wrist-Scaphoid-Nonunion-Revision-With-MFC-Free-Flap.docx': 'Scaphoid nonunion revision with medial femoral condyle vascularized bone graft — extended protection and flap monitoring.',
        'Wrist-TFCC-Repair.docx': 'Arthroscopic TFCC repair with forearm rotation restriction and phased progression.',
        'Wrist-Fusion.docx': 'Partial or total wrist fusion rehab protocol.',
        'Wrist-Radial-Shortening-Osteotomy.docx': 'Radial shortening osteotomy for Kienbock\'s disease or ulnar positive variance — osteotomy healing timeline.',
        'Wrist-Ulnar-Shortening-Osteotomy.docx': 'Ulnar shortening osteotomy for ulnar impaction — osteotomy healing and rotation restoration.',
        'Wrist-Ulnar-Shortening-Osteotomy-Wrist-Arthroscopy-TFCC-Repair.docx': 'Combined ulnar shortening osteotomy with arthroscopic TFCC repair — layered protection.',

        'Hand-Carpal-Tunnel-Release.docx': 'Post-operative protocol after carpal tunnel release with grip strengthening progression.',
        'Hand-Cubital-Tunnel-Release.docx': 'Post-operative protocol after ulnar nerve release/transposition at the elbow.',
        'Hand-De-Quervains-Release.docx': 'First dorsal compartment release with early thumb/wrist motion.',
        'Hand-Dupuytrens-Fasciectomy.docx': 'Post-fasciectomy rehab with extension splinting to maintain correction.',
        'Hand-Trigger-Finger-Release.docx': 'Post-operative A1 pulley release with early motion.',
        'Hand-Extensor-Tendon-Repair.docx': 'Zone-specific extensor tendon repair covering mallet through forearm zones.',
        'Hand-Flexor-Tendon-Repair-Direct-Primary-Repair.docx': 'Early protected motion protocol for primary flexor tendon repair with dorsal blocking splint.',
        'Hand-Flexor-Tendon-Reconstruction-Stage-1.docx': 'Stage 1 flexor tendon reconstruction — silicone Hunter rod placement and pulley reconstruction.',
        'Hand-Flexor-Tendon-Reconstruction-Stage-2.docx': 'Stage 2 flexor tendon reconstruction — tendon graft placement with early protected motion.',
        'Hand-Mallet-Finger-Splinting.docx': 'Continuous DIP extension splinting with instructions for maintaining extension.',
        'Hand-Thumb-CMC-Arthroplasty-LRTI.docx': 'Trapeziectomy/LRTI rehab with thumb spica immobilization and pinch strengthening.',
        'Hand-Thumb-CMC-Suspensionplasty.docx': 'Thumb CMC suspensionplasty using suture-button or suture suspension — accelerated progression.',
        'Hand-Thumb-CMC-Touch-Prosthesis.docx': 'Thumb CMC Touch pyrocarbon prosthesis — early motion protocol.',
        'Hand-Hemi-Hamate-Arthroplasty.docx': 'Hemi-hamate autograft for PIP fracture-dislocation with dorsal block and early motion.',
        'Hand-PIP-Fracture-Dislocation-ORIF.docx': 'PIP fracture-dislocation ORIF with dorsal block splint and progressive motion.',
        'Hand-PIP-Fracture-Dislocation-With-Dynamic-External-Fixator.docx': 'PIP fracture-dislocation with dynamic external fixator (Digit Widget) — immediate motion via ligamentotaxis.',
        'Hand-Metacarpal-ORIF-With-Intramedullary-Fixation.docx': 'Metacarpal ORIF with IM fixation — stable fixation allowing early motion.',
        'Hand-Metacarpal-Percutaneous-Pinning.docx': 'Metacarpal percutaneous K-wire fixation with splint until pin removal.',
        'Hand-Phalanx-ORIF-With-Intramedullary-Fixation.docx': 'Phalangeal ORIF with IM fixation — stable fixation permitting early motion.',
        'Hand-Phalangeal-Fracture-Percutaneous-Pinning.docx': 'Phalangeal fracture percutaneous K-wire fixation with splint until pin removal.',
        'Hand-Extensor-Tendon-Centralization.docx': 'Extensor tendon centralization / sagittal band reconstruction with MCP extension splinting.',
        'Hand-Tendon-Transfer-For-Radial-Nerve-Palsy.docx': 'Tendon transfer for radial nerve palsy — restoring wrist, finger, and thumb extension.',
        'Hand-Tendon-Transfer-For-High-Median-Nerve-Palsy.docx': 'Tendon transfer for high median nerve palsy — restoring thumb opposition and flexion.',
        'Hand-Tendon-Transfer-For-Low-Median-Nerve-Palsy.docx': 'Tendon transfer for low median nerve palsy — restoring thumb opposition.',
        'Hand-Tendon-Transfer-For-High-Ulnar-Nerve-Palsy.docx': 'Tendon transfer for high ulnar nerve palsy — intrinsic function, claw correction, and grip.',
        'Hand-Tendon-Transfer-For-Low-Ulnar-Nerve-Palsy.docx': 'Tendon transfer for low ulnar nerve palsy — intrinsic function and claw correction.',
        'Hand-Tendon-Transfer-For-Axillary-Nerve-Palsy.docx': 'Tendon transfer for axillary nerve palsy — restoring shoulder abduction and external rotation.',

        'NonOp-Shoulder-Impingement-Rotator-Cuff-Tendonitis.docx': 'Home exercise program for shoulder impingement with stretching and rotator cuff strengthening.',
        'NonOp-Shoulder-Stiffness-Frozen-Shoulder.docx': 'Home stretching program for adhesive capsulitis with sustained stretching techniques.',
        'NonOp-Tennis-Elbow.docx': 'Eccentric strengthening program for lateral epicondylitis (Tyler Twist, FlexBar).',
        'NonOp-Elbow-Stiffness.docx': 'Low-load prolonged stretching program for elbow stiffness after injury or surgery.',
        'NonOp-Elbow-UCL-Conservative-Treatment.docx': 'Non-operative UCL rehab emphasizing rest, progressive strengthening, and gradual throwing return.',
        'NonOp-Carpal-Tunnel-Nerve-Gliding.docx': 'Nerve gliding program for carpal tunnel syndrome to improve median nerve mobility.',
        'NonOp-Cubital-Tunnel-Nerve-Gliding.docx': 'Nerve gliding program for cubital tunnel syndrome to improve ulnar nerve mobility.',
        'NonOp-Ulnar-Sided-Wrist-Pain.docx': 'Home exercise and activity modification program for ulnar-sided wrist pain including TFCC symptoms.',
        'NonOp-Finger-Stiffness.docx': 'Home exercise program for finger stiffness with progressive ROM and blocking exercises.',
    };
    if (overrides[p.filename]) return overrides[p.filename];
    return `Post-operative rehabilitation protocol for ${prettifyTitle(p.name).toLowerCase().replace(/ protocol$/i, '')}.`;
}

// Build category groups in requested order: Shoulder → Elbow → Wrist → Hand → NonOp
const categoryOrder = ['Shoulder', 'Elbow', 'Wrist', 'Hand', 'NonOp'];
const grouped = {};
categoryOrder.forEach(c => grouped[c] = []);
d.protocols.forEach(p => { grouped[p.bodyPart].push(p); });
categoryOrder.forEach(c => grouped[c].sort((a, b) => a.filename.localeCompare(b.filename)));

const header = `/**
 * Therapy Protocols Configuration
 * ================================
 * Post-operative rehabilitation protocols and non-operative programs.
 * Organized by body region: shoulder, elbow, hand/wrist, non-operative.
 *
 * Categories: shoulder-proto, elbow-proto, hand-proto, nonop
 */

const PROTOCOLS = [
`;

function formatEntry(p) {
    const title = prettifyTitle(p.name);
    const cat = categoryFor(p);
    const desc = shortDescription(p);
    return `    { title: ${JSON.stringify(title)}, category: "${cat}",\n      description: ${JSON.stringify(desc)},\n      file: "therapy-protocols/${p.filename}" },`;
}

const sections = [
    { label: '// --- SHOULDER POSTOPERATIVE PROTOCOLS ---', items: grouped.Shoulder },
    { label: '// --- ELBOW POSTOPERATIVE PROTOCOLS ---', items: grouped.Elbow },
    { label: '// --- WRIST POSTOPERATIVE PROTOCOLS ---', items: grouped.Wrist },
    { label: '// --- HAND & FINGER POSTOPERATIVE PROTOCOLS ---', items: grouped.Hand },
    { label: '// --- NON-OPERATIVE PROGRAMS ---', items: grouped.NonOp },
];

let body = '';
sections.forEach(s => {
    body += `    ${s.label}\n`;
    s.items.forEach(p => { body += formatEntry(p) + '\n'; });
    body += '\n';
});

// Append the 1 kept legacy protocol (Reverse TSA Accelerated)
body += `    // --- LEGACY (retained from prior protocol set) ---\n`;
body += `    { title: "Reverse Total Shoulder Arthroplasty (Accelerated)", category: "shoulder-proto",\n`;
body += `      description: "Accelerated reverse TSA protocol with earlier sling discontinuation for select patients.",\n`;
body += `      file: "therapy-protocols/Shoulder-Reverse-TSA-Accelerated.docx" },\n\n`;

const tail = `];

/**
 * Render protocol cards into the grid
 */
function renderProtocols() {
    const grid = document.getElementById('protocolsGrid');
    if (!grid) return;

    grid.innerHTML = '';

    const tagLabels = {
        'shoulder-proto': 'Shoulder',
        'elbow-proto': 'Elbow',
        'hand-proto': 'Hand, Forearm & Wrist',
        'nonop': 'Non-Operative',
    };

    const tagColors = {
        'shoulder-proto': 'shoulder',
        'elbow-proto': 'elbow',
        'hand-proto': 'hand',
        'nonop': 'therapy',
    };

    PROTOCOLS.forEach(proto => {
        const card = document.createElement('div');
        card.className = 'resource-card';
        card.dataset.category = proto.category;
        card.innerHTML = \`
            <span class="card-tag \${tagColors[proto.category]}">\${tagLabels[proto.category]}</span>
            <h3>\${proto.title}</h3>
            <p>\${proto.description}</p>
            <a href="\${proto.file}" class="card-download" download>
                <i class="fas fa-file-download"></i> Download Protocol
            </a>
        \`;
        grid.appendChild(card);
    });
}

/**
 * Filter protocols by category
 */
function setupProtocolFilter() {
    const buttons = document.querySelectorAll('.filter-btn[data-target="protocolsGrid"]');
    const grid = document.getElementById('protocolsGrid');
    if (!buttons.length || !grid) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const cards = grid.querySelectorAll('.resource-card');
            cards.forEach(card => {
                card.style.display = (filter === 'all' || card.dataset.category === filter) ? '' : 'none';
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderProtocols();
    setupProtocolFilter();
});
`;

const out = header + body + tail;
fs.writeFileSync(path.join(__dirname, 'js', 'protocols.js'), out);
console.log('Wrote js/protocols.js with', d.protocols.length + 1, 'entries');
