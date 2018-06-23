import { Line } from "vue-chartjs"

export default {
  extends: Line,
  props: [
    "computedChartData"

  ],
  data() {
    return {
      backgroundGradient: null,
      chartData: {
        labels: this.computedChartData.labels,
        datasets: [
          {
            label: "Player Rating",
            data: this.computedChartData.playerRating,
            borderWidth: 2.5,
            borderColor: "#68829e",
            backgroundColor: "#ffffff00",
            yAxisID: "playerRatingAxis",
            lineTension: 0.25,
            pointRadius: 1
          },
          {
            label: "Win Percentage",
            data: this.computedChartData.winPercentage,
            borderWidth: 2.5,
            borderColor: "#acc078",
            backgroundColor: "#ffffff00",
            yAxisID: "winPercentageAxis",
            lineTension: 0.25,
            pointRadius: 1
          },
          {
            label: "Points Per Game",
            data: this.computedChartData.pointsPerGame,
            borderWidth: 2.5,
            borderColor: "#c2574e",
            backgroundColor: "#ffffff00",
            yAxisID: "pointsPerGameAxis",
            lineTension: 0.25,
            pointRadius: 1
          }
        ]
      },
      chartOptions: {
        legend: {
          position: "bottom",
          labels: {
            fontSize: 12,
            fontFamily: "'Antic', sans-serif",
            fontColor: "#101010"
          }
        },
        scales: {
          yAxes: [
            {
              id: "playerRatingAxis",
              ticks: {
                fontSize: 12,
                fontFamily: "'Antic', sans-serif",
                fontColor: "#101010",
                min: 0,
                max: 1000,
                stepSize: 250
              }
            },
            {
              id: "winPercentageAxis",
              ticks: {
                fontSize: 12,
                fontFamily: "'Antic', sans-serif",
                fontColor: "#101010",
                min: 0,
                max: 100,
                stepSize: 25
              }
            },
            {
              id: "pointsPerGameAxis",
              position: "right",
              ticks: {
                fontSize: 12,
                fontFamily: "'Antic', sans-serif",
                fontColor: "#101010",
                min: 0,
                max: 3,
                stepSize: 0.75
              }
            }
          ],
          xAxes: [{
            ticks: {
              fontSize: 0,
              fontFamily: "'Antic', sans-serif",
              fontColor: "#101010",
              min: 0,
              max: this.computedChartData.labels.length,
            }
          }]
        },
        maintainAspectRatio: false
      }
    }
  },
  mounted() {
    this.renderChart(this.chartData, this.chartOptions)
  }
}
