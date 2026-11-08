# LMAD Content Inventory

Complete extraction of everything currently published on **https://lmad.in**, captured so that nothing is lost in the redesign.

Generated: 2026-11-04 · Source: live site crawl (216 pages)

```
216 pages   156,618 words   636 media assets   340.6 MB
```

---

## 1. What exists today

| Collection | Count | Words | Data file |
|---|---:|---:|---|
| **Stories of Change** | 182 | 112,173 | `data/stories.json` |
| **Guest Speakers** | 56 | 12,607 | `data/speakers.json` |
| **Static page copy** | 34 | 27,066 | `data/pages.json` |
| **Core / Working Team** | 30 | 3,956 | `data/core-team.json` |
| **Participant Quotes** | 22 | 816 | `data/participant-quotes.json` |
| **Document archive (PDF)** | 142 | — | `data/documents.json` |
| **Photo albums** | 64 | — | `data/photo-albums.json` |
| **Press clippings** | 105 | — | `data/press-coverage.json` |
| **Events** | 6 | — | `data/events.json` |
| Media asset catalogue | 636 | — | `data/media-assets.json` |
| Homepage structure | — | — | `data/homepage.json` |
| Site-wide config | — | — | `data/site-global.json` |
| Roll-up manifest | — | — | `data/_manifest.json` |

---

## 2. Stories of Change — the single biggest asset

**182 first-person testimonies, 112,173 words, averaging 616 words each.** Every story has its own clean URL (`lmad.in/<name-slug>`) and a portrait photo. All 182 extracted successfully, zero failures.

Each record carries: `slug`, `url`, `name`, `location`, `city`, `region`, `photo`, `signature`, `paragraphs[]`, `wordCount`.

**Geographic spread — 55 cities across 22 regions:**

| Region | Stories | Region | Stories |
|---|---:|---|---:|
| Maharashtra | 93 | Uttar Pradesh | 2 |
| Madhya Pradesh | 27 | Uttarakhand | 2 |
| Jharkhand | 17 | Karnataka | 2 |
| Gujarat | 11 | USA | 2 |
| Odisha | 4 | Chhattisgarh, Rajasthan, Arunachal Pradesh | 1 each |
| West Bengal | 4 | *International:* Kenya, Oman, Nepal, UAE | 1 each |
| Tamil Nadu | 3 | | |

Top cities: Pune (34), Mumbai (20), Jamshedpur (17), Nagpur (14), Katni (14), Indore (10).

> **This dataset directly powers the Interactive SVG India Impact Map.** Every story is already geotagged by city.

**⚠️ Needs normalisation before use as map data:** `Ahmedabad`/`Ahmedebad`, `Solapur`/`Sholapur`, `Bangalore`/`Bengaluru`, `Baroda`/`Vadodara`, `Delhi`/`New Delhi`, `Odisha`/`Orissa`, `Maharashtra`/`Maharashtra.` — plus no lat/long yet.

---

## 3. Guest Speakers — the credibility asset

**56 speakers with full bios (12,607 words) and photos.** This is buried on one 12,826-word page today.

Includes **Dr. A.P.J. Abdul Kalam**, Kiran Bedi, Rajmohan Gandhi, P.C. Sainath, Jadav Payeng ("Forest Man of India"), Anshu Gupta (Goonj), Mittal Patel, Sunil Mathur, Russi Lala, Mrinalini Sarabhai, Ashish Vidyarthi, Atul Kulkarni, Major D.P. Singh, Shital Mahajan, Ritu Biyani.

> **⚠️ Editorial judgement needed:** the list includes serving politicians (Arvind Kejriwal, Sharad Pawar, Supriya Sule). LMAD's core claim is being **100% non-political**. These were guest appearances, not endorsements — presentation on the new site should make that unambiguous.

---

## 4. Document archive — 1996 to 2026

**142 PDFs, 308.3 MB, spanning 29 distinct years.**

| Type | Count |
|---|---:|
| Conference reports | 101 |
| Workshop reports | 16 |
| Newsletters | 10 |
| Youth Surveys | 8 |
| Impact & strategy reports | 7 |

**Documents not currently surfaced anywhere in the navigation:**

- `Impact_Assessment_Report_2025-2026.pdf` (3.4 MB)
- `Impact_Assessment_Report_2024-2025.pdf` (**98.7 MB**)
- `Impact_Assessment_Report_2023-2024.pdf` (8.9 MB)
- `Impact_Assessment_Report_2022-2023.pdf` (9.2 MB)
- `Aspirational_District_Project.pdf` (7.4 MB)
- `Future_of_Lets_Make_A_Difference_Report.pdf` (0.7 MB)
- `Observation_Home_Follow_Up_2023.pdf` (0.2 MB)

> The brief asks for "one-click access to Annual Impact Reports" for donors — **they already exist and are currently invisible.**

**8 years of original Youth Survey data (2013–2022)** is original research nobody is citing.

**Oldest records:** conference reports from **1996, 1997, 1998, 1999–2000** — the institutional memory of a 33-year movement.

---

## 5. Media

| | |
|---|---|
| Total assets | **636** (494 images + 142 documents) |
| Total weight | **340.6 MB** (images 32.3 MB, documents 308.3 MB) |
| Self-hosted | 572 on `lmad.in` |
| **Google Drive dependency** | **64** album thumbnails |
| Formats | JPG 413, PDF 142, PNG 10, JPEG 4, GIF 1 — **no WebP/AVIF** |

Storage folders in use: `stories/` (183), `editor/` (142), `uploads/` (124), `images/` (76), `banners/` (19), `report_pdfs/` (12), `pdfs/` (6), `setting/` (1).

### Homepage media
- **20 hero slider images** (CSS backgrounds, `gallerybanner-01` … `-20`)
- 4 feature-card images
- 1 welcome image — `Zwep2ij5…jpg`, **821 KB unoptimised**
- 6 story carousel portraits, 4 speaker portraits

---

## 6. Homepage structure as built today

1. **Hero slider** — 20 rotating images, *no text overlay, no value proposition*
2. **4 feature cards** — Photo Gallery · Participant Quotes · LMAD Fellowship · Coordinators Way of Life
3. **Welcome** — "Welcome to Let's Make A Difference" + intro copy
4. **Vision** — vision statement + read more
5. **Stories carousel** — 6 stories (Chirag Samtani, Kedar Kiran Ghonsikar, Anurag Maloo, Vaishali Raheja, Nikita Bhagat, Bharat Danao)
6. **Guest speakers strip** — 4 portraits
7. **Donate box** · **Mailchimp newsletter** · **Footer**

> **⚠️ The Welcome and Vision copy is in the DOM but hidden on load** — it is revealed by WOW.js scroll animation and never appears in the rendered text of a first paint. This copy contains LMAD's actual mission statement and the question the brief wants in the hero:
>
> *"What is truly right for me, and how can I bring that change into my life?"*

---

## 7. Site-wide data to carry over

**Organisation:** Let's Make A Difference
**Address:** A-394, 3rd Floor, Defence Colony, New Delhi – 110024, India
**Phone:** +91 84323-21993 (registration) · +91 98104-40054 / +91 93126-04694 (donations)
**Email:** info@lmad.in · viral@mazumdar.biz *(donations — non-org domain, see flags)*

**Social:** [Facebook](https://www.facebook.com/pages/IofC-LMAD/220123374684520) (legacy `/pages/` URL) · [YouTube @lmadproduction](https://www.youtube.com/@lmadproduction) · [Instagram @lmad.youth](https://www.instagram.com/lmad.youth)
**Newsletter:** Mailchimp list `us20 / 21a16dbd132e84d11f6f342a0`
**Banking (80G):** HDFC Bank, Defence Colony Market · A/C 50100708614831 · IFSC HDFC0004113
**Registration:** educational trust under Section 10(23C), Income Tax Act 1961

**Core philosophy content captured in `pages.json`:**
- The 4 Universal Values (full definitions)
- Vision & Objectives — *Discipline through Love · Servant Leadership · Constant Introspection*
- Coordinators' Way of Life — 32 principles across 3 lists
- "Glimpses of Change" — real outcome examples
- Founder's story: movement started **December 1993** by Viral Mazumdar; **20,000+ lives touched**

---

## 8. Migration flags

### 🔴 Broken — content already lost
7 images return **404**, referenced from a previous CMS (`www.lmad.in/cmsfile/`):
- `pressImg12.jpg`, `pressImg15.jpg` → *press-releases*
- `Savera_Camp_09Oct2011_Regional-2/-5/-8.jpg`, `Savera_Camp_08Oct2011_Regional-3.jpg` → *press-releases*
- `regular_smile.gif` → *richa-tiwari* (stray emoji from old editor)

**Originals must be sourced from LMAD's own archives or these are permanently gone.**

### 🔴 Empty / broken pages
- `video-gallery` — **no content**; YouTube API call returns 500 + JS `ReferenceError`
- `home` — no prose in the rendered first paint
- `ecertificate`, `registration/verification` — dynamic Livewire forms, no static content

### 🟠 Stale content
All 4 "Upcoming Events" need replacing — **3 are already in the past** as of Nov 2026:

| Period | Event | Status |
|---|---|---|
| July 2026 | Tamar Youth Conference, 21–25 July | past |
| September 2026 | Pune Workshop, around Ganesh Festival | past |
| October 2026 | 26th Jamshedpur Youth Conference, Kadma, Oct 1–4 | past |
| Dec 2026 – Jan 2027 | December Workshop | upcoming |

The flagship **National Youth Conference (June 1–8)** is not listed at all — though a *National Youth Conference 2026* photo album exists.

The `/events` page still headlines a speaker from **5 June 2017**.

### 🟠 Oversized documents (9 over 5 MB)
`Impact_Assessment_Report_2024-2025.pdf` is **98.65 MB** — effectively unopenable on mobile data. All 9 need compression or conversion to HTML.

### 🟠 Google Drive dependency
All **64** photo album thumbnails load from `drive.google.com`. Any permission or quota change silently breaks the entire gallery. Decide: migrate to own storage/CDN, or keep Drive as the source of truth with a proper sync.

### 🟠 Consent & privacy
182 named individuals with city, portrait photo and deeply personal disclosures (career struggles, family conflict, addiction, bereavement). Under India's **DPDP Act 2023** the rebuild needs a documented consent trail and a self-serve removal path.

---

## 9. Suggested content model for the rebuild

```
Story        slug, name, city, region, lat, lng, year, themes[], photo,
             body, signature, consentStatus, featured
Speaker      slug, name, photo, bio, year(s), affiliation, isPolitical
TeamMember   slug, name, role, isTrustee, photo, bio, order
Document     slug, title, type, year, file, sizeBytes, htmlVersion, city
Album        slug, title, year, type(National|Regional), driveId, cover
Event        slug, title, type, city, venue, startDate, endDate,
             registrationUrl, status, reportId
PressItem    slug, title, publication, date, image, ocrText, conferenceId
Quote        name, quote, storySlug?
City         name, lat, lng, aliases[], storyCount, albumIds[], eventIds[]
```

`City.aliases[]` is what resolves the Ahmedabad/Ahmedebad duplicates for the map.

---

## 10. Content gaps to fill (not on the current site)

1. **The headline numbers** the brief cites — 33+ years, 32 national conferences, 106 regional programs, 35 cities, 300+ global volunteers — are not stated anywhere as structured data. Only "20,000+ lives touched" appears, inside the founder's bio.
2. **No video content** despite an active YouTube channel.
3. **No theme tags** on any story — required for the filterable story explorer.
4. **No coordinator directory by city** — the Parent persona needs a named local contact.
5. **No residential/safety information** — the Parent drawer in the brief has no source content yet.
6. **No day-by-day NYC itinerary** — the "8 Days" scrollytelling timeline has no source content yet.
7. **No lat/long** for any city.
8. **No OCR text** for 105 press clippings — they are images only, invisible to search.
9. **English only** — no Hindi or regional language content exists.
10. **Date/year inconsistency** — footer says © 1995, About Us says since 1993, founder bio says December 1993.

---

## 11. Regenerating this inventory

Extraction scripts are not committed (they are throwaway scrapers against the live site). The JSON in `data/` is the deliverable and is safe to treat as the source of truth for migration.

To re-verify counts: `node -e "const m=require('./data/_manifest.json'); console.log(m.summary)"`
