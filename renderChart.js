google.charts.load('current', { packages: ['corechart'] })
google.charts.setOnLoadCallback(drawChart)

function drawChart() {
  var data = google.visualization.arrayToDataTable([
    //PASTE DATA HERE
  ])

  var options = {
    title: 'Minecraft PlayTime',
    hAxis: { title: 'Timeline', titleTextStyle: { color: '#333' } },
    vAxis: { minValue: 0, title: 'Minutes' },
  }

  var chart = new google.visualization.AreaChart(document.getElementById('chart_div'))
  chart.draw(data, options)
}
