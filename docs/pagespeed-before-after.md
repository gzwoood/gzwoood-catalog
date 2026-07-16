# Mobile Lighthouse comparison

Tested locally on 2026-07-14 with Lighthouse 12.8.2 mobile defaults. Both versions were served from the same local static server configuration. Each performance result is the median of three runs.

| Metric | Baseline (`main`) | Performance branch | Change |
| --- | ---: | ---: | ---: |
| Performance score | 76 | 82 | +6 |
| First Contentful Paint | 1.60 s | 1.76 s | +0.16 s |
| Largest Contentful Paint | 6.91 s | 4.66 s | -2.25 s |
| Speed Index | 1.60 s | 1.76 s | +0.16 s |
| Total Blocking Time | 0 ms | 0 ms | no change |
| Cumulative Layout Shift | 0 | 0 | no change |
| Transferred resources | 30,971 KiB | 784 KiB | -97.5% |

Final category checks after the follow-up fixes:

- Accessibility: heading order, form labels, button state, focus visibility, and the reported foreground/background contrast issues were corrected.
- Best Practices: 100 after adding an explicit favicon and eliminating the local 404 console error.
- SEO: 100.

## Notes

- These are controlled local Lighthouse measurements, not live PageSpeed Insights field data.
- The large transfer reduction comes mainly from deferring the 27.7 MB factory video and serving responsive product images.
- LCP improved substantially, but remains the largest mobile performance opportunity. A later phase can evaluate a dedicated mobile hero crop without changing the current composition in this branch.
- FCP and Speed Index varied slightly between runs; the branch does not add render-blocking CSS, JavaScript, or third-party dependencies.

## Phase 2: dedicated blog pages

Phase 2 was tested independently against `main` after the Phase 1 release. Lighthouse 12.8.2 mobile defaults were run three times before and three times after the change; the table uses the median.

| Metric | Phase 2 baseline | Phase 2 branch | Change |
| --- | ---: | ---: | ---: |
| Performance score | 83 | 83 | no change |
| Accessibility | 100 | 100 | no change |
| Best Practices | 100 | 100 | no change |
| SEO | 100 | 100 | no change |
| First Contentful Paint | 1.77 s | 1.61 s | -0.16 s |
| Largest Contentful Paint | 4.51 s | 4.66 s | +0.15 s |
| Speed Index | 1.77 s | 1.61 s | -0.16 s |
| Total Blocking Time | 0 ms | 0 ms | no change |
| Cumulative Layout Shift | 0 | 0 | no change |
| Transferred resources | 783 KiB | 763 KiB | -20 KiB |
| Requests | 18 | 18 | no change |
| DOM elements | 1,040 | 849 | -191 (-18.4%) |

Phase 2 moves five full articles out of hidden homepage modals and into dedicated static URLs. The homepage keeps the same six visible article cards, while its HTML decreases from 138,749 to 117,569 bytes (-15.3%). The LCP result varied between runs (4.28–4.73 s after the change), so Phase 2 does not claim an LCP improvement; its measured benefit is lower parsing/DOM cost and clearer indexable article structure.

## Phase 5: accessibility and SEO completion

Phase 5 was tested locally on 2026-07-16 with Lighthouse 12.8.2 mobile defaults. Three complete Lighthouse runs were performed; the table reports the median rather than the highest result.

| Metric | Phase 5 median |
| --- | ---: |
| Performance score | 89 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |
| First Contentful Paint | 1.67 s |
| Largest Contentful Paint | 2.85 s |
| Speed Index | 1.67 s |
| Total Blocking Time | 268 ms |
| Cumulative Layout Shift | 0 |
| Transferred resources | 356 KiB |
| Requests | 15 |
| DOM elements | 850 |

The three performance scores were 88, 96 and 89, showing substantial local runtime variance even though Phase 5 does not change rendering assets or application JavaScript. Accessibility, Best Practices and SEO scored 100 in all three runs. Phase 5 adds the homepage canonical URL, replaces the external Open Graph image with a first-party image, improves search and FAQ semantics, secures new-window social links, and aligns sitemap video URLs with the video actually used on the page.
