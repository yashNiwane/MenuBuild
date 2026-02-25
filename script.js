const $ = (id) => document.getElementById(id);

const editor = $('editor');
const previewPages = $('previewPages');
const pageTemplate = $('pageTemplate');
const sectionTemplate = $('sectionTemplate');
const rowTemplate = $('rowTemplate');

const brandName = $('brandName');
const tagline = $('tagline');
const footerText = $('footerText');
const themePreset = $('themePreset');
const bgColor = $('bgColor');
const headerColor = $('headerColor');
const textColor = $('textColor');

const fileInput = $('fileInput');
const jsonInput = $('jsonInput');
const loadJsonBtn = $('loadJsonBtn');
const exportJsonBtn = $('exportJsonBtn');
const addPageBtn = $('addPageBtn');
const printBtn = $('printBtn');

const metricPages = $('metricPages');
const metricSections = $('metricSections');
const metricRows = $('metricRows');
const statusText = $('statusText');

const PRESET_THEMES = {
  royal: { bgColor: '#f2c94c', headerColor: '#5b2f22', textColor: '#1f1f1f' },
  earth: { bgColor: '#e8c39e', headerColor: '#6b3f2b', textColor: '#2d221e' },
  night: { bgColor: '#1f2937', headerColor: '#7c3aed', textColor: '#f8fafc' },
  spice: { bgColor: '#f97316', headerColor: '#7f1d1d', textColor: '#fff7ed' }
};

const SAMPLE_MODEL = {
  brandName: 'Aditya Champaran Hotel',
  tagline: 'Authentic Taste • Premium Dining',
  footerText: 'Add.: Godown Chowk, Pune-Nashik Road, Moshi, Pune - 412105 • Mob.: 8788520895',
  themePreset: 'royal',
  theme: PRESET_THEMES.royal,
  pages: [
    {
      title: 'Main Course',
      sections: [
        {
          name: 'Chicken Main Course',
          images: [
            'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=500&q=60',
            'https://images.unsplash.com/photo-1604908176997-43192fe862cd?auto=format&fit=crop&w=500&q=60',
            'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=60'
          ],
          rows: [
            { item: 'Chicken Masala', half: '169/-', full: '-', item2: 'Chicken Kadai', half2: '279/-', full2: '-' },
            { item: 'Chicken Fry', half: '169/-', full: '-', item2: 'Butter Chicken (H/F)', half2: '250/-', full2: '450/-' }
          ]
        },
        {
          name: 'Mutton Main Course',
          images: [
            'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=500&q=60',
            'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=500&q=60'
          ],
          rows: [
            { item: 'Mutton Handi H/F', half: '399/-', full: '679/-', item2: 'Mutton Kolhapuri', half2: '249/-', full2: '-' },
            { item: 'Mutton Curry', half: '249/-', full: '-', item2: 'Mutton Malwani (H/F)', half2: '449/-', full2: '699/-' }
          ]
        }
      ]
    }
  ]
};

function parseImageList(value = '') {
  return String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function cloneRow(row = {}) {
  return {
    item: row.item || '',
    half: row.half || '',
    full: row.full || '',
    item2: row.item2 || '',
    half2: row.half2 || '',
    full2: row.full2 || ''
  };
}

function addRow(tbody, row = {}) {
  const tr = rowTemplate.content.firstElementChild.cloneNode(true);
  tr.querySelector('.item').value = row.item || '';
  tr.querySelector('.half').value = row.half || '';
  tr.querySelector('.full').value = row.full || '';
  tr.querySelector('.item2').value = row.item2 || '';
  tr.querySelector('.half2').value = row.half2 || '';
  tr.querySelector('.full2').value = row.full2 || '';

  tr.addEventListener('input', renderPreview);
  tr.querySelector('.remove-row').addEventListener('click', () => {
    tr.remove();
    renderPreview();
  });

  tbody.appendChild(tr);
}

function addSection(container, section = { name: '', images: [], rows: [] }) {
  const sectionEl = sectionTemplate.content.firstElementChild.cloneNode(true);
  sectionEl.querySelector('.section-name').value = section.name || '';
  sectionEl.querySelector('.section-images').value = (section.images || []).join(', ');
  const tbody = sectionEl.querySelector('tbody');

  if (section.rows?.length) {
    section.rows.forEach((row) => addRow(tbody, row));
  } else {
    addRow(tbody, cloneRow());
  }

  sectionEl.querySelector('.section-name').addEventListener('input', renderPreview);
  sectionEl.querySelector('.section-images').addEventListener('input', renderPreview);
  sectionEl.querySelector('.add-row').addEventListener('click', () => {
    addRow(tbody, cloneRow());
    renderPreview();
  });
  sectionEl.querySelector('.remove-section').addEventListener('click', () => {
    sectionEl.remove();
    renderPreview();
  });

  container.appendChild(sectionEl);
}

function addPage(page = { title: '', sections: [] }) {
  const pageEl = pageTemplate.content.firstElementChild.cloneNode(true);
  pageEl.querySelector('.page-title').value = page.title || '';
  const sectionsContainer = pageEl.querySelector('.sections');

  if (page.sections?.length) {
    page.sections.forEach((section) => addSection(sectionsContainer, section));
  } else {
    addSection(sectionsContainer);
  }

  pageEl.querySelector('.page-title').addEventListener('input', renderPreview);
  pageEl.querySelector('.add-section').addEventListener('click', () => {
    addSection(sectionsContainer);
    renderPreview();
  });
  pageEl.querySelector('.remove-page').addEventListener('click', () => {
    pageEl.remove();
    renderPreview();
  });

  editor.appendChild(pageEl);
}

function buildModelFromEditor() {
  const pages = Array.from(editor.querySelectorAll('.editor-page')).map((pageEl) => {
    const sections = Array.from(pageEl.querySelectorAll('.editor-section')).map((sectionEl) => {
      const rows = Array.from(sectionEl.querySelectorAll('tbody tr')).map((tr) => ({
        item: tr.querySelector('.item').value.trim(),
        half: tr.querySelector('.half').value.trim(),
        full: tr.querySelector('.full').value.trim(),
        item2: tr.querySelector('.item2').value.trim(),
        half2: tr.querySelector('.half2').value.trim(),
        full2: tr.querySelector('.full2').value.trim()
      }));

      return {
        name: sectionEl.querySelector('.section-name').value.trim() || 'Untitled Section',
        images: parseImageList(sectionEl.querySelector('.section-images').value),
        rows
      };
    });

    return {
      title: pageEl.querySelector('.page-title').value.trim(),
      sections
    };
  });

  return {
    brandName: brandName.value.trim(),
    tagline: tagline.value.trim(),
    footerText: footerText.value.trim(),
    themePreset: themePreset.value,
    theme: {
      bgColor: bgColor.value,
      headerColor: headerColor.value,
      textColor: textColor.value
    },
    pages
  };
}

function renderPreview() {
  const model = buildModelFromEditor();
  document.documentElement.style.setProperty('--menu-bg', model.theme.bgColor);
  document.documentElement.style.setProperty('--menu-header', model.theme.headerColor);
  document.documentElement.style.setProperty('--menu-text', model.theme.textColor);

  const sectionCount = model.pages.reduce((acc, page) => acc + page.sections.length, 0);
  const rowCount = model.pages.reduce((acc, page) => acc + page.sections.reduce((a, sec) => a + sec.rows.length, 0), 0);
  metricPages.textContent = String(model.pages.length);
  metricSections.textContent = String(sectionCount);
  metricRows.textContent = String(rowCount);
  statusText.textContent = `Updated ${new Date().toLocaleTimeString()}`;

  previewPages.innerHTML = '';

  model.pages.forEach((page, pageIndex) => {
    const pageEl = document.createElement('article');
    pageEl.className = 'menu-page';

    const brand = document.createElement('h1');
    brand.className = 'menu-brand';
    brand.textContent = model.brandName || 'Restaurant Name';
    pageEl.appendChild(brand);

    if (model.tagline) {
      const line = document.createElement('p');
      line.className = 'menu-tagline';
      line.textContent = model.tagline;
      pageEl.appendChild(line);
    }

    if (page.title) {
      const pageTitle = document.createElement('h2');
      pageTitle.className = 'menu-page-title';
      pageTitle.textContent = page.title;
      pageEl.appendChild(pageTitle);
    }

    page.sections.forEach((section) => {
      const sectionEl = document.createElement('section');
      sectionEl.className = 'menu-section';

      const header = document.createElement('header');
      header.className = 'section-header';
      [section.name, 'HALF', 'FULL', '', 'HALF', 'FULL'].forEach((text) => {
        const span = document.createElement('span');
        span.textContent = text;
        header.appendChild(span);
      });
      sectionEl.appendChild(header);

      const sectionBody = document.createElement('div');
      sectionBody.className = 'section-body';

      const body = document.createElement('div');
      body.className = 'section-rows';

      section.rows.forEach((row) => {
        const values = [
          row.item ? `• ${row.item}` : '•',
          row.half || '-',
          row.full || '-',
          row.item2 ? `• ${row.item2}` : '•',
          row.half2 || '-',
          row.full2 || '-'
        ];

        values.forEach((value, idx) => {
          const cell = document.createElement('div');
          cell.className = idx % 3 === 0 ? 'cell item' : 'cell price';
          cell.textContent = value;
          body.appendChild(cell);
        });
      });

      sectionBody.appendChild(body);

      if (section.images?.length) {
        const gallery = document.createElement('aside');
        gallery.className = 'section-gallery';

        section.images.slice(0, 6).forEach((url) => {
          const img = document.createElement('img');
          img.src = url;
          img.alt = `${section.name} dish`;
          img.loading = 'lazy';
          gallery.appendChild(img);
        });

        sectionBody.appendChild(gallery);
      }

      sectionEl.appendChild(sectionBody);
      pageEl.appendChild(sectionEl);
    });

    const footer = document.createElement('footer');
    footer.className = 'menu-footer';
    footer.textContent = model.footerText || '';
    pageEl.appendChild(footer);

    if (pageIndex < model.pages.length - 1) {
      pageEl.classList.add('page-break-after');
    }

    previewPages.appendChild(pageEl);
  });
}

function clearEditor() {
  editor.innerHTML = '';
}

function loadModel(model) {
  clearEditor();

  brandName.value = model.brandName || '';
  tagline.value = model.tagline || '';
  footerText.value = model.footerText || '';

  const selectedPreset = model.themePreset && PRESET_THEMES[model.themePreset] ? model.themePreset : 'royal';
  themePreset.value = selectedPreset;

  const theme = model.theme || PRESET_THEMES[selectedPreset];
  bgColor.value = theme.bgColor || PRESET_THEMES[selectedPreset].bgColor;
  headerColor.value = theme.headerColor || PRESET_THEMES[selectedPreset].headerColor;
  textColor.value = theme.textColor || PRESET_THEMES[selectedPreset].textColor;

  const pages = Array.isArray(model.pages) && model.pages.length ? model.pages : [{ title: '', sections: [] }];
  pages.forEach((page) => addPage(page));

  renderPreview();
}

function normalizeSheetRows(rows) {
  const pagesMap = new Map();
  const get = (obj, keys) => keys.map((k) => obj[k]).find((v) => v);

  rows.forEach((rawRow) => {
    const row = Object.fromEntries(
      Object.entries(rawRow).map(([key, value]) => [String(key).trim().toLowerCase(), value == null ? '' : String(value).trim()])
    );

    const pageName = get(row, ['page', 'pagename', 'sheet']) || 'Menu';
    const sectionName = get(row, ['section', 'category', 'group']) || 'Imported Section';
    const itemLeft = get(row, ['item', 'leftitem', 'dish']);
    const itemRight = get(row, ['item2', 'rightitem', 'dish2']);
    const imageField = get(row, ['sectionimages', 'images', 'imageurls', 'photos']);

    if (!itemLeft && !itemRight && !imageField) {
      return;
    }

    if (!pagesMap.has(pageName)) {
      pagesMap.set(pageName, new Map());
    }

    const sections = pagesMap.get(pageName);
    if (!sections.has(sectionName)) {
      sections.set(sectionName, { rows: [], images: new Set() });
    }

    const sectionData = sections.get(sectionName);

    parseImageList(imageField).forEach((img) => sectionData.images.add(img));

    if (itemLeft || itemRight) {
      sectionData.rows.push({
        item: itemLeft || '',
        half: get(row, ['half', 'pricehalf', 'leftpricehalf']) || '',
        full: get(row, ['full', 'pricefull', 'leftpricefull']) || '',
        item2: itemRight || '',
        half2: get(row, ['half2', 'pricehalf2', 'rightpricehalf']) || '',
        full2: get(row, ['full2', 'pricefull2', 'rightpricefull']) || ''
      });
    }
  });

  const pages = Array.from(pagesMap.entries()).map(([title, sectionMap]) => ({
    title,
    sections: Array.from(sectionMap.entries()).map(([name, sectionData]) => ({
      name,
      images: Array.from(sectionData.images),
      rows: sectionData.rows
    }))
  }));

  return {
    brandName: brandName.value.trim() || SAMPLE_MODEL.brandName,
    tagline: tagline.value.trim() || SAMPLE_MODEL.tagline,
    footerText: footerText.value.trim() || SAMPLE_MODEL.footerText,
    themePreset: themePreset.value,
    theme: {
      bgColor: bgColor.value,
      headerColor: headerColor.value,
      textColor: textColor.value
    },
    pages: pages.length ? pages : SAMPLE_MODEL.pages
  };
}

function downloadTextFile(name, content) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function applyPreset(presetName) {
  const preset = PRESET_THEMES[presetName];
  if (!preset) {
    return;
  }

  bgColor.value = preset.bgColor;
  headerColor.value = preset.headerColor;
  textColor.value = preset.textColor;
  renderPreview();
  statusText.textContent = `${themePreset.options[themePreset.selectedIndex].text} preset applied`;
}

addPageBtn.addEventListener('click', () => {
  addPage();
  renderPreview();
  statusText.textContent = 'Page added';
});

printBtn.addEventListener('click', () => {
  window.print();
});

themePreset.addEventListener('change', () => {
  applyPreset(themePreset.value);
});

[brandName, tagline, footerText, bgColor, headerColor, textColor].forEach((el) => {
  el.addEventListener('input', renderPreview);
});

loadJsonBtn.addEventListener('click', () => {
  try {
    const parsed = JSON.parse(jsonInput.value);
    if (!parsed || !Array.isArray(parsed.pages)) {
      throw new Error('JSON must contain a pages array');
    }
    loadModel(parsed);
    statusText.textContent = 'JSON loaded';
  } catch (error) {
    alert(`Invalid JSON: ${error.message}`);
  }
});

exportJsonBtn.addEventListener('click', () => {
  const model = buildModelFromEditor();
  jsonInput.value = JSON.stringify(model, null, 2);
  downloadTextFile('menu-model.json', jsonInput.value);
  statusText.textContent = 'JSON exported';
});

fileInput.addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) {
    return;
  }

  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonRows = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });
    const model = normalizeSheetRows(jsonRows);
    loadModel(model);
    statusText.textContent = 'Excel/CSV imported';
  } catch (error) {
    alert(`Could not read file: ${error.message}`);
  } finally {
    fileInput.value = '';
  }
});

loadModel(SAMPLE_MODEL);
