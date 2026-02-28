## 2024-02-28 - [Memoizing Expensive Filters in ProductsPage]
**Learning:** Found an expensive filtering and sorting operation in `ProductsPage.jsx` operating on every render (including input change keystrokes).
**Action:** Applied `useMemo` to the `filteredProducts` array. Moving forward, look for nested loops or `filter`/`sort` combos chained inside components rather than outside or memoized.