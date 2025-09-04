import fs from 'fs'
import path from 'path'

const root = path.resolve(process.cwd(), 'dist-ext')
const fromDir = path.join(root, '_next')
const toDir = path.join(root, 'next')

function renameNextDir() {
  if (fs.existsSync(fromDir)) {
    fs.renameSync(fromDir, toDir)
  }
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles)
    } else {
      arrayOfFiles.push(fullPath)
    }
  }
  return arrayOfFiles
}

function replaceReferences() {
  const files = getAllFiles(root)
  const targetExts = new Set(['.html', '.js', '.css', '.json', '.map'])
  for (const file of files) {
    const ext = path.extname(file)
    if (!targetExts.has(ext)) continue
    let content = fs.readFileSync(file, 'utf8')
    const replaced = content
      .replaceAll('/_next/', '/next/')
      .replaceAll('"/_next/', '"/next/')
      .replaceAll("'/_next/", "'/next/")
      .replaceAll('_next/', 'next/')
      .replaceAll('/_next', '/next')
      .replaceAll('_next', 'next')
    if (replaced !== content) {
      fs.writeFileSync(file, replaced)
    }
  }
}

function main() {
  if (!fs.existsSync(root)) {
    console.error('dist-ext not found. Run build first.')
    process.exit(1)
  }
  renameNextDir()
  replaceReferences()
  console.log('Prepared extension: renamed _next -> next and updated references')
}

main()


