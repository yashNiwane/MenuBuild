# Restaurant Menu Studio

Restaurant-first menu builder with modern UI/UX and print-ready output.

## UX improvements made

- Restaurant-inspired visual hierarchy with premium typography and elegant hero header.
- Theme presets for common restaurant styles:
  - Royal Gold
  - Earth Clay
  - Midnight Fine-Dine
  - Spice Street
- Cleaner builder controls with live metrics (pages, sections, rows).
- Better editing ergonomics for pages/sections/rows.
- High-quality A4 print preview suitable for PDF export.

## Functional features

- Build menus directly in the interface.
- Import from Excel/CSV row+column data.
- Import/export JSON template model.
- Multi-page support with two-column section rows (left/right items + half/full pricing).

## Run

```bash
python3 -m http.server 4173
```

Open: `http://localhost:4173`

## Excel/CSV columns

- `Page`
- `Section`
- `Item`
- `Half`
- `Full`
- `Item2`
- `Half2`
- `Full2`

Example:

| Page | Section | Item | Half | Full | Item2 | Half2 | Full2 |
|---|---|---|---|---|---|---|---|
| Starters | VEG STARTER | Veg Manchurian Dry | 70/- | 140/- | Paneer Chilli Dry | 100/- | 180/- |
| Starters | VEG STARTER | Veg Crispy | 80/- | 130/- | Mushroom Chilli Dry | 100/- | 140/- |
| Starters | NONVEG STARTER | Chicken Chilli Dry | 100/- | 180/- | Chicken Lollipop | 100/- | 200/- |
