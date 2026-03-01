## 2024-05-18 - Memoized Products Filtering
**Learning:** Extracting formatting strings outside `.filter` and using `useMemo` on derived arrays from large inputs avoids redundant expensive recomputations and allocations in React renders.
**Action:** Look for other large list renderings and apply `useMemo` and extract loop invariants where appropriate.
