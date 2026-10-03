import { mkdir, readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const albumDirectory = path.resolve('public/images/album')
const thumbnailDirectory = path.join(albumDirectory, 'thumbs')
const filenames = await readdir(albumDirectory)
const photos = filenames.filter(filename => /\.jpe?g$/i.test(filename))

await mkdir(thumbnailDirectory, { recursive: true })

for (const filename of photos) {
  const outputFilename = filename.replace(/\.jpe?g$/i, '.webp')
  await sharp(path.join(albumDirectory, filename))
    .rotate()
    .resize(800, 800, { fit: 'cover', position: 'attention' })
    .webp({ quality: 78, effort: 5 })
    .toFile(path.join(thumbnailDirectory, outputFilename))
}

console.log(`Generated ${photos.length} gallery thumbnails in ${thumbnailDirectory}`)