/**
 * Therapy Protocols Configuration
 * ================================
 * Post-operative rehabilitation protocols and non-operative programs.
 * Organized by body region: shoulder, elbow, hand/wrist, non-operative.
 *
 * Categories: shoulder-proto, elbow-proto, hand-proto, nonop
 */

const PROTOCOLS = [
    // --- SHOULDER POSTOPERATIVE PROTOCOLS ---
    { title: "Rotator Cuff Repair", category: "shoulder-proto",
      description: "Phase-based rehab protocol following arthroscopic rotator cuff repair, including ROM progression, sling duration, and return-to-sport timelines.",
      file: "therapy-protocols/Shoulder-Rotator-Cuff-Repair.docx" },
    { title: "Massive Rotator Cuff Repair", category: "shoulder-proto",
      description: "Extended protection protocol for massive (multi-tendon) rotator cuff repairs with delayed strengthening milestones.",
      file: "therapy-protocols/Shoulder-Massive-RCR.docx" },
    { title: "Rotator Cuff Repair + Biceps Tenodesis", category: "shoulder-proto",
      description: "Combined rotator cuff repair and biceps tenodesis protocol with additional elbow flexion restrictions.",
      file: "therapy-protocols/Shoulder-RCR-Biceps-Tenodesis.docx" },
    { title: "Rotator Cuff Repair + Subscapularis", category: "shoulder-proto",
      description: "Rotator cuff repair with subscapularis component — additional internal rotation restrictions.",
      file: "therapy-protocols/Shoulder-RCR-Subscap.docx" },
    { title: "Biceps Tenodesis", category: "shoulder-proto",
      description: "Subpectoral or arthroscopic biceps tenodesis protocol with biceps loading restrictions.",
      file: "therapy-protocols/Shoulder-Biceps-Tenodesis.docx" },
    { title: "Anterior Stabilization / Bankart Repair", category: "shoulder-proto",
      description: "Arthroscopic labral repair for anterior instability with external rotation restrictions.",
      file: "therapy-protocols/Shoulder-Bankart-Repair.docx" },
    { title: "Posterior Shoulder Stabilization", category: "shoulder-proto",
      description: "Posterior labral repair protocol with internal rotation and cross-body adduction restrictions.",
      file: "therapy-protocols/Shoulder-Posterior-Stabilization.docx" },
    { title: "Multidirectional Instability Repair", category: "shoulder-proto",
      description: "Capsular plication protocol for multidirectional instability with ROM restrictions in all planes.",
      file: "therapy-protocols/Shoulder-MDI-Repair.docx" },
    { title: "SLAP Repair", category: "shoulder-proto",
      description: "Superior labrum repair protocol with biceps anchor protection restrictions.",
      file: "therapy-protocols/Shoulder-SLAP-Repair.docx" },
    { title: "Latarjet Procedure", category: "shoulder-proto",
      description: "Coracoid transfer protocol for recurrent instability with bone loss — biceps restrictions included.",
      file: "therapy-protocols/Shoulder-Latarjet.docx" },
    { title: "Anatomic Total Shoulder Arthroplasty", category: "shoulder-proto",
      description: "Total shoulder replacement rehab with subscapularis protection and phased ROM/strengthening.",
      file: "therapy-protocols/Shoulder-Total-Arthroplasty.docx" },
    { title: "Reverse Total Shoulder (Standard)", category: "shoulder-proto",
      description: "Standard reverse TSA protocol for cuff-deficient shoulders with deltoid-focused rehab.",
      file: "therapy-protocols/Shoulder-Reverse-TSA-Standard.docx" },
    { title: "Reverse Total Shoulder (Accelerated)", category: "shoulder-proto",
      description: "Accelerated reverse TSA protocol with earlier sling discontinuation.",
      file: "therapy-protocols/Shoulder-Reverse-TSA-Accelerated.docx" },
    { title: "Shoulder Hemiarthroplasty", category: "shoulder-proto",
      description: "Humeral head replacement rehab protocol.",
      file: "therapy-protocols/Shoulder-Hemiarthroplasty.docx" },
    { title: "Subacromial Decompression (+/- DCE)", category: "shoulder-proto",
      description: "Accelerated protocol following arthroscopic subacromial decompression with or without distal clavicle excision.",
      file: "therapy-protocols/Shoulder-Subacromial-Decompression.docx" },
    { title: "Midshaft Clavicle ORIF", category: "shoulder-proto",
      description: "Plate fixation of midshaft clavicle fracture rehab protocol.",
      file: "therapy-protocols/Shoulder-Clavicle-ORIF-Midshaft.docx" },
    { title: "Distal Clavicle ORIF", category: "shoulder-proto",
      description: "Distal clavicle fracture fixation protocol with cross-body adduction restriction.",
      file: "therapy-protocols/Shoulder-Clavicle-ORIF-Distal.docx" },
    { title: "Proximal Humerus ORIF", category: "shoulder-proto",
      description: "Proximal humerus fracture fixation rehab with phased ROM progression.",
      file: "therapy-protocols/Shoulder-Proximal-Humerus-ORIF.docx" },
    { title: "AC Joint Reconstruction", category: "shoulder-proto",
      description: "Acromioclavicular joint reconstruction protocol with extended protection phase.",
      file: "therapy-protocols/Shoulder-AC-Joint-Reconstruction.docx" },
    { title: "SC Joint Reconstruction", category: "shoulder-proto",
      description: "Sternoclavicular joint reconstruction rehab protocol.",
      file: "therapy-protocols/Shoulder-SC-Joint-Reconstruction.docx" },
    { title: "Pectoralis Major Repair", category: "shoulder-proto",
      description: "Pec major tendon repair protocol with horizontal adduction and ER restrictions.",
      file: "therapy-protocols/Shoulder-Pec-Major-Repair.docx" },
    { title: "Lower Trapezius Transfer", category: "shoulder-proto",
      description: "Tendon transfer protocol for irreparable posterosuperior cuff tears.",
      file: "therapy-protocols/Shoulder-Lower-Trap-Transfer.docx" },

    // --- ELBOW POSTOPERATIVE PROTOCOLS ---
    { title: "Lateral/Medial Epicondylitis Debridement", category: "elbow-proto",
      description: "Post-debridement protocol for tennis or golfer's elbow with eccentric strengthening focus.",
      file: "therapy-protocols/Elbow-Epicondylitis-Debridement.docx" },
    { title: "Lateral/Medial Epicondylitis Repair", category: "elbow-proto",
      description: "Tendon repair protocol for chronic epicondylitis with extended protection.",
      file: "therapy-protocols/Elbow-Epicondylitis-Repair.docx" },
    { title: "Distal Biceps Tendon Repair", category: "elbow-proto",
      description: "Distal biceps repair protocol with flexion/supination restrictions and hinged brace progression.",
      file: "therapy-protocols/Elbow-Distal-Biceps-Repair.docx" },
    { title: "Triceps Tendon Repair", category: "elbow-proto",
      description: "Triceps repair protocol with active extension restrictions.",
      file: "therapy-protocols/Elbow-Triceps-Repair.docx" },
    { title: "UCL Reconstruction (Tommy John)", category: "elbow-proto",
      description: "Ulnar collateral ligament reconstruction rehab with interval throwing program timeline.",
      file: "therapy-protocols/Elbow-UCL-Reconstruction.docx" },
    { title: "UCL Repair", category: "elbow-proto",
      description: "UCL primary repair protocol with accelerated return compared to reconstruction.",
      file: "therapy-protocols/Elbow-UCL-Repair.docx" },
    { title: "LUCL Reconstruction", category: "elbow-proto",
      description: "Lateral ulnar collateral ligament reconstruction for posterolateral rotatory instability.",
      file: "therapy-protocols/Elbow-LUCL-Reconstruction.docx" },
    { title: "Radial Head / Olecranon ORIF", category: "elbow-proto",
      description: "Elbow fracture fixation protocol emphasizing early motion to prevent stiffness.",
      file: "therapy-protocols/Elbow-Radial-Head-Olecranon-ORIF.docx" },
    { title: "Interval Throwing Program \u2014 Phase I", category: "elbow-proto",
      description: "Flat-ground progressive throwing program for return to throwing after elbow or shoulder surgery.",
      file: "therapy-protocols/Elbow-Throwing-Program-Phase1.docx" },
    { title: "Interval Throwing Program \u2014 Phase II", category: "elbow-proto",
      description: "Mound throwing program progressing to competitive pitching.",
      file: "therapy-protocols/Elbow-Throwing-Program-Phase2.docx" },

    // --- HAND, FOREARM & WRIST POSTOPERATIVE PROTOCOLS ---
    { title: "Flexor Tendon Repair Protocol", category: "hand-proto",
      description: "Early protected motion protocol for flexor tendon repair with dorsal blocking splint and phased progression.",
      file: "therapy-protocols/Hand-Flexor-Tendon-Repair-Protocol.docx" },
    { title: "Extensor Tendon Repair Protocol", category: "hand-proto",
      description: "Zone-specific extensor tendon repair protocol covering mallet finger through wrist/forearm zones.",
      file: "therapy-protocols/Hand-Extensor-Tendon-Repair-Protocol.docx" },
    { title: "Mallet Finger Splinting Protocol", category: "hand-proto",
      description: "Continuous DIP extension splinting protocol with critical instructions for maintaining extension.",
      file: "therapy-protocols/Hand-Mallet-Finger-Splinting.docx" },
    { title: "Trigger Finger Release Protocol", category: "hand-proto",
      description: "Post-operative protocol after A1 pulley release with early motion.",
      file: "therapy-protocols/Hand-Trigger-Finger-Release-Protocol.docx" },
    { title: "Carpal Tunnel Release Protocol", category: "hand-proto",
      description: "Post-operative protocol after carpal tunnel release with grip strengthening progression.",
      file: "therapy-protocols/Hand-Carpal-Tunnel-Release-Protocol.docx" },
    { title: "Cubital Tunnel Release Protocol", category: "hand-proto",
      description: "Post-operative protocol after ulnar nerve release/transposition at the elbow.",
      file: "therapy-protocols/Hand-Cubital-Tunnel-Release-Protocol.docx" },
    { title: "Distal Radius ORIF Protocol", category: "hand-proto",
      description: "Wrist fracture fixation rehab with phased ROM and strengthening progression.",
      file: "therapy-protocols/Wrist-Distal-Radius-ORIF-Protocol.docx" },
    { title: "TFCC Repair Protocol", category: "hand-proto",
      description: "Arthroscopic TFCC repair rehab with forearm rotation restriction and phased progression.",
      file: "therapy-protocols/Wrist-TFCC-Repair-Protocol.docx" },
    { title: "Scaphoid Fracture Fixation Protocol", category: "hand-proto",
      description: "Scaphoid screw fixation rehab with thumb spica immobilization and phased return.",
      file: "therapy-protocols/Wrist-Scaphoid-Fixation-Protocol.docx" },
    { title: "Wrist Fusion (Arthrodesis) Protocol", category: "hand-proto",
      description: "Partial or total wrist fusion rehab protocol.",
      file: "therapy-protocols/Wrist-Fusion-Protocol.docx" },
    { title: "Thumb CMC Arthroplasty (LRTI) Protocol", category: "hand-proto",
      description: "Trapeziectomy/LRTI rehab protocol with thumb spica immobilization and pinch strengthening.",
      file: "therapy-protocols/Hand-Thumb-CMC-Arthroplasty-Protocol.docx" },
    { title: "Dupuytren's Fasciectomy Protocol", category: "hand-proto",
      description: "Post-fasciectomy rehab with extension splinting to maintain surgical correction.",
      file: "therapy-protocols/Hand-Dupuytrens-Fasciectomy-Protocol.docx" },
    { title: "De Quervain's Release Protocol", category: "hand-proto",
      description: "First dorsal compartment release rehab with early thumb/wrist motion.",
      file: "therapy-protocols/Hand-DeQuervains-Release-Protocol.docx" },
    { title: "Radial Nerve Tendon Transfer Protocol", category: "hand-proto",
      description: "Postoperative rehabilitation protocol following tendon transfer for radial nerve palsy — addresses wrist extension, finger extension, and thumb extension restoration.",
      file: "therapy-protocols/Hand-Tendon-Transfer-Radial-Nerve.docx" },
    { title: "Median Nerve Tendon Transfer Protocol", category: "hand-proto",
      description: "Postoperative rehabilitation protocol following tendon transfer for median nerve palsy — addresses thumb opposition and intrinsic function restoration.",
      file: "therapy-protocols/Hand-Tendon-Transfer-Median-Nerve.docx" },
    { title: "Ulnar Nerve Tendon Transfer Protocol", category: "hand-proto",
      description: "Postoperative rehabilitation protocol following tendon transfer for ulnar nerve palsy — addresses intrinsic muscle function, claw deformity correction, and grip restoration.",
      file: "therapy-protocols/Hand-Tendon-Transfer-Ulnar-Nerve.docx" },

    // --- NON-OPERATIVE PROGRAMS ---
    { title: "Shoulder Impingement & Rotator Cuff Tendonitis", category: "nonop",
      description: "Home exercise program for shoulder impingement with stretching and progressive rotator cuff strengthening.",
      file: "therapy-protocols/NonOp-Shoulder-Impingement.docx" },
    { title: "Frozen Shoulder (Adhesive Capsulitis)", category: "nonop",
      description: "Home stretching program for adhesive capsulitis with sustained stretching techniques.",
      file: "therapy-protocols/NonOp-Frozen-Shoulder.docx" },
    { title: "Tennis Elbow Home Exercise Program", category: "nonop",
      description: "Eccentric strengthening program for lateral epicondylitis including Tyler Twist and FlexBar exercises.",
      file: "therapy-protocols/NonOp-Tennis-Elbow.docx" },
    { title: "Elbow Stiffness Home Exercise Program", category: "nonop",
      description: "Low-load prolonged stretching program for elbow stiffness following injury or surgery.",
      file: "therapy-protocols/NonOp-Elbow-Stiffness-Home.docx" },
    { title: "Carpal Tunnel Nerve Gliding Exercises", category: "nonop",
      description: "Non-operative nerve gliding exercise program for carpal tunnel syndrome to improve median nerve mobility and reduce symptoms.",
      file: "therapy-protocols/NonOp-Nerve-Gliding-Carpal-Tunnel.docx" },
    { title: "Cubital Tunnel Nerve Gliding Exercises", category: "nonop",
      description: "Non-operative nerve gliding exercise program for cubital tunnel syndrome to improve ulnar nerve mobility and reduce symptoms.",
      file: "therapy-protocols/NonOp-Nerve-Gliding-Cubital-Tunnel.docx" },
    { title: "Ulnar-Sided Wrist Pain Program", category: "nonop",
      description: "Non-operative home exercise and activity modification program for ulnar-sided wrist pain including TFCC-related symptoms.",
      file: "therapy-protocols/NonOp-Ulnar-Wrist-Pain.docx" },
    { title: "Finger Stiffness Home Exercise Program", category: "nonop",
      description: "Non-operative home exercise program for finger stiffness with progressive range of motion and blocking exercises.",
      file: "therapy-protocols/NonOp-Finger-Stiffness.docx" },
];

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
        card.innerHTML = `
            <span class="card-tag ${tagColors[proto.category]}">${tagLabels[proto.category]}</span>
            <h3>${proto.title}</h3>
            <p>${proto.description}</p>
            <a href="${proto.file}" class="card-download" download>
                <i class="fas fa-file-download"></i> Download Protocol
            </a>
        `;
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
            // Update active within this group only
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
