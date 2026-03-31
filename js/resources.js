/**
 * Patient Resources Configuration
 * ================================
 * Add, edit, or remove patient education resources here.
 * Each resource will appear as a card in the Patient Resources section.
 *
 * Categories: shoulder, hand, wrist, elbow, nerve
 *
 * To add a new resource:
 *   1. Add a new object to the RESOURCES array below
 *   2. Set the file path to point to your document in patient-resources/
 *   3. The card will automatically appear on the website
 */

const RESOURCES = [
    // --- SHOULDER ---
    {
        title: "Rotator Cuff Tears",
        category: "shoulder",
        description: "Understanding rotator cuff tears including partial, full-thickness, and massive tears. Symptoms, non-surgical and surgical treatment options.",
        file: "patient-resources/Rotator-Cuff-Tears.docx"
    },
    {
        title: "Shoulder Instability & Labral Tears",
        category: "shoulder",
        description: "Overview of shoulder instability, Bankart lesions, labral tears, and surgical stabilization options including Bankart repair and Latarjet.",
        file: "patient-resources/Shoulder-Instability.docx"
    },
    {
        title: "Shoulder Arthritis & Replacement",
        category: "shoulder",
        description: "Shoulder arthritis types, non-surgical management, and replacement options including anatomic, reverse, and hemiarthroplasty.",
        file: "patient-resources/Shoulder-Arthritis-Replacement.docx"
    },
    {
        title: "Frozen Shoulder (Adhesive Capsulitis)",
        category: "shoulder",
        description: "Understanding frozen shoulder stages (freezing, frozen, thawing), risk factors, and treatment including therapy, injections, and surgical release.",
        file: "patient-resources/Frozen-Shoulder.docx"
    },
    {
        title: "Clavicle (Collarbone) Fractures",
        category: "shoulder",
        description: "Types of clavicle fractures, non-operative vs. surgical treatment (ORIF), and recovery timelines.",
        file: "patient-resources/Clavicle-Fractures.docx"
    },
    {
        title: "AC Joint Injuries",
        category: "shoulder",
        description: "Acromioclavicular joint separation classification (Types I-VI), treatment options, and surgical reconstruction indications.",
        file: "patient-resources/AC-Joint-Injuries.docx"
    },
    {
        title: "Proximal Humerus (Shoulder) Fractures",
        category: "shoulder",
        description: "Upper arm fractures near the shoulder joint: non-operative management, ORIF, and replacement options.",
        file: "patient-resources/Proximal-Humerus-Fractures.docx"
    },
    {
        title: "Biceps Tendon Injuries",
        category: "shoulder",
        description: "Long head biceps tendonitis, SLAP tears, biceps tenodesis, and distal biceps rupture at the elbow.",
        file: "patient-resources/Biceps-Tendon-Injuries.docx"
    },

    // --- HAND & FINGERS ---
    {
        title: "Trigger Finger",
        category: "hand",
        description: "Understanding trigger finger (stenosing tenosynovitis), including symptoms, non-surgical and surgical treatment options, and recovery expectations.",
        file: "patient-resources/Trigger-Finger.docx"
    },
    {
        title: "Flexor Tendon Injury",
        category: "hand",
        description: "Information about flexor tendon injuries of the hand and fingers, surgical repair techniques, and post-operative rehabilitation protocols.",
        file: "patient-resources/Flexor-Tendon-Injury.docx"
    },
    {
        title: "Extensor Tendon Injury",
        category: "hand",
        description: "Guide to extensor tendon injuries including mallet finger, boutonniere deformity, and surgical repair with therapy protocols.",
        file: "patient-resources/Extensor-Tendon-Injury.docx"
    },
    {
        title: "Finger Stiffness & Rehabilitation",
        category: "hand",
        description: "Protocols and exercises for managing finger stiffness after injury or surgery, including range of motion exercises and splinting guidance.",
        file: "patient-resources/Finger-Stiffness-Protocol.docx"
    },
    {
        title: "Dupuytren's Contracture",
        category: "hand",
        description: "Overview of Dupuytren's disease, including when intervention is needed, treatment options such as needle aponeurotomy and fasciectomy, and recovery.",
        file: "patient-resources/Dupuytrens-Contracture.docx"
    },
    {
        title: "De Quervain's Tenosynovitis",
        category: "hand",
        description: "Understanding De Quervain's tendinosis of the wrist and thumb, including diagnosis, splinting, injection therapy, and surgical release.",
        file: "patient-resources/DeQuervains-Tenosynovitis.docx"
    },
    {
        title: "Thumb CMC Arthritis",
        category: "hand",
        description: "Basal joint arthritis of the thumb: symptoms, non-operative management, surgical options including LRTI and trapeziectomy, and recovery.",
        file: "patient-resources/Thumb-CMC-Arthritis.docx"
    },

    // --- WRIST ---
    {
        title: "Distal Radius Fracture (Wrist Fracture)",
        category: "wrist",
        description: "Patient guide to wrist fractures including types, casting vs. surgical fixation, post-operative protocols, and return to activity timelines.",
        file: "patient-resources/Distal-Radius-Fracture.docx"
    },
    {
        title: "Scaphoid Fracture",
        category: "wrist",
        description: "Information about scaphoid bone fractures, the importance of early diagnosis, treatment options, and risk of avascular necrosis.",
        file: "patient-resources/Scaphoid-Fracture.docx"
    },
    {
        title: "Ulnar-Sided Wrist Pain (TFCC Injury)",
        category: "wrist",
        description: "Understanding the triangular fibrocartilage complex (TFCC), causes of ulnar-sided wrist pain, and treatment including arthroscopic repair.",
        file: "patient-resources/TFCC-Injury.docx"
    },
    {
        title: "Wrist Arthritis & Wrist Fusion",
        category: "wrist",
        description: "Overview of wrist arthritis, non-surgical management, partial and total wrist fusion procedures, and post-operative recovery protocols.",
        file: "patient-resources/Wrist-Arthritis-Fusion.docx"
    },
    {
        title: "Ganglion Cyst",
        category: "wrist",
        description: "Information about ganglion cysts of the wrist and hand, including observation, aspiration, and surgical excision options.",
        file: "patient-resources/Ganglion-Cyst.docx"
    },
    {
        title: "Wrist Fracture Rehabilitation Guide",
        category: "wrist",
        description: "General rehabilitation guide for wrist fractures treated non-operatively, including cast care, edema management, and home exercise progressions.",
        file: "patient-resources/Wrist-Fracture-Rehab.docx"
    },

    // --- ELBOW ---
    {
        title: "Elbow Stiffness & Rehabilitation",
        category: "elbow",
        description: "Protocols for managing elbow stiffness after injury or surgery, including stretching exercises, splinting, and when to consider surgical release.",
        file: "patient-resources/Elbow-Stiffness-Protocol.docx"
    },
    {
        title: "Tennis Elbow (Lateral Epicondylitis)",
        category: "elbow",
        description: "Understanding lateral epicondylitis, activity modification, bracing, injection options, and surgical considerations for persistent cases.",
        file: "patient-resources/Tennis-Elbow.docx"
    },
    {
        title: "Elbow Fracture Care",
        category: "elbow",
        description: "Patient guide to common elbow fractures including radial head, olecranon, and distal humerus fractures, with treatment and recovery information.",
        file: "patient-resources/Elbow-Fracture-Care.docx"
    },

    // --- NERVE ---
    {
        title: "Carpal Tunnel Syndrome",
        category: "nerve",
        description: "Comprehensive guide to carpal tunnel syndrome including symptoms, nerve testing, splinting, injection therapy, and carpal tunnel release surgery.",
        file: "patient-resources/Carpal-Tunnel-Syndrome.docx"
    },
    {
        title: "Cubital Tunnel Syndrome",
        category: "nerve",
        description: "Understanding ulnar nerve compression at the elbow, symptoms, activity modifications, and surgical options including in-situ release and transposition.",
        file: "patient-resources/Cubital-Tunnel-Syndrome.docx"
    },
    {
        title: "Nerve Injury & Recovery",
        category: "nerve",
        description: "Overview of peripheral nerve injuries in the upper extremity, nerve repair and grafting techniques, nerve stimulator protocols, and recovery timelines.",
        file: "patient-resources/Nerve-Injury-Recovery.docx"
    },

    // --- GENERAL ---
    {
        title: "Post-Operative Hand Therapy Guide",
        category: "hand",
        description: "General guidelines for hand therapy after surgery, including wound care, edema management, scar management, and when to begin exercises.",
        file: "patient-resources/Post-Op-Hand-Therapy.docx"
    },
];

/**
 * Render resource cards into the grid
 */
function renderResources() {
    const grid = document.getElementById('resourcesGrid');
    if (!grid) return;

    grid.innerHTML = '';

    RESOURCES.forEach(resource => {
        const card = document.createElement('div');
        card.className = 'resource-card';
        card.dataset.category = resource.category;

        const tagLabels = {
            shoulder: 'Shoulder',
            hand: 'Hand & Fingers',
            wrist: 'Wrist',
            elbow: 'Elbow',
            nerve: 'Nerve',
            general: 'General'
        };

        card.innerHTML = `
            <span class="card-tag ${resource.category}">${tagLabels[resource.category] || resource.category}</span>
            <h3>${resource.title}</h3>
            <p>${resource.description}</p>
            <a href="${resource.file}" class="card-download" download>
                <i class="fas fa-file-download"></i> Download
            </a>
        `;

        grid.appendChild(card);
    });
}

/**
 * Filter resources by category
 */
function setupResourceFilter() {
    const buttons = document.querySelectorAll('.filter-btn:not([data-target])');
    const grid = document.getElementById('resourcesGrid');
    if (!buttons.length || !grid) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            // Update active button
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter cards
            const cards = grid.querySelectorAll('.resource-card');
            cards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    renderResources();
    setupResourceFilter();
});
