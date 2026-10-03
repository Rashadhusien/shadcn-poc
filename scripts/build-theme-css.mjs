import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sourcePath = resolve(root, 'src/theme/tokens.json')
const outputPath = resolve(root, 'src/theme/theme.css')
const tokenSource = JSON.parse(await readFile(sourcePath, 'utf8'))

function collectLeaves(source, prefix = '', output = []) {
  for (const [key, value] of Object.entries(source)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (Array.isArray(value)) {
      value.forEach((item, index) => output.push([`${path}.${index}`, item]))
    } else if (value !== null && typeof value === 'object') {
      collectLeaves(value, path, output)
    } else {
      output.push([path, value])
    }
  }
  return output
}

function toVariableName(path) {
  return path
    .replaceAll('.', '-')
    .replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
}

function sourceVariableName(path) {
  return `--dx-token-${toVariableName(path)}`
}

const lines = [
  '/* Generated from tokens.json by scripts/build-theme-css.mjs. Do not edit. */',
  '@custom-variant dark (&:where(.dark, .dark *));',
  '',
  ':root {',
  `  --dx-target-minimum: ${tokenSource.scale.targetMinimum};`,
  '}',
  '',
]

for (const mode of ['light', 'dark']) {
  const selector =
    mode === 'light'
      ? ':root, html[data-theme="light"]'
      : 'html.dark, html[data-theme="dark"]'
  const values = collectLeaves(tokenSource.modes[mode])
  lines.push(`${selector} {`, `  color-scheme: ${mode};`)
  for (const [path, value] of values) {
    lines.push(`  ${sourceVariableName(path)}: ${value};`)
  }
  for (const [name, path] of Object.entries(tokenSource.semanticVariables)) {
    lines.push(`  --dx-${name}: var(${sourceVariableName(path)});`)
  }
  for (const [name, path] of Object.entries(tokenSource.shadcnVariables)) {
    lines.push(`  --${name}: var(${sourceVariableName(path)});`)
  }
  for (
    let index = 0;
    index < tokenSource.modes[mode].charts.length;
    index += 1
  ) {
    lines.push(
      `  --chart-${index + 1}: var(${sourceVariableName(`charts.${index}`)});`,
    )
  }
  lines.push('}', '')
}

lines.push(
  '@theme inline {',
  '  --color-background: var(--background);',
  '  --color-foreground: var(--foreground);',
  '  --color-card: var(--card);',
  '  --color-card-foreground: var(--card-foreground);',
  '  --color-popover: var(--popover);',
  '  --color-popover-foreground: var(--popover-foreground);',
  '  --color-primary: var(--primary);',
  '  --color-primary-foreground: var(--primary-foreground);',
  '  --color-secondary: var(--secondary);',
  '  --color-secondary-foreground: var(--secondary-foreground);',
  '  --color-muted: var(--muted);',
  '  --color-muted-foreground: var(--muted-foreground);',
  '  --color-accent: var(--accent);',
  '  --color-accent-foreground: var(--accent-foreground);',
  '  --color-destructive: var(--destructive);',
  '  --color-destructive-foreground: var(--destructive-foreground);',
  '  --color-surface: var(--dx-token-surface);',
  '  --color-surface-elevated: var(--dx-token-surface-elevated);',
  '  --color-primary-hover: var(--dx-primary-hover);',
  '  --color-primary-tint: var(--dx-primary-tint);',
  '  --color-on-primary: var(--dx-on-primary);',
  '  --color-on-secondary: var(--dx-on-secondary);',
  '  --color-action-hover: var(--dx-action-hover);',
  '  --color-action-selected: var(--dx-action-selected);',
  '  --color-table-header: var(--dx-table-header);',
  '  --color-table-row-hover: var(--dx-table-row-hover);',
  '  --color-table-row-selected: var(--dx-table-row-selected);',
  '  --color-status-success-background: var(--dx-status-success-background);',
  '  --color-status-success-foreground: var(--dx-status-success-foreground);',
  '  --color-status-warning-background: var(--dx-status-warning-background);',
  '  --color-status-warning-foreground: var(--dx-status-warning-foreground);',
  '  --color-status-error-background: var(--dx-status-error-background);',
  '  --color-status-error-foreground: var(--dx-status-error-foreground);',
  '  --color-status-info-background: var(--dx-status-info-background);',
  '  --color-status-info-foreground: var(--dx-status-info-foreground);',
  '  --color-status-neutral-background: var(--dx-status-neutral-background);',
  '  --color-status-neutral-foreground: var(--dx-status-neutral-foreground);',
  '  --color-trend-area: var(--dx-trend-area);',
  '  --color-focus-ring: var(--dx-focus-ring);',
  '  --breakpoint-*: initial;',
  '  --spacing: ' + tokenSource.scale.spacing + ';',
  `  --radius: ${tokenSource.scale.radius};`,
  ...Object.entries(tokenSource.scale.breakpoints).map(
    ([name, value]) => `  --breakpoint-${name}: ${value};`,
  ),
  ...Object.entries(tokenSource.scale.fonts).map(
    ([name, value]) => `  --font-${name}: ${value};`,
  ),
  ...Object.entries(tokenSource.scale.type).flatMap(([name, value]) => [
    `  --text-${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}: ${value.size};`,
    `  --text-${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}--line-height: ${value.lineHeight};`,
  ]),
  '  --color-border: var(--border);',
  '  --color-input: var(--input);',
  '  --color-ring: var(--ring);',
  ...Object.keys(tokenSource.semanticVariables).map(
    (name) => `  --color-${name}: var(--dx-${name});`,
  ),
  ...Array.from(
    { length: 9 },
    (_, index) => `  --color-chart-${index + 1}: var(--chart-${index + 1});`,
  ),
  '  --color-chart-6: var(--chart-6);',
  '  --color-chart-7: var(--chart-7);',
  '  --color-chart-8: var(--chart-8);',
  '  --color-chart-9: var(--chart-9);',
  '  --color-sidebar: var(--sidebar);',
  '  --color-sidebar-foreground: var(--sidebar-foreground);',
  '  --color-sidebar-border: var(--sidebar-border);',
  '  --color-sidebar-primary: var(--sidebar-primary);',
  '  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);',
  '  --color-sidebar-accent: var(--sidebar-accent);',
  '  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);',
  '  --color-sidebar-ring: var(--sidebar-ring);',
  '  --radius-sm: calc(var(--radius) - 4px);',
  '  --radius-md: calc(var(--radius) - 2px);',
  '  --radius-lg: var(--radius);',
  '  --radius-xl: calc(var(--radius) + 4px);',
  '}',
  '',
)

await writeFile(outputPath, lines.join('\n'))
console.log(`Generated ${outputPath}`)
