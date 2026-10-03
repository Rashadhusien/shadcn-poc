import { readdir, readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'

const roots = ['src/features', 'src/components']
const extensions = new Set(['.css', '.html', '.js', '.jsx', '.ts', '.tsx'])
const colorLiteral =
  /#[\da-fA-F]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|oklch|oklab)\s*\(/i
const violations = []

async function inspect(directory) {
  let entries
  try {
    entries = await readdir(directory, { withFileTypes: true })
  } catch (error) {
    if (error.code === 'ENOENT') return
    throw error
  }

  for (const entry of entries) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) {
      await inspect(path)
    } else if (extensions.has(extname(entry.name))) {
      const content = await readFile(path, 'utf8')
      content.split(/\r?\n/).forEach((line, index) => {
        if (colorLiteral.test(line)) violations.push(`${path}:${index + 1}`)
      })
    }
  }
}

for (const root of roots) await inspect(root)

if (violations.length > 0) {
  console.error(
    `Color literals found; use semantic theme tokens:\n${violations.join('\n')}`,
  )
  process.exitCode = 1
} else {
  console.log(
    'Token check passed: no color literals in src/features or src/components.',
  )
}
