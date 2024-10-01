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

    const totalPlayTime = data.reduce((sum, entry) => sum + entry.time, 0)

    total_playtime.textContent = `Total PlayTime: 
    ${Math.floor(totalPlayTime / 60)} hours and ${totalPlayTime % 60} minutes`

    const totalPlayTimeInDays = Math.floor(totalPlayTime / 60 / 24)
    if (totalPlayTimeInDays) {
      playtime_indays.textContent = `That's over ${totalPlayTimeInDays} days!`
    }

    average_playtime.textContent = `Average playtime: ${Math.round(totalPlayTime / data.length)} mins/day`

    const dayDiffrence = (new Date() - new Date(data[0].date)) / (1000 * 60 * 60 * 24)
    average_playtime_alltime.textContent = `Average playtime (all time):
     ${Math.round(totalPlayTime / dayDiffrence)} mins/day`

    var ctx = document.getElementById('playtimeChart').getContext('2d')

    function formatPlaytime(minutes) {
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
      return `${hours}h ${mins}min`
    }

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map((d) => d.date),
        datasets: [
          {
            label: 'Playtime',
            data: data.map((d) => d.time),
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => {
                return formatPlaytime(value)
              },
            },
            title: {
              display: true,
              text: 'Playtime (hours and minutes)',
            },
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw
                return `Playtime: ${formatPlaytime(value)}`
              },
            },
          },
        },
      },
    })

    console.log(data)
  })
  .catch((err) => {
    console.error('There was a problem with the fetch operation:', err)
  })
