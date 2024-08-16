google.charts.load('current', { packages: ['corechart'] })

function drawChart(data) {
  data.unshift(['Dates', 'Minutes'])
  let displayData = google.visualization.arrayToDataTable(data)

  let options = {
    backgroundColor: '#272727',
    titleColor: '#fff',
    title: 'Your Minecraft PlayTime',
    hAxis: { title: 'Timeline', titleTextStyle: { color: '#fff' }, textPosition: 'none' },
    vAxis: { minValue: 0, textColor: '#fff' },
    legend: 'none',
  }

  let chart = new google.visualization.AreaChart(document.getElementById('chart_div'))
  chart.draw(displayData, options)
}

fetch('/data')
  .then((res) => {
    if (!res.ok) {
      throw new Error('Network response was not ok ' + res.statusText)
    }
    return res.json()
  })
  .then((data) => {
    const total_playtime = document.getElementById('total-playtime')
    const playtime_indays = document.getElementById('playtime-indays')
    const average_playtime = document.getElementById('average-playtime')
    const average_playtime_alltime = document.getElementById('average-playtime-alltime')

    const totalPlayTime = data.reduce((sum, entry) => sum + entry[1], 0)

    total_playtime.textContent = `Total PlayTime: 
    ${Math.floor(totalPlayTime / 60)} hours and ${totalPlayTime % 60} minutes`

    const totalPlayTimeInDays = Math.floor(totalPlayTime / 60 / 24)
    if (totalPlayTimeInDays) {
      playtime_indays.textContent = `That's over ${totalPlayTimeInDays} days!`
    }

    average_playtime.textContent = `Average playtime: ${Math.round(totalPlayTime / data.length)} mins/day`

    const dayDiffrence = (new Date() - new Date(data[1][0])) / (1000 * 60 * 60 * 24)
    average_playtime_alltime.textContent = `Average playtime (all time):
     ${Math.round(totalPlayTime / dayDiffrence)} mins/day`

    google.charts.setOnLoadCallback(() => drawChart(data))
  })
  .catch((err) => {
    console.error('There was a problem with the fetch operation:', err)
  })
