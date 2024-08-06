google.charts.load('current', { packages: ['corechart'] })
google.charts.setOnLoadCallback(drawChart)

function drawChart() {
  var data = google.visualization.arrayToDataTable([
    //PASTE DATA HERE
    ['Date', 'Minutes'],
    ['2023-09-06', 97],
    ['2023-09-11', 155],
    ['2023-10-07', 52],
    ['2023-10-21', 15],
    ['2023-10-29', 25],
    ['2023-10-30', 7],
    ['2023-11-11', 168],
    ['2023-11-18', 128],
    ['2024-03-30', 132],
    ['2024-04-02', 27],
    ['2024-04-03', 97],
    ['2024-04-04', 60],
    ['2024-04-05', 24],
    ['2024-04-06', 18],
    ['2024-05-12', 28],
    ['2024-07-06', 3],
    ['2024-07-15', 15],
    ['2024-07-16', 65],
    ['2024-07-29', 90],
    ['2024-08-02', 14],
  ])

  var options = {
    title: 'Minecraft PlayTime',
    hAxis: { title: 'Timeline', titleTextStyle: { color: '#333' } },
    vAxis: { minValue: 0, title: 'Minutes' },
  }

  var chart = new google.visualization.AreaChart(document.getElementById('chart_div'))
  chart.draw(data, options)
}
