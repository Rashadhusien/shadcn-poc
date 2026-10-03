import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const muiSeed = resolve(root, '..', 'mui', 'src', 'data', 'seed')
const seeds = [
  'billing.json',
  'cases.json',
  'change-requests.json',
  'clinics.json',
  'dashboard-volume.json',
  'doctors.json',
  'documents.json',
  'notifications.json',
  'orders.json',
  'patients.json',
  'reporting.json',
  'scan-centers.json',
  'sub-orders.json',
]

const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex')

let mismatches = 0
for (const name of seeds) {
  const [mine, baseline] = await Promise.all([
    readFile(resolve(root, 'src/data/seed', name)),
    readFile(resolve(muiSeed, name)),
  ])
  const match = sha256(mine) === sha256(baseline)
  if (!match) mismatches += 1
  console.log(`${match ? 'match' : 'DIFF'} ${name}`)
}

if (mismatches > 0) {
  console.error(`${mismatches} seed files differ from the MUI baseline.`)
  process.exitCode = 1
} else {
  console.log(
    `Seed check passed: ${seeds.length}/${seeds.length} seed files identical to the MUI baseline.`
  )
}
