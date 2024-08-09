const allLogs = require('./mcplaytime')
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
