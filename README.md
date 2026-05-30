# TerraLegion Website Builder — React + Craft.js Editor

A drag-and-drop website editor built with React, Craft.js, and Tailwind CSS. Deployed as a compiled bundle to the Rise CRM's `assets/website-builder/` directory.

## Prerequisites

- **Node.js v16+** (npm 7+)
- **Local development machine or CI/CD environment** — the CRM server cannot build (Node.js v12 only)

## Project Structure

```
/terralegion-website-builder/
├── src/
│   ├── main.tsx              # React entry point
│   ├── App.tsx               # Root component
│   ├── Editor.tsx            # Craft.js canvas wrapper
│   ├── Toolbar.tsx           # Save/Publish/Unpublish buttons
│   ├── hooks/
│   │   ├── useBuilderState.ts    # State management from window.TerraLegionBuilder
│   │   └── useAPI.ts            # API client with CSRF handling
│   ├── components/           # Draggable Craft.js tools
│   │   ├── HeroSection.tsx
│   │   ├── FeatureGrid.tsx
│   │   └── TextBlock.tsx
│   └── styles/
│       └── index.css         # Tailwind + editor styles
├── package.json              # Dependencies
├── vite.config.js           # Vite build config (React/ReactDOM externals)
├── tsconfig.json            # TypeScript config
├── tailwind.config.js       # Tailwind CSS config
└── postcss.config.js        # PostCSS with Tailwind
```

## Setup & Development

### 1. Install Dependencies

```bash
cd /home/dh_ynhhse/terralegion-website-builder
npm install
```

### 2. Start Dev Server

```bash
npm run dev
```

Opens a local dev server with HMR. The editor will try to load `window.TerraLegionBuilder` from the page, which won't exist in dev mode. You can mock it in `src/main.tsx` if needed for local testing.

### 3. Build for Production

```bash
npm run build
```

Outputs `app.js` and `styles.css` to `../crm.terralegion.com/assets/website-builder/` (configured in `vite.config.js`).

## Build Configuration Details

### Vite + React Externals

The build declares React 17 and ReactDOM 17 as **external** dependencies — they're not bundled. Instead, they're loaded from unpkg CDN via the CRM view (`app/Views/website_builder/edit.php`):

```html
<script src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
```

This keeps the editor bundle small (~50KB gzip vs ~200KB if bundled).

### Output File Names

Vite outputs:
- `app.js` — the main editor bundle (referenced by the CRM view)
- `styles.css` — compiled Tailwind + editor CSS (optional; loaded if present)

## Architecture

### Entry Point: `window.TerraLegionBuilder`

The CRM view (`app/Views/website_builder/edit.php`) injects a global with all editor state:

```javascript
window.TerraLegionBuilder = {
  clientId: 3,
  clientName: "Acme Corp",
  website: {
    id: 2,
    draft: { title: "Home", sections: [], ... },
    published: { ... },
    deploymentStatus: "draft",
    isLive: false,
    lastPublishedAt: "2026-05-28 23:59:28",
    apiToken: "c7c34b49...",
    ...
  },
  apiEndpoints: {
    getWebsite: "https://crm.terralegion.com/index.php/websitebuilderapi/get_website/3",
    saveWebsite: "...",
    publishWebsite: "...",
    unpublishWebsite: "...",
    rotateToken: "...",
    ...
  },
  csrf: { tokenName: "...", tokenValue: "..." },
  ...
}
```

The editor reads this on mount and manages edits in-memory. Save/Publish buttons POST to the API endpoints.

### State Management: `useBuilderState`

Reads `window.TerraLegionBuilder`, exposes:
- `draft` — current editable state
- `status` — deployment status
- `isLive` — whether site is published
- `updateDraft()` — sync edits
- `refreshState()` — re-fetch from API

### Components: Craft.js Tools

Three draggable components registered as Craft.js tools:

1. **HeroSection** — large banner with title, subtitle, CTA button
2. **FeatureGrid** — 3-column grid of feature cards
3. **TextBlock** — simple paragraph with alignment + font size

Each component:
- Uses `useNode()` hook for Craft.js integration
- Is draggable, droppable, selectable on canvas
- Has `contentEditable` fields for inline editing
- Exposes a `craft` object with default props

### API Integration: `useAPI` + Manual Fetch

Posts to Rise CRM endpoints with CSRF token:

```javascript
const formData = new FormData();
formData.append(csrfTokenName, csrfValue);
formData.append('website_json', JSON.stringify(draft));

fetch(saveEndpoint, { method: 'POST', body: formData });
```

No abstraction layer — direct fetch calls (can be refactored to axios if preferred).

## Deployment

### Build & Deploy

1. **On your local machine or CI/CD**:
   ```bash
   npm run build
   ```

2. **SCP/SFTP the output to the CRM**:
   ```bash
   scp -r dist/* user@crm.terralegion.com:/home/user/crm.terralegion.com/assets/website-builder/
   ```
   Or if already on the same filesystem:
   ```bash
   npm run build  # Already outputs to ../crm.terralegion.com/assets/website-builder/
   ```

3. **Verify in CRM**:
   - Navigate to `/websitebuilder/edit/3` (or any client)
   - Spinner should disappear, editor canvas should load
   - No "Editor bundle not built" notice
   - Drag-and-drop should work

## Testing the Build Locally

If you want to test the bundle in the CRM:

1. Build: `npm run build`
2. SSH to CRM server
3. Clear CRM cache: `rm -rf writable/cache/*`
4. Reload `/websitebuilder/edit/3` in browser

## Files Generated (Post-Build)

```
../crm.terralegion.com/assets/website-builder/
├── app.js          # Main React bundle (~50KB gzip)
└── styles.css      # Tailwind + editor CSS (~10KB gzip)
```

The CRM view picks these up via:
```php
$bundle_js_url = base_url('assets/website-builder/app.js');
<script src="<?php echo $bundle_js_url; ?>?v=<?php echo filemtime($bundle_js_path); ?>"></script>
```

The `?v={mtime}` query param is a cache buster — every deploy invalidates caches automatically.

## Development Notes

### Craft.js Caveats

- `canvas` prop on a component makes it a container (can drop children into it)
- Components without `canvas` are leaves (no children)
- In this MVP, all three components are leaves; multi-section nesting is deferred
- Serialization: call `query.serialize()` in the `onchange` handler to get the current canvas state as JSON

### Tailwind Scoping

Tailwind is included via `@import` directives in `src/styles/index.css`. For production, consider:
- **Current**: Tailwind utilities + editor styles mixed — might leak to CRM chrome if loaded globally
- **Better**: Wrap utilities in `@layer` or use CSS modules to prevent leakage (not yet implemented)

### Error Handling

- If `window.TerraLegionBuilder` is missing, App shows a build-error notice
- API call failures log to console (no retry logic)
- Network errors are not surfaced to the UI (future enhancement)

## Troubleshooting

### "Editor bundle not built" notice appears

The `app.js` file is missing from `assets/website-builder/`. Run `npm run build` locally and copy the output.

### Save/Publish buttons don't work

Check:
- Browser console for errors (likely CORS or API response issues)
- Rise CRM API is returning 200 with `{ success: false, ... }` — check the CRM logs
- CSRF token in `window.TerraLegionBuilder.csrf` is valid (expires with session)

### Drag-and-drop doesn't work

Craft.js might not be initializing. Check:
- No JS errors in browser console
- `window.TerraLegionBuilder` is present
- React dev tools show `<App>` and `<Editor>` components

### Styles are broken / not loading

Check:
- `styles.css` exists in `assets/website-builder/`
- Tailwind CSS is not being purged (check `tailwind.config.js` content glob)
- No CSS specificity conflicts with CRM styles (consider CSS modules for isolation)

## Future Enhancements (Out of Scope for MVP)

- Undo/redo history
- Multi-page / slug support
- Asset uploads (images, videos)
- Custom component library
- Theme tokens / CSS variable editor
- Real-time collaboration
- Component previews in sidebar
- More sophisticated WYSIWYG text editing

## Building CI/CD Pipeline

Example GitHub Actions workflow:

```yaml
name: Build Website Editor
on:
  push:
    branches: [main]
    paths:
      - 'terralegion-website-builder/**'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd terralegion-website-builder && npm install && npm run build
      - uses: webfactory/ssh-agent@v0.7.0
        with:
          ssh-private-key: ${{ secrets.CRM_SSH_KEY }}
      - run: scp -r terralegion-website-builder/dist/* user@crm.terralegion.com:/home/user/crm.terralegion.com/assets/website-builder/
```

## License

Part of the TerraLegion website builder system.
