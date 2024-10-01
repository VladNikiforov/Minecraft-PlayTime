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

        allLogs.push({ date: file, time: playTime })
      }
    } catch (error) {
      console.error(`Error processing file ${file}:`, error.message)
    }
  }
})

allLogs = allLogs.filter((log) => !Number.isNaN(log.time) && log.time !== 0)

const combineDuplicates = (dataArray) => {
  const combinedData = {}

  dataArray.forEach(({ date, time }) => {
    date = date.split('-').slice(0, 3).join('-')

    if (combinedData[date]) {
      combinedData[date] += time
    } else {
      combinedData[date] = time
    }
  })

  return Object.entries(combinedData).map(([date, time]) => ({ date, time }))
}

allLogs = combineDuplicates(allLogs)

module.exports = allLogs
