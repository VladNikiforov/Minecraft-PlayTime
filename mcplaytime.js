const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

let allLogs = []

const logsDir = 'C:\\Users\\user\\AppData\\Roaming\\.minecraft\\logs'
const files = fs.readdirSync(logsDir)

files.forEach((file) => {
  const filePath = path.join(logsDir, file)

  if (file.endsWith('.log.gz')) {
    try {
      const compressedContent = fs.readFileSync(filePath)
      const content = zlib.gunzipSync(compressedContent).toString('utf-8')
      const lines = content.split('\n').filter((line) => line.trim() !== '')

      if (lines.length > 0) {
        const firstLineTime = lines[0].substring(1, 9)
        const lastLineTime = lines[lines.length - 1].substring(1, 9)

        let firstLineHours = parseInt(firstLineTime.substring(0, 2))
        let firstLineMinutes = parseInt(firstLineTime.substring(3, 5))

        let lastLineHours = parseInt(lastLineTime.substring(0, 2))
        let lastLineMinutes = parseInt(lastLineTime.substring(3, 5))

        let playTime = lastLineHours * 60 + lastLineMinutes - (firstLineHours * 60 + firstLineMinutes)

        file = file.replace('.log.gz', '')

        allLogs.push([file, playTime])
      }
    } catch (error) {
      console.error(`Error processing file ${file}:`, error.message)
    }
  }
})

allLogs = allLogs.filter((subArray) => !Number.isNaN(subArray[1]) && subArray[1] !== 0)

const combineDuplicates = (dataArray) => {
  const combinedData = {}

  dataArray.forEach(([date, value]) => {
    date = date.split('-').slice(0, 3).join('-')

    if (combinedData[date]) {
      combinedData[date] += value
    } else {
      combinedData[date] = value
    }
  })

  return Object.entries(combinedData)
}

allLogs = combineDuplicates(allLogs)

const totalPlayTime = allLogs.reduce((sum, entry) => sum + entry[1], 0)

allLogs.unshift(['Date', 'Minutes'])

console.log(`Estimated PlayTime: ${Math.floor(totalPlayTime / 60)} hours and ${totalPlayTime % 60} minutes`)

const playTimeInDays = Math.floor(totalPlayTime / 60 / 24)
console.log(`That's over ${playTimeInDays} days!`)
console.log(`Average 'game day' playtime: ${Math.round(totalPlayTime / allLogs.length)} mins/day`)

const start = new Date(allLogs[1][0])
const dayDiffrence = (new Date() - start) / (1000 * 60 * 60 * 24)
console.log(`Average playtime since the downloading of the game ${Math.round(totalPlayTime / dayDiffrence)} mins/day`)

const express = require('express')

const app = express()
const PORT = 3000

app.use(express.static('public'))

app.get('/data', (req, res) => {
  res.json(allLogs)
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
