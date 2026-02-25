# Restaurant Menu Studio

Restaurant-first menu builder with modern royal UI/UX, section photos, and print-ready output.

## What you can do

- Create restaurant menus from direct editing.
- Import menu data from Excel/CSV row + column structure.
- Add **section images** (dish photos) so menu looks like professional posters.
- Use theme presets:
  - Royal Gold
  - Earth Clay
  - Midnight Fine-Dine
  - Spice Street
- Import/export full JSON templates.
- Print to A4/PDF with WYSIWYG preview.

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
- `SectionImages` (comma-separated URLs)

Example:

| Page | Section | Item | Half | Full | Item2 | Half2 | Full2 | SectionImages |
|---|---|---|---|---|---|---|---|---|
| Main Course | CHICKEN MAIN COURSE | Chicken Masala | 169/- | - | Chicken Kadai | 279/- | - | https://img1.jpg, https://img2.jpg |
| Main Course | MUTTON MAIN COURSE | Mutton Curry | 249/- | - | Mutton Malwani (H/F) | 449/- | 699/- | https://img3.jpg |
