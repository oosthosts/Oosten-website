/**
 * Video Content Configuration
 * ============================
 * Add YouTube videos here. Each video needs:
 *   - youtubeId: The YouTube video ID (the part after v= in the URL)
 *   - title: Display title
 *   - description: Short description
 *
 * Example: For https://www.youtube.com/watch?v=dQw4w9WgXcQ
 *          the youtubeId would be "dQw4w9WgXcQ"
 */

const VIDEOS = [
    // Uncomment and edit the examples below to add your videos:
    //
    // {
    //     youtubeId: "YOUR_VIDEO_ID_HERE",
    //     title: "Understanding Carpal Tunnel Syndrome",
    //     description: "Patient education video explaining carpal tunnel syndrome diagnosis and treatment options."
    // },
    // {
    //     youtubeId: "YOUR_VIDEO_ID_HERE",
    //     title: "Wrist Fracture: What to Expect",
    //     description: "A guide to distal radius fracture treatment and recovery."
    // },
    // {
    //     youtubeId: "YOUR_VIDEO_ID_HERE",
    //     title: "Trigger Finger Release Surgery",
    //     description: "Overview of trigger finger release procedure and post-operative care."
    // },
];

/**
 * Render video cards into the grid
 */
function renderVideos() {
    const grid = document.getElementById('videoGrid');
    if (!grid) return;

    // If no videos configured, show placeholder
    if (VIDEOS.length === 0) {
        grid.innerHTML = `
            <div class="video-placeholder">
                <i class="fas fa-video"></i>
                <p>Video content coming soon.<br>
                Add YouTube video IDs in <code>js/videos.js</code> to populate this section.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = '';

    VIDEOS.forEach(video => {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.innerHTML = `
            <div class="video-embed">
                <iframe
                    src="https://www.youtube.com/embed/${video.youtubeId}"
                    title="${video.title}"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                    loading="lazy">
                </iframe>
            </div>
            <div class="video-info">
                <h3>${video.title}</h3>
                <p>${video.description}</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', renderVideos);
