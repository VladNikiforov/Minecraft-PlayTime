fetch('/data')
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText)
    }
    return response.json()
  })
  .then((data) => {
    drawChart(data)
  })
  .catch((error) => {
    console.error('There was a problem with the fetch operation:', error)
  })

google.charts.load('current', { packages: ['corechart'] })
google.charts.setOnLoadCallback(drawChart)

function drawChart(data) {
  let passData = google.visualization.arrayToDataTable(data)

  let options = {
    hAxis: { title: 'Timeline', titleTextStyle: { color: '#333' }, textPosition: 'none' },
    vAxis: { minValue: 0 },
  }

  let chart = new google.visualization.AreaChart(document.getElementById('chart_div'))
  chart.draw(passData, options)
}
