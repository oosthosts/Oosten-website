/**
 * Site Extras
 * ===========
 * 1. FAQ accordion
 * 2. Live PubMed publication feed
 *
 * Both are self-contained and degrade gracefully if their markup is absent.
 */

/* ---------------------------------------------------------------- FAQ ---- */
(function () {
    function initFaq() {
        document.querySelectorAll('.faq-q').forEach(function (btn) {
            btn.addEventListener('click', function () {
                btn.parentElement.classList.toggle('open');
            });
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFaq);
    } else { initFaq(); }
})();


/* ------------------------------------------------------- PubMed feed ---- */
/**
 * Pulls publications straight from NCBI's public E-utilities API on page load,
 * so a newly indexed paper appears without anyone editing this site.
 *
 * WHY THE QUERY LOOKS LIKE THIS:
 *   Oosten J[Author]                        -> 38 results (32 are Dutch
 *                                              researchers indexed as "van Oosten")
 *   Oosten JD[Author]                       ->  1 result  (too narrow)
 *   the query below                         ->  6 results, verified correct
 *
 * No API key. No credentials. Public read-only endpoints.
 */
(function () {
    var TERM = 'Oosten J[Author] NOT van Oosten[Author] AND 2020:3000[dp]';
    var BASE = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/';

    function init() {
        var feed    = document.getElementById('pubFeed');
        var countEl = document.getElementById('pubCount');
        if (!feed) return;

        function fallback() {
            if (countEl) countEl.textContent = '6';
            feed.innerHTML = '<li class="publication-item">Live feed unavailable — ' +
                             'the curated publication list below remains current.</li>';
        }

        fetch(BASE + 'esearch.fcgi?db=pubmed&retmode=json&retmax=50&sort=date&term=' +
              encodeURIComponent(TERM))
            .then(function (r) { if (!r.ok) throw new Error('esearch failed'); return r.json(); })
            .then(function (j) {
                var ids = j.esearchresult.idlist;
                if (countEl) countEl.textContent = j.esearchresult.count;
                if (!ids.length) {
                    feed.innerHTML = '<li class="publication-item">No indexed publications found.</li>';
                    return;
                }
                return fetch(BASE + 'esummary.fcgi?db=pubmed&retmode=json&id=' + ids.join(','))
                    .then(function (r) { return r.json(); })
                    .then(function (s) {
                        feed.innerHTML = ids.map(function (id) {
                            var d = s.result[id];
                            if (!d) return '';
                            var yr = (d.pubdate || '').split(' ')[0];
                            return '<li class="publication-item">' +
                                   '<span class="pub-year">' + yr + '</span> ' + d.title +
                                   ' <em>' + (d.fulljournalname || d.source || '') + '</em>' +
                                   ' <a href="https://pubmed.ncbi.nlm.nih.gov/' + id +
                                   '/" target="_blank" rel="noopener">PMID ' + id + '</a></li>';
                        }).join('');
                    });
            })
            .catch(fallback);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else { init(); }
})();
