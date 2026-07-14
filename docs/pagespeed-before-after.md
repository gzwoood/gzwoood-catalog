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
