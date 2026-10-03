import { readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const sourcePath = resolve(root, 'src/theme/tokens.json')
const reportPath = resolve(root, 'docs/DESIGN_TOKENS.md')
const tokenSource = JSON.parse(await readFile(sourcePath, 'utf8'))
const writeReport = process.argv.includes('--write')

function getPath(source, path) {
  return path.split('.').reduce((value, key) => {
    if (Array.isArray(value)) return value[Number(key)]
    return value?.[key]
  }, source)
}

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

function luminance(hex) {
  if (!/^#[\da-f]{6}$/i.test(hex))
    throw new Error(`Expected six-digit hex color, received: ${hex}`)
  const channels = [1, 3, 5].map(
    (start) => Number.parseInt(hex.slice(start, start + 2), 16) / 255,
  )
  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  )
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

function contrast(foreground, background) {
  const values = [luminance(foreground), luminance(background)].sort(
    (a, b) => b - a,
  )
  return (values[0] + 0.05) / (values[1] + 0.05)
}

function hue(hex) {
  const [red, green, blue] = [1, 3, 5].map(
    (start) => Number.parseInt(hex.slice(start, start + 2), 16) / 255,
  )
  const high = Math.max(red, green, blue)
  const low = Math.min(red, green, blue)
  const delta = high - low
  if (delta === 0) return 0
  let value
  if (high === red) value = ((green - blue) / delta) % 6
  else if (high === green) value = (blue - red) / delta + 2
  else value = (red - green) / delta + 4
  return (value * 60 + 360) % 360
}

function saturation(hex) {
  const channels = [1, 3, 5].map(
    (start) => Number.parseInt(hex.slice(start, start + 2), 16) / 255,
  )
  const high = Math.max(...channels)
  const low = Math.min(...channels)
  const lightness = (high + low) / 2
  const denominator = 1 - Math.abs(2 * lightness - 1)
  return denominator === 0 ? 0 : (high - low) / denominator
}

const pairs = []
function addPair(
  mode,
  category,
  label,
  foregroundPath,
  backgroundPath,
  minimum,
) {
  const palette = tokenSource.modes[mode]
  const foreground = getPath(palette, foregroundPath)
  const background = getPath(palette, backgroundPath)
  pairs.push({
    mode,
    category,
    label,
    foreground,
    background,
    minimum,
    ratio: contrast(foreground, background),
  })
}

for (const mode of ['light', 'dark']) {
  for (const surface of ['background', 'surface', 'surfaceElevated']) {
    for (const text of ['primary', 'secondary', 'disabled']) {
      const threshold = text === 'disabled' ? 3 : 4.5
      addPair(
        mode,
        text === 'primary' ? 'Body text' : 'Supporting text',
        `${text} on ${surface}`,
        `text.${text}`,
        surface,
        threshold,
      )
    }
  }
  addPair(
    mode,
    'Large text',
    'Primary foreground on primary',
    'primary.onColor',
    'primary.main',
    4.5,
  )
  addPair(
    mode,
    'Large text',
    'Secondary foreground on secondary',
    'secondary.foreground',
    'secondary.main',
    4.5,
  )
  addPair(
    mode,
    'Large text',
    'Error foreground on destructive',
    'errorOnColor',
    'error',
    4.5,
  )
  for (const boundary of ['border', 'divider', 'inputBorder']) {
    for (const surface of ['background', 'surface']) {
      addPair(
        mode,
        'UI boundary',
        `${boundary} on ${surface}`,
        boundary,
        surface,
        3,
      )
    }
  }
  for (const surface of [
    'background',
    'surface',
    'surfaceElevated',
    'sidebar.background',
  ]) {
    addPair(
      mode,
      'Focus indicator',
      `focus ring on ${surface}`,
      'focusRing',
      surface,
      3,
    )
  }
  addPair(
    mode,
    'UI boundary',
    'Sidebar border on sidebar',
    'sidebar.border',
    'sidebar.background',
    3,
  )
  for (const status of Object.keys(tokenSource.modes[mode].statusBadges)) {
    addPair(
      mode,
      'Status badge',
      `${status} foreground on badge`,
      `statusBadges.${status}.foreground`,
      `statusBadges.${status}.background`,
      4.5,
    )
  }
  tokenSource.modes[mode].charts.forEach((color, index) => {
    for (const surface of ['background', 'surface', 'surfaceElevated']) {
      addPair(
        mode,
        'Chart color',
        `Chart ${index + 1} on ${surface}`,
        `charts.${index}`,
        surface,
        3,
      )
    }
  })
}

const failed = pairs.filter((pair) => pair.ratio < pair.minimum)
const primaryHue = hue(tokenSource.modes.light.primary.main)
const hueDistance = (first, second) =>
  Math.min(Math.abs(first - second), 360 - Math.abs(first - second))
const hueRows = [
  { label: 'Prior brass proposal', hue: 37 },
  { label: 'Kendo teal reference', hue: 186 },
].map((reference) => ({
  ...reference,
  distance: hueDistance(primaryHue, reference.hue),
}))
const colorTokens = ['light', 'dark'].flatMap((mode) =>
  collectLeaves(tokenSource.modes[mode]).map(([name, value]) => ({
    mode,
    name,
    value,
    saturation: saturation(value),
  })),
)
const mostSaturated = colorTokens.reduce((highest, color) =>
  color.saturation > highest.saturation ? color : highest,
)
const overSaturated = colorTokens.filter((color) => color.saturation > 0.75)

const tokenNames = new Set([
  ...collectLeaves(tokenSource.modes.light).map(([name]) => name),
  ...collectLeaves(tokenSource.modes.dark).map(([name]) => name),
])
const tokenRows = [...tokenNames].sort().map((name) => {
  const humanName = name.startsWith('charts.')
    ? `Chart ${Number(name.split('.')[1]) + 1}`
    : name.replaceAll('.', ' / ')
  return [
    humanName,
    getPath(tokenSource.modes.light, name),
    getPath(tokenSource.modes.dark, name),
  ]
})

const document = [
  '# Diagnostix design tokens',
  '',
  '> Generated by `scripts/contrast.mjs --write` from `src/theme/tokens.json`. Edit the token source, not this report or `src/theme/theme.css`.',
  '',
  '## Direction and hue separation',
  '',
  `Primary is Royal Navy / Opal (${tokenSource.modes.light.primary.main}; HSL hue ${primaryHue.toFixed(1)}°). The light/dark neutrals use cool slate undertones with a dark navy sidebar in both modes. Maximum palette saturation is ${(mostSaturated.saturation * 100).toFixed(1)}% (${mostSaturated.mode} ${mostSaturated.name}); the palette stays below the 75% ceiling. No neon fills or gradients are used.`,
  '',
  '| Reference family | Reference hue | Primary hue | Circular hue distance | Required |',
  '|---|---:|---:|---:|---:|',
  ...hueRows.map(
    (row) =>
      `| ${row.label} | ${row.hue}° | ${primaryHue.toFixed(1)}° | ${row.distance.toFixed(1)}° | ≥35° |`,
  ),
  '',
  '## Semantic color values',
  '',
  '| Token | Light | Dark |',
  '|---|---|---|',
  ...tokenRows.map(([name, light, dark]) => `| ${name} | ${light} | ${dark} |`),
  '',
  '## Contrast audit',
  '',
  'Ratios use the WCAG relative-luminance formula after sRGB linearization. Text, badges, boundaries, focus indicators and all nine chart colors are checked against their semantic surfaces.',
  '',
  '| Mode | Check | Foreground | Background | Ratio | Minimum | Result |',
  '|---|---|---|---|---:|---:|---|',
  ...pairs.map(
    (pair) =>
      `| ${pair.mode} | ${pair.category}: ${pair.label} | ${pair.foreground} | ${pair.background} | ${pair.ratio.toFixed(2)}:1 | ${pair.minimum}:1 | ${pair.ratio >= pair.minimum ? 'Pass' : '**Fail**'} |`,
  ),
  '',
  `Contrast checks: ${pairs.length - failed.length}/${pairs.length} pass.`,
  '',
  '## Scale and theme behavior',
  '',
  `- Type: ${Object.entries(tokenSource.scale.type)
    .map(([name, value]) => `${name} ${value.size}/${value.lineHeight}`)
    .join('; ')}.`,
  `- Spacing base: ${tokenSource.scale.spacing}; responsive breakpoints: ${Object.entries(
    tokenSource.scale.breakpoints,
  )
    .map(([name, value]) => `${name} ${value}`)
    .join(', ')}; minimum touch target: ${tokenSource.scale.targetMinimum}.`,
  `- Radius: ${tokenSource.scale.radius}. Fonts: ${tokenSource.scale.fonts.sans}; mono: ${tokenSource.scale.fonts.mono}. Fonts are bundled locally under their package licenses.`,
  '- Light, dark and system preference is stored under `app-theme`; `.dark` and `data-theme` are applied to `<html>` so portaled content inherits the active palette.',
  '',
]
const report = document.join('\n')

if (writeReport) {
  await writeFile(reportPath, report)
  console.log(`Wrote ${reportPath}`)
} else {
  const existing = await readFile(reportPath, 'utf8').catch(() => '')
  if (existing !== report) {
    console.error(
      'Design token report is stale. Run `npm run contrast -- --write` and review docs/DESIGN_TOKENS.md.',
    )
    process.exitCode = 1
  }
}

if (hueRows.some((row) => row.distance < 35)) {
  console.error(
    'Primary hue must remain at least 35 degrees from both reference hue families.',
  )
  process.exitCode = 1
}

if (overSaturated.length > 0) {
  console.error(
    `Palette fills must stay at or below 75% HSL saturation: ${overSaturated.map((color) => `${color.mode} ${color.name} (${(color.saturation * 100).toFixed(1)}%)`).join(', ')}`,
  )
  process.exitCode = 1
}

if (failed.length > 0) {
  console.error(`${failed.length} contrast checks failed:`)
  for (const pair of failed) {
    console.error(
      `${pair.mode} / ${pair.label}: ${pair.ratio.toFixed(2)}:1; required ${pair.minimum}:1`,
    )
  }
  process.exitCode = 1
} else {
  console.log(
    `Contrast passed: ${pairs.length} pairs; primary hue ${primaryHue.toFixed(1)}°; distances ${hueRows.map((row) => row.distance.toFixed(1)).join('° / ')}°; max saturation ${(mostSaturated.saturation * 100).toFixed(1)}%.`,
  )
}
