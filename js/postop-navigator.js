/* ============================================================================
   POST-OP CARE NAVIGATOR  v1.0
   ----------------------------------------------------------------------------
   Self-contained. No jQuery, no build step, no external icon library.

   USAGE
     <link rel="stylesheet" href="postop-navigator.css">
     <div data-postop-navigator></div>
     <script src="postop-navigator.js"></script>

   Everything a non-programmer needs to change lives in the CONTENT BLOCK
   below, between the two long ==== rules. Nothing beneath "ENGINE" needs
   editing to change clinical wording.

   PREFIX CONVENTION inside the bullet arrays:
     "+text"  renders a green check   (something you MAY do)
     "-text"  renders a red X         (something you must NOT do)
     "text"   renders a neutral arrow (general guidance)
   Wrap emphasis in <strong>…</strong> — HTML is allowed inside bullets.
   ========================================================================== */
(function () {
  'use strict';

/* ==========================================================================
   ▼▼▼  CONTENT BLOCK — EDIT FREELY BELOW THIS LINE  ▼▼▼
   ========================================================================== */

  var HEADING = {
    title:    'Where are you in your recovery?',
    subtitle: 'Answer two questions for guidance specific to your stage.'
  };

  /* --- Step 1 options. Add/remove entries freely; `id` is referenced in the
         content functions below, so if you add one, add a matching branch. --- */
  var PROCEDURES = [
    { id: 'splint', label: 'Splint or cast',
      hint: 'Fracture fixation, tendon repair, joint fusion, nerve repair, ligament reconstruction' },
    { id: 'soft',   label: 'Soft dressing only',
      hint: 'Carpal tunnel release, trigger finger release, cubital tunnel release, ganglion excision' },
    { id: 'arthro', label: 'Joint replacement',
      hint: 'Shoulder arthroplasty (anatomic, reverse, hemi), elbow arthroplasty' }
  ];

  var DEFAULT_PROCEDURE = 'splint';
  var DEFAULT_DAY       = 2;
  var MAX_DAY           = 42;

  function phaseName(d) {
    if (d <= 2)  return 'Immediate post-op';
    if (d <= 6)  return 'Early protection';
    if (d <= 13) return 'First two weeks';
    if (d <= 27) return 'Wound healed';
    if (d <= 41) return 'Progressive use';
    return 'Return to activity';
  }

  /* ---------- CARD 1 : Dressing & showering ---------- */
  function dressing(proc, d) {
    if (proc === 'arthro') {
      if (d < 7)  return [
        '-Your dressing stays on for <strong>at least one week</strong> — do not remove it',
        '-Do not peek under the dressing to look at the incision',
        'Keep the dressing clean and completely dry',
        'Cover it to shower — a trash bag sealed with Press\'n Seal, or a waterproof sleeve',
        'If it becomes soaked or falls off, call the office'
      ];
      if (d < 14) return [
        'Your dressing is normally removed <strong>by your surgeon at your post-op visit</strong>',
        'Leave it in place until that visit',
        '<strong>If you cannot get to a post-op visit within the first two weeks:</strong> change it to a clean dry dressing yourself and keep the incision covered',
        '-Do not apply creams, ointments, or powders to the incision'
      ];
      return [
        '+Once your surgeon has removed the dressing and cleared you, wash the incision normally with soap and water',
        'Blot dry and apply a clean, dry bandage between washes',
        '-Never submerge the incision — no dishes, baths, pools, or hot tubs'
      ];
    }

    if (proc === 'splint') {
      if (d < 7)  return [
        '-Do not remove the splint for any reason',
        '-Do not get the splint wet',
        'Cover it to shower — a trash bag sealed with Press\'n Seal, or a waterproof cast sleeve',
        'If it feels too tight or your fingers change colour, call immediately'
      ];
      if (d < 14) return [
        'The splint stays on until your surgeon removes it',
        'Once you are cleared out of the splint, at the <strong>one week</strong> mark: if your stitches are dissolvable and <strong>not visible on top of the skin</strong>, you may get the area wet and wash it lightly with soap and water',
        '<strong>Hand incisions:</strong> may be washed lightly with soap and water at the one week mark',
        '-Never submerge the incision — no dishes, baths, pools, or hot tubs'
      ];
      return [
        '+Wash the incision normally with soap and water once cleared',
        'Blot dry and re-cover with a clean, dry bandage between washes',
        '+Submerging is generally fine only once the wound is fully healed and your surgeon has cleared it'
      ];
    }

    /* soft dressing */
    if (d < 1)  return [
      '-Keep the dressing clean, dry, and in place',
      'Minimum 24 hours — longer is better',
      '-Do not peek under the dressing'
    ];
    if (d < 7)  return [
      '+You may remove the dressing any time after 24–48 hours',
      '+Then shower and wash the incision normally with soap and water',
      'Blot dry and apply a clean, dry bandage between showers',
      '-No creams, lotions, salves, ointments, or powders',
      '-Never submerge — no dishes, baths, pools, or hot tubs'
    ];
    if (d < 14) return [
      '+Continue washing the incision normally with soap and water',
      'At the <strong>one week</strong> mark, if your stitches are dissolvable and <strong>not visible on top of the skin</strong>, you may wash the area lightly with soap and water',
      '<strong>Hand incisions:</strong> may be washed lightly at the one week mark',
      '-Never submerge — no dishes, baths, pools, or hot tubs'
    ];
    return [
      '+Wound is sealed — normal washing and bathing',
      'Dry skin, flaking, and firm scar tissue are normal for months',
      'Scar products may be started once fully healed — see the FAQ'
    ];
  }

  /* ---------- CARD 2 : Pain control & medications ---------- */
  function painMeds(proc, d) {
    var ice = [
      '-Do not place ice directly on your fingers',
      '+Place ice on the <strong>hand or wrist</strong> instead — this cools the fingers indirectly',
      '+Ice may be placed over a dressing or splint as long as the bag is well sealed',
      'Even if you feel no cold sensation through the splint, it still helps reduce swelling',
      'Ice 15–20 minutes at a time with a cloth barrier'
    ];
    var elev = [
      'Elevate the hand, forearm, or elbow <strong>above the level of your heart</strong>, including while sleeping',
      'Rest the arm on a pillow overnight',
      '<strong>Hand and forearm surgery:</strong> loosely tape or wrap two pillows together and nest the hand between them to stay propped up overnight'
    ];
    var meds = [
      'Scheduled acetaminophen (Tylenol) — <strong>no more than 4000 mg in 24 hours</strong>, and less if you have any liver disease',
      'Anti-inflammatories if you have no stomach or kidney disorder and have not been told to avoid them',
      'Opioids only after acetaminophen and anti-inflammatories have been tried — take a stool softener alongside',
      '<strong>Opioids are prescribed by one prescriber only.</strong> If you receive them from a pain management or primary care doctor, contact that office for further prescriptions',
      'See the full medication guide below for antibiotics, blood thinners, and cautions'
    ];

    if (d <= 3)  return ice.concat(elev, meds);
    if (d <= 13) return [
      'Continue elevation whenever seated or sleeping',
      '+Ice as needed for swelling, especially after activity'
    ].concat(ice.slice(0, 2), meds.slice(0, 3));
    return [
      'Over-the-counter medication should be sufficient by this stage',
      '+Ice after therapy or heavy use',
      'Incision tenderness commonly lasts around four months — this is normal',
      'Pain that is escalating rather than improving warrants a call'
    ];
  }

  /* ---------- CARD 3 : Activity & work ---------- */
  function activity(proc, d) {
    var driving = [
      '-No driving if you have a splint or sling on either arm',
      '-No driving if you are non-weight-bearing or have range of motion restrictions on the arm',
      '-No driving while taking narcotic pain medication'
    ];
    var work = [
      '+You may return to work on <strong>light duty</strong> if you can perform your job tasks safely with one arm, or with both arms within the restrictions given in your post-op handout',
      'Paperwork must be <strong>faxed to the office ahead of time with a phone call</strong> to let us know it is coming',
      '<strong>Paperwork cannot be completed the day of an appointment without advance notice</strong>'
    ];
    var base = [
      'Lifting and weight-bearing through the operated arm <strong>depend on the type of surgery you had</strong> — follow the patient handout instructions you were given'
    ];

    if (d < 14) return base.concat(driving, work, [
      '+Flying is acceptable beginning 24 hours after surgery',
      'If you travel, bring your operative report and your post-op instructions with you'
    ]);
    return base.concat(driving.slice(0, 2), work, [
      '+Flying is acceptable — bring your operative report and post-op instructions',
      'Grip and arm strength continue improving for several months'
    ]);
  }

  /* ---------- CARD 4 : Therapy ---------- */
  function therapy(proc, d) {
    var lead = 'Formal therapy usually begins at your first post-op visit, but may start before that depending on which procedure you had';
    if (proc === 'splint' || proc === 'arthro') {
      if (d < 14) return [
        lead,
        '+Move any joints left free by the splint',
        'Your specific protocol will be given to you and to your therapist'
      ];
      return [
        'Follow the written protocol for your specific procedure',
        'Attendance matters — stiffness is the most common complication',
        'Bring your protocol sheet to every therapy session',
        'Have your therapist call the office with any questions about the protocol'
      ];
    }
    if (d < 14) return [
      lead,
      '+Begin gentle active motion — full fist to full extension, about 10 repetitions each hour while awake',
      'Formal therapy is often not required after these procedures'
    ];
    return [
      '+Continue active motion and tendon gliding',
      'Begin grip strengthening as comfort allows',
      'Ask about a therapy referral if your motion has plateaued'
    ];
  }

  /* ---------- CARD 5 : What to watch for ---------- */
  function watch(proc, d) {
    var universal = [
      'If your fingers swell and they are <strong>not</strong> inside the bandage, you may loosen the bandage to let blood return from the fingers',
      '-Never rewrap a dressing or splint tighter than it was originally applied',
      'If a splint or sling falls off, replace it and rewrap with an ACE or other elastic bandage',
      'Call for numbness, or colour change with cold-feeling digits (for example turning purple)',
      'Some yellow discolouration or bruising is expected and not concerning on its own',
      '<strong>When in doubt, send a photo to the office or call the after-hours line.</strong> If you cannot reach us and your symptoms are worsening, go to the emergency department'
    ];
    if (d <= 3)  return [
      'Swelling and bruising peak around day 2–3. <strong>This is normal</strong>, and swelling and bruising may continue to worsen or change appearance over the course of weeks to months',
      'Thin pink or clear drainage in the first few days is normal',
      'Fingers should stay warm, pink, and movable'
    ].concat(universal);
    if (d <= 13) return [
      'Swelling and bruising may continue to change appearance over weeks to months — this is expected',
      'Redness confined to the incision edge is expected; redness spreading outward is not',
      'Blue stitches or staples are removed at 10–14 days'
    ].concat(universal);
    return [
      'Dissolvable stitches may still be working their way out',
      'Firm scar tissue and dry flaking skin are normal for months',
      'New redness, drainage, or wound opening warrants a call',
      'Sudden loss of motion after a pop needs urgent evaluation'
    ].concat(universal.slice(3));
  }

  /* --- Card assembly. Reorder or remove rows to change card order. --- */
  function cards(proc, d) {
    return [
      { icon: 'shower',   title: 'Dressing &amp; Showering',        items: dressing(proc, d) },
      { icon: 'pill',     title: 'Pain Control &amp; Medications',  items: painMeds(proc, d) },
      { icon: 'run',      title: 'Activity &amp; Work',             items: activity(proc, d) },
      { icon: 'hand',     title: 'Therapy',                         items: therapy(proc, d)  },
      { icon: 'eye',      title: 'What to Watch For',               items: watch(proc, d), watch: true }
    ];
  }

  /* ---------- Red flags (stage-independent) ---------- */
  var RED_FLAGS_TITLE = 'Call the office immediately if you have any of these';
  var RED_FLAGS_INTRO = 'These apply at every stage of recovery, in a splint or not.';
  var RED_FLAGS = [
    ['Fever above 101.5&deg;F',                     'Especially with chills or feeling generally unwell.'],
    ['Spreading redness or red streaks',            'Redness moving away from the incision, up the arm.'],
    ['Cloudy, yellow, or foul-smelling drainage',   'Thin pink or clear drainage early on is normal. Pus is not.'],
    ['Pain escalating rather than improving',       'Especially pain not controlled by your prescribed medication.'],
    ['Fingers blue, white, cold, or numb',          'May mean the splint or dressing is too tight — a true emergency.'],
    ['New inability to move your fingers',          'Loss of motion you previously had.'],
    ['Wound edges separating',                      'The incision opening rather than sealing.'],
    ['Calf pain, chest pain, shortness of breath',  'Possible blood clot. Call 911 — do not wait.']
  ];
  var ER_NOTE = 'Chest pain or trouble breathing &rarr; call 911. Everything else &rarr; call the office first, before the emergency room.';

  var DISCLAIMER = 'This tool provides general guidance only and does not replace the specific instructions given to you by your surgeon. ' +
                   'Your individual post-operative instructions always take priority over anything shown here.';

/* ==========================================================================
   ▲▲▲  END CONTENT BLOCK — ENGINE BELOW, NO NEED TO EDIT  ▲▲▲
   ========================================================================== */

  var ICONS = {
    shower: 'M12 2a4 4 0 0 0-4 4v3M4 9h16M7 13v.01M12 13v.01M17 13v.01M7 17v.01M12 17v.01M17 17v.01',
    pill:   'M10.5 20.5 3.5 13.5a5 5 0 0 1 7-7l7 7a5 5 0 0 1-7 7zM8.5 8.5l7 7',
    run:    'M13 4a1 1 0 1 0 0-.01M7 21l3-6 4-2 2 4 4 1M6 11l4-3 4 1 2 3',
    hand:   'M7 11V6a1.5 1.5 0 0 1 3 0v5M10 11V4.5a1.5 1.5 0 0 1 3 0V11M13 11V6a1.5 1.5 0 0 1 3 0v7a7 7 0 0 1-7 7 7 7 0 0 1-7-7v-2a1.5 1.5 0 0 1 3 0',
    eye:    'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    flag:   'M12 9v4M12 17v.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z',
    compass:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM16.2 7.8l-2.1 6.3-6.3 2.1 2.1-6.3 6.3-2.1z'
  };

  function svg(name, cls) {
    return '<svg class="' + (cls || 'pon-ico') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
           'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="17" height="17" ' +
           'aria-hidden="true"><path d="' + (ICONS[name] || '') + '"/></svg>';
  }

  function bullets(items) {
    return items.map(function (raw) {
      var cls = '', txt = raw;
      if (raw.charAt(0) === '+') { cls = 'pon-yes'; txt = raw.slice(1); }
      else if (raw.charAt(0) === '-') { cls = 'pon-no'; txt = raw.slice(1); }
      return '<li class="' + cls + '">' + txt + '</li>';
    }).join('');
  }

  function mount(root) {
    var state = { proc: DEFAULT_PROCEDURE, day: DEFAULT_DAY };
    root.classList.add('pon');

    var optHTML = PROCEDURES.map(function (p, i) {
      return '<button type="button" class="pon-opt" data-proc="' + p.id + '" ' +
             'aria-pressed="' + (p.id === DEFAULT_PROCEDURE) + '">' +
             '<strong>' + p.label + '</strong><span>' + p.hint + '</span></button>';
    }).join('');

    root.innerHTML =
      '<div class="pon-shell">' +
        '<div class="pon-head"><h3>' + svg('compass', 'pon-ico') + ' ' + HEADING.title + '</h3>' +
        '<p>' + HEADING.subtitle + '</p></div>' +
        '<div class="pon-body">' +
          '<div class="pon-step"><p class="pon-step-label"><span class="pon-num">1</span> What kind of procedure did you have?</p>' +
            '<div class="pon-opts" role="group">' + optHTML + '</div></div>' +
          '<div class="pon-step"><p class="pon-step-label"><span class="pon-num">2</span> How many days since surgery?</p>' +
            '<div class="pon-slider-wrap">' +
              '<div class="pon-slider-top"><span class="pon-day"></span><span class="pon-phase"></span></div>' +
              '<input type="range" min="0" max="' + MAX_DAY + '" value="' + DEFAULT_DAY + '" step="1" aria-label="Days since surgery">' +
              '<div class="pon-ticks"><span>Surgery</span><span>1 wk</span><span>2 wk</span><span>4 wk</span><span>6 wk</span></div>' +
            '</div></div>' +
          '<div class="pon-results"><div class="pon-grid"></div></div>' +
        '</div>' +
      '</div>' +
      '<div class="pon-redflag"><h3>' + svg('flag') + ' ' + RED_FLAGS_TITLE + '</h3><p>' + RED_FLAGS_INTRO + '</p>' +
        '<div class="pon-rf-grid">' + RED_FLAGS.map(function (f) {
          return '<div class="pon-rf"><strong>' + f[0] + '</strong>' + f[1] + '</div>';
        }).join('') + '</div>' +
        '<div class="pon-er">' + ER_NOTE + '</div></div>' +
      '<p class="pon-disclaimer">' + DISCLAIMER + '</p>';

    var grid   = root.querySelector('.pon-grid');
    var dayEl  = root.querySelector('.pon-day');
    var phEl   = root.querySelector('.pon-phase');
    var slider = root.querySelector('input[type=range]');

    function render() {
      dayEl.textContent = state.day === 0 ? 'Day of surgery' : 'Day ' + state.day;
      phEl.textContent  = phaseName(state.day);
      grid.innerHTML = cards(state.proc, state.day).map(function (c) {
        return '<div class="pon-card' + (c.watch ? ' pon-watch' : '') + '">' +
               '<h4>' + svg(c.icon) + c.title + '</h4><ul>' + bullets(c.items) + '</ul></div>';
      }).join('');
    }

    root.querySelectorAll('.pon-opt').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.proc = btn.dataset.proc;
        root.querySelectorAll('.pon-opt').forEach(function (b) {
          b.setAttribute('aria-pressed', b === btn);
        });
        render();
      });
    });
    slider.addEventListener('input', function () {
      state.day = parseInt(slider.value, 10);
      render();
    });

    render();
    return { render: render, state: state };
  }

  function init() {
    var nodes = document.querySelectorAll('[data-postop-navigator], #postop-navigator');
    nodes.forEach(mount);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.PostOpNavigator = { mount: mount, init: init };
})();
