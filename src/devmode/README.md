# DevMode

Engineer handoff tooling. **Do not refactor without explicit permission.**

## What it does

- Renders a fixed bottom-left toggle button that flips the page into inspection mode
- When active, hovering elements shows a blue outline preview; clicking locks selection
- Right-side panel shows the selected element's component identity, Tailwind classes
  with token mapping, box model, colors with contrast ratios, accessibility info,
  and copy actions (Tailwind / JSX / CSS)

## Why isolated

Multiple times during prototype iteration, sweeping AI prompts caused DevMode
to be removed as collateral damage. Isolating it here:

1. Makes it semantically clear this is tooling, not product code
2. Confines AI cleanups to product folders (src/components/, etc.) by convention
3. Protective markers at the top of each file reinforce the boundary

## What NOT to do

- Don't gate DevMode behind `import.meta.env.DEV` or any environment variable —
  it must render in production deployments so engineers reviewing the deployed
  site can use it
- Don't refactor files out of this folder
- Don't change file APIs without explicit user request

## Entry points

- `DevModeProvider` — wraps the app at App.tsx root
- `DevModeToggle` — fixed bottom-left button; also renders DevModeOverlay + InspectorPanel
- `InspectorPanel` — right-docked panel with element details
- `useDevMode` — hook for any component that needs to read DevMode state

## Import

```ts
import { DevModeProvider, DevModeToggle } from './devmode';
```
