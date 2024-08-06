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
allLogs.unshift(['Date', 'Minutes'])

console.log('COPY DATA HERE:')
console.dir(allLogs, { depth: null, maxArrayLength: null })

const totalPlayTime = allLogs.reduce((num1, num2) => num1[1] + num2[1], 0)

console.log(`Estimated PlayTime: ${Math.floor(totalPlayTime / 60)} hours and ${totalPlayTime % 60} minutes`)

const playTimeInDays = Math.floor(totalPlayTime / 60 / 24)
playTimeInDays == 0 ? console.log("That's not even a day!") : console.log(`That's over ${playTimeInDays} days!`)
console.log(`Average 'game day' playtime: ${Math.round(totalPlayTime / allLogs.length)} mins/day`)

const today = new Date()
const start = new Date(allLogs[1][0])
const dayDiffrence = (today - start) / (1000 * 60 * 60 * 24)
console.log(`Average playtime since the downloading of the game ${Math.round(totalPlayTime / dayDiffrence)} mins/day`)
