/**
 * Affiliation Ticker Configuration
 * =================================
 * EDIT THE ARRAY BELOW ONLY. Nothing else needs to change.
 *
 * The track is rendered TWICE and the CSS animation pans exactly -50%, so the
 * loop seam always lands perfectly no matter how many entries there are.
 * Delete a society, add a training site — the scroll continuity fixes itself.
 *
 *   abbr     — text shown when no image is supplied (or if the image fails)
 *   name     — caption text
 *   src      — OPTIONAL path to a logo image; omit entirely for a text tile
 *   resident — OPTIONAL; shows the * resident-member marker
 *
 * To drop the resident marker everywhere (e.g. after graduating residency),
 * find-and-replace  , resident: true  with nothing.
 */

const AFFILIATIONS = [
    /* --- Training institutions --------------------------------------------
       Drop logo files into images/affiliations/ to replace the text tiles.
       A missing file silently falls back to the abbreviation.               */
    { abbr: 'UIC',   name: 'University of Illinois Chicago — Dept. of Orthopaedic Surgery', src: 'images/affiliations/uic-ortho.png' },
    { abbr: 'OSU',   name: 'The Ohio State University — College of Medicine',               src: 'images/affiliations/osu-com.png' },
    { abbr: 'PITT',  name: 'Pitt Swanson Engineering — Bioengineering',                     src: 'images/affiliations/pitt-swanson-bioe.png' },

    /* --- Professional societies ------------------------------------------- */
    { abbr: 'ASSH',  name: 'American Society for Surgery of the Hand',         resident: true },
    { abbr: 'AAHS',  name: 'American Association for Hand Surgery',            resident: true },
    { abbr: 'AAOS',  name: 'American Academy of Orthopaedic Surgeons',         resident: true },
    { abbr: 'AANA',  name: 'Arthroscopy Association of North America',         resident: true },
    { abbr: 'AOSSM', name: 'American Orthopaedic Society for Sports Medicine', resident: true },
    { abbr: 'ORS',   name: 'Orthopaedic Research Society',                     resident: true },
    { abbr: 'COS',   name: 'Clinical Orthopaedic Society',                     resident: true },
    { abbr: 'IAOS',  name: 'Illinois Association of Orthopaedic Surgeons',     resident: true }
];

(function () {
    function buildTicker() {
        const track = document.getElementById('tickerTrack');
        if (!track) return;

        function tile(a) {
            const d = document.createElement('div');
            d.className = 'tk';
            const visual = a.src
                ? '<img src="' + a.src + '" alt="' + a.abbr + '" ' +
                  'onerror="this.outerHTML=\'<span class=&quot;ab&quot;>' + a.abbr + '</span>\'">'
                : '<span class="ab">' + a.abbr + '</span>';
            d.innerHTML = visual +
                          '<span class="nm">' + a.name + '</span>' +
                          (a.resident ? '<span class="star">&lowast;</span>' : '');
            return d;
        }

        // Rendered twice on purpose — see the note at the top of this file.
        for (let pass = 0; pass < 2; pass++) {
            AFFILIATIONS.forEach(a => track.appendChild(tile(a)));
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildTicker);
    } else {
        buildTicker();
    }
})();
