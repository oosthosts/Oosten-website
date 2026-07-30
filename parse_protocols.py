"""Parse Google Doc JSON export into structured protocol JSON."""
import json
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

SRC = r"C:\Users\James's PC\.claude\projects\C--Users-James-s-PC\94b27b52-42e3-4e66-af0e-ad923c4604e1\tool-results\mcp-d127dbc6-e80c-4637-9cf7-c2e0c41b8f72-read_file_content-1776734055445.txt"
OUT_TXT = r"C:\Users\James's PC\oosten-website\protocols-raw.txt"
OUT_CLEAN = r"C:\Users\James's PC\oosten-website\protocols-cleaned.txt"
OUT_JSON = r"C:\Users\James's PC\oosten-website\protocols-parsed.json"

with open(SRC, 'r', encoding='utf-8') as f:
    data = json.load(f)

content = data['fileContent']
with open(OUT_TXT, 'w', encoding='utf-8') as f:
    f.write(content)

lines_raw = content.split('\n')
cleaned = []
for line in lines_raw:
    s = line.rstrip()
    m = re.match(r'^###\s*\*\*(.*?)\*\*\s*$', s)
    if m:
        s = m.group(1)
    else:
        s = re.sub(r'^###\s*\*?\*?', '', s)
        s = re.sub(r'\*\*\s*$', '', s)
    s = s.replace('\\_', '_').replace('\\*', '*').replace('\\-', '-')
    cleaned.append(s)

cleaned_text = '\n'.join(cleaned)
with open(OUT_CLEAN, 'w', encoding='utf-8') as f:
    f.write(cleaned_text)

sep_re = re.compile(r'^\\?={20,}\s*$')
n = len(cleaned)

def is_sep(i):
    return 0 <= i < n and sep_re.match(cleaned[i].strip()) is not None

sep_lines = [i for i in range(n) if is_sep(i)]

# Find title sandwiches
sandwiches_all = []
for si, sep in enumerate(sep_lines):
    if si + 1 >= len(sep_lines):
        break
    next_sep = sep_lines[si + 1]
    between = cleaned[sep + 1:next_sep]
    non_blank = [(sep + 1 + i, s.strip()) for i, s in enumerate(between) if s.strip()]
    if not non_blank:
        continue
    if len(non_blank) > 2:
        continue
    total = ' '.join(t for _, t in non_blank)
    if len(total) > 200:
        continue
    lower = total.lower()
    # These keywords indicate the text is BODY content not a TITLE.
    if any(k in lower for k in ['name:', 'diagnosis:', 'date of surgery', 'frequency:', 'duration:', 'signature ']):
        continue
    # "weeks 0-" would appear in body; titles don't start with "Weeks N-M"
    if re.match(r'^(weeks|phase)\s+\d', lower):
        continue
    sandwiches_all.append((sep, total, next_sep))

# Filter out section headers
section_header_markers = ['updated rehabilitation', 'additional rehabilitation', 'rehabilitation protocols hue']
protocols_raw = []
for open_s, title, close_s in sandwiches_all:
    t_low = title.lower()
    if any(m in t_low for m in section_header_markers):
        continue
    if title.strip() == '=':
        continue
    protocols_raw.append({'title': title, 'open_line': open_s, 'close_line': close_s})

# For each, body = close_s+1 .. next sandwich open_s (any sandwich, incl. section headers)
sandwich_opens_all = sorted(s[0] for s in sandwiches_all)
for p in protocols_raw:
    cs = p['close_line']
    next_open = n
    for sop in sandwich_opens_all:
        if sop > cs:
            next_open = sop
            break
    body_lines = cleaned[cs + 1:next_open]
    p['body'] = '\n'.join(body_lines).strip()

# Dedupe: the first section (lines 0-1800ish, before "Updated Rehabilitation Protocols — Shoulder")
# is a DRAFT with duplicates. Drop any protocol in the early draft that has a duplicate title later.
# However, FLEXOR TENDON RECONSTRUCTION STAGE 1/2 and PROXIMAL HUMERUS IM NAIL are UNIQUE to the early draft.
def norm_title(t):
    return re.sub(r'\s+', ' ', t).strip().upper()

# Keep the LATER occurrence when duplicate, except prefer the early draft ONLY if no later one exists.
# First find index of the "Updated Rehabilitation Protocols — Shoulder, Elbow, Hand Wrist" section header
# to demarcate "early" vs "canonical".
split_line = n
for i, l in enumerate(cleaned):
    if 'Updated Rehabilitation Protocols' in l and 'Shoulder' in l and 'Elbow' in l:
        split_line = i
        break

# Group protocols by normalized title, keep the one AFTER split_line if any; else the early one.
by_title = {}
for p in protocols_raw:
    key = norm_title(p['title'])
    # Strip "(continued)" suffix so continuations merge with original
    key_base = re.sub(r'\s*\(CONTINUED\)\s*$', '', key).strip()
    by_title.setdefault(key_base, []).append(p)

deduped = []
for key, items in by_title.items():
    # If any item has open_line >= split_line, keep the first such (canonical).
    # Merge "(continued)" body into base body if both exist.
    late = [x for x in items if x['open_line'] >= split_line]
    early = [x for x in items if x['open_line'] < split_line]
    if late:
        # Sort by open_line and concat if multiple (base + continued)
        late_sorted = sorted(late, key=lambda x: x['open_line'])
        chosen = dict(late_sorted[0])
        if len(late_sorted) > 1:
            # Concatenate bodies of continuations
            extra_bodies = [x['body'] for x in late_sorted[1:]]
            chosen['body'] = chosen['body'] + '\n\n' + '\n\n'.join(extra_bodies)
        deduped.append(chosen)
    elif early:
        deduped.append(early[0])

# Additional dedupe: drop generic "PROXIMAL HUMERUS ORIF PROTOCOL" if we have the specific
# 2-3-PART and 4-PART variants (from early section).
titles_up = {norm_title(p['title']): p for p in deduped}
has_2_3_part = any('2- AND 3-PART' in k or '2-AND-3-PART' in k or 'PROXIMAL HUMERUS ORIF PROTOCOL (2' in k for k in titles_up)
has_4_part = any('4-PART' in k and 'INTRAMEDULLARY' not in k for k in titles_up)
if has_2_3_part and has_4_part:
    generic_key = 'PROXIMAL HUMERUS ORIF PROTOCOL'
    if generic_key in titles_up:
        deduped = [p for p in deduped if norm_title(p['title']) != generic_key]

# Drop generic "FLEXOR TENDON REPAIR REHABILITATION PROTOCOL" if we have the
# specific "FLEXOR TENDON REPAIR PROTOCOL — DIRECT PRIMARY REPAIR" variant.
flex_titles = {norm_title(p['title']): p for p in deduped}
if any('DIRECT PRIMARY REPAIR' in k for k in flex_titles):
    generic_flex = 'FLEXOR TENDON REPAIR REHABILITATION PROTOCOL'
    if generic_flex in flex_titles:
        deduped = [p for p in deduped if norm_title(p['title']) != generic_flex]

# Drop generic "MULTIDIRECTIONAL INSTABILITY REPAIR PROTOCOL" if we have "(MDI)" variant
mdi_titles = {norm_title(p['title']): p for p in deduped}
if any('(MDI)' in k for k in mdi_titles):
    generic_mdi = 'MULTIDIRECTIONAL INSTABILITY REPAIR PROTOCOL'
    if generic_mdi in mdi_titles:
        deduped = [p for p in deduped if norm_title(p['title']) != generic_mdi]

# Sort in original doc order
deduped.sort(key=lambda p: p['open_line'])
print(f"\nAfter dedupe: {len(deduped)} unique protocols")

# Build categorization
def categorize(title):
    t = title.upper()
    # Special home-program / NonOp (no-op) ones
    home_nop = [
        'ELBOW STIFFNESS HOME',
        'SHOULDER STIFFNESS',
        'FROZEN SHOULDER',
        'SHOULDER IMPINGEMENT',
        'TENNIS ELBOW (LATERAL EPICONDYLITIS) HOME',
        'CARPAL TUNNEL NERVE GLIDING',
        'CUBITAL TUNNEL NERVE GLIDING',
        'FINGER STIFFNESS HOME',
        'ULNAR-SIDED WRIST PAIN HOME',
    ]
    if any(m in t for m in home_nop):
        return 'NonOp'
    # UCL Conservative
    if 'UCL CONSERVATIVE' in t or 'CONSERVATIVE TREATMENT' in t:
        return 'NonOp'
    # Nerve tendon transfers
    if 'TENDON TRANSFER' in t and ('NERVE' in t or 'MEDIAN' in t or 'ULNAR NERVE' in t or 'RADIAL NERVE' in t or 'AXILLARY' in t):
        # Tendon transfers for nerve palsies live under Nerve? User's existing files put them in Hand/ (Hand-Tendon-Transfer-*.docx)
        return 'Hand'
    # Shoulder keywords
    shoulder_kw = ['LATARJET', 'BANKART', 'SLAP', 'REMPLISSAGE', 'ROTATOR CUFF', 'SUBSCAP',
                   'BICEPS TENODESIS', 'CLAVICLE', 'AC JOINT', 'ACROMIOCLAVICULAR',
                   'STERNOCLAVICULAR', 'SC JOINT', 'SHOULDER', 'HEMIARTHROPLASTY',
                   'TOTAL SHOULDER', 'REVERSE TOTAL', 'SUBACROMIAL DECOMPRESSION',
                   'PROXIMAL HUMERUS', 'PECTORALIS', 'PEC MAJOR', 'PECTORAL',
                   'LOWER TRAPEZIUS', 'MULTIDIRECTIONAL', 'MDI', 'ANATOMIC TOTAL',
                   'CORACOID TRANSFER', 'POSTERIOR SHOULDER', 'ANTERIOR SHOULDER',
                   'MASSIVE ROTATOR', 'INTRAMEDULLARY NAIL']
    elbow_kw = ['UCL', 'EPICONDYLITIS', 'LUCL', 'DISTAL BICEPS', 'TRICEPS', 'RADIAL HEAD',
                'OLECRANON', 'THROWING PROGRAM', 'INTERVAL THROWING', 'ELBOW']
    wrist_kw = ['DISTAL RADIUS', 'WRIST FUSION', 'SCAPHOID', 'TFCC', 'ULNAR SHORTENING',
                'RADIAL SHORTENING', 'WRIST ARTHROSCOPY']
    hand_kw = ['CARPAL TUNNEL RELEASE', 'CUBITAL TUNNEL RELEASE', 'DE QUERVAIN',
               'DUPUYTREN', 'EXTENSOR TENDON', 'FLEXOR TENDON', 'MALLET FINGER',
               'THUMB CMC', 'TRIGGER FINGER', 'PHALANX', 'METACARPAL',
               'PHALANGEAL', 'PIP FRACTURE', 'DIGIT WIDGET', 'HEMI-HAMATE',
               'SAGITTAL BAND', 'EXTENSOR CENTRALIZATION']

    # Check in priority order - shoulder before elbow, etc.
    # Distal biceps goes to elbow
    if 'DISTAL BICEPS' in t:
        return 'Elbow'
    # Pectoralis reconstruction/repair goes to shoulder
    if 'PECTORALIS' in t or 'PEC MAJOR' in t:
        return 'Shoulder'
    if 'BICEPS TENODESIS' in t and 'ROTATOR CUFF' in t:
        return 'Shoulder'
    if 'BICEPS TENODESIS PROTOCOL' == t.strip() or (t.startswith('BICEPS TENODESIS') and 'DISTAL' not in t):
        return 'Shoulder'
    for k in shoulder_kw:
        if k in t:
            return 'Shoulder'
    for k in elbow_kw:
        if k in t:
            return 'Elbow'
    for k in wrist_kw:
        if k in t:
            return 'Wrist'
    for k in hand_kw:
        if k in t:
            return 'Hand'
    return 'Unknown'

# Filename generator matching existing patterns
# Known real acronyms in this domain (kept all-caps)
ACRONYMS = {
    'AC', 'SC', 'SLAP', 'MDI', 'UCL', 'LUCL', 'TFCC', 'ORIF', 'CMC', 'LRTI', 'PIP',
    'DIP', 'MCP', 'IP', 'RCR', 'MFC', 'ACL', 'FDP', 'FDS', 'TSA', 'DRUJ', 'ROM',
    'IM', 'LCL',
}
# Common English words to keep lower-case (prepositions/articles) - but existing files
# seem to Title-Case everything, so we'll Title-Case too.
STOP_WORDS = set()  # keep empty; Title-Case everything

def to_filename(title, body_part):
    t = title
    # Strip em-dashes and en-dashes -> hyphens first so suffix stripping works
    t = t.replace('—', '-').replace('–', '-')
    # Remove the word PROTOCOL anywhere it appears as a standalone word
    t = re.sub(r'\bPROTOCOL\b', '', t, flags=re.I)
    # Remove trailing suffixes
    for _ in range(5):
        new_t = re.sub(r'\s+(REHABILITATION|HOME\s+EXERCISE\s+PROGRAM|HOME\s+PROGRAM|PROGRAM|EXERCISES|PROCEDURE)\s*(?:\([^)]*\))?\s*$', '', t, flags=re.I).strip()
        if new_t == t:
            break
        t = new_t
    # Strip trailing "(4-PART FRACTURES)" style parens AFTER protocol removal
    # Actually keep them for disambiguation — don't strip.
    # Replace slashes and + with hyphens
    t = t.replace('/', '-').replace('+', '-').replace('&', 'and')
    # Remove apostrophes
    t = re.sub(r"['']", '', t)
    # Parentheses: remove non-acronym parens, keep acronym inline, and preserve fracture-pattern info
    def paren_replace(m):
        inner = m.group(1).strip()
        # Single uppercase acronym
        if re.fullmatch(r'[A-Z0-9]{2,6}', inner):
            return ' ' + inner + ' '
        # Fracture-pattern: "4-PART FRACTURES" -> "4-PART"
        fm = re.match(r'(\d[-\d]*-PART)(?:\s+FRACTURES?)?\s*$', inner)
        if fm:
            return ' ' + fm.group(1) + ' '
        # Other parenthetical like (FLAT GROUND), (MOUND), (SAGITTAL BAND RECONSTRUCTION),
        # (LRTI), (ARTHRODESIS), (HUNTER ROD IMPLANTATION), (TENDON GRAFTING), (DIGIT WIDGET)
        # Drop these — the main title already conveys enough info.
        return ' '
    t = re.sub(r'\(([^)]*)\)', paren_replace, t)
    # Collapse multi-spaces
    t = re.sub(r'\s+', ' ', t).strip()
    # Remove stray punctuation
    t = re.sub(r'[,.;:]', '', t)

    # Title case each word
    def titlecase(w):
        if not w:
            return w
        bare = re.sub(r'[^A-Za-z]', '', w)
        if bare.upper() in ACRONYMS:
            return bare.upper()
        # Roman numerals I, II, III at end of phrase
        if re.fullmatch(r'I{1,3}', w):
            return w.upper()
        if '-' in w:
            return '-'.join(titlecase(sub) for sub in w.split('-'))
        return w.capitalize()
    parts = t.split(' ')
    t = ' '.join(titlecase(p) for p in parts)
    # Replace spaces with hyphens
    t = re.sub(r'\s+', '-', t)
    # Collapse multiple hyphens
    t = re.sub(r'-+', '-', t).strip('-')

    # Build filename with body-part prefix, and de-stutter (e.g., Shoulder-Shoulder- -> Shoulder-)
    fn_body = t
    if fn_body.startswith(body_part + '-'):
        fn_body = fn_body[len(body_part) + 1:]
    elif fn_body.upper().startswith(body_part.upper() + '-'):
        fn_body = fn_body[len(body_part) + 1:]

    return f"{body_part}-{fn_body}.docx"

protocols_final = []
for p in deduped:
    bp = categorize(p['title'])
    fn = to_filename(p['title'], bp)
    protocols_final.append({
        'name': p['title'],
        'bodyPart': bp,
        'filename': fn,
        'rawText': p['body'],
    })

# Disambiguate duplicate filenames by appending a differentiator from the original title
seen_fn = {}
for p in protocols_final:
    seen_fn.setdefault(p['filename'], []).append(p)
for fn, plist in seen_fn.items():
    if len(plist) <= 1:
        continue
    # Find distinguishing info inside parens of each original title
    for p in plist:
        m = re.search(r'\(([^)]*)\)', p['name'])
        if m:
            inner = m.group(1).strip()
            # Turn into filename-friendly suffix
            suff = re.sub(r'[^A-Za-z0-9]+', '-', inner).strip('-')
            # Extract the "N-PART" portion if present
            fm = re.search(r'(\d[-\d]*-PART)', suff, re.I)
            if fm:
                suff = fm.group(1).title().replace('Part', 'Part')
            base = p['filename'][:-5]  # drop .docx
            p['filename'] = f"{base}-{suff}.docx"

# Print summary
print(f"\n=== FINAL {len(protocols_final)} PROTOCOLS ===")
from collections import defaultdict
by_bp = defaultdict(list)
for p in protocols_final:
    by_bp[p['bodyPart']].append(p)
for bp in ['Shoulder', 'Elbow', 'Wrist', 'Hand', 'Nerve', 'NonOp', 'Unknown']:
    plist = sorted(by_bp[bp], key=lambda x: x['name'])
    print(f"\n{bp} ({len(plist)}):")
    for p in plist:
        print(f"  - {p['name']}  ->  {p['filename']}")

# Write output
out = {'protocols': protocols_final}
with open(OUT_JSON, 'w', encoding='utf-8') as f:
    json.dump(out, f, indent=2, ensure_ascii=False)
print(f"\nWrote {OUT_JSON}")
