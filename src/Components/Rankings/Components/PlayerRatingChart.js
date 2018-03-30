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
        tooltips: {
          displayed: false
        },
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
              fontSize: 12,
              fontFamily: "'Antic', sans-serif",
              fontColor: "#101010",
              min: 0,
              max: this.computedChartData.labels.length,
              stepSize: 1
            }
          }]
        },
        maintainAspectRatio: false
      }
    }
  },
  mounted() {

    this.backgroundGradient = this.$refs.canvas.getContext("2d").createLinearGradient(0, 0, 500, 0)
    this.backgroundGradient.addColorStop(0, "#68829ea0")
    this.backgroundGradient.addColorStop(0.5, "#acc078a0")
    this.backgroundGradient.addColorStop(1, "#c2574ea0")

/*    this.renderChart(
      {
        labels: this.playerRatingChartLabels,
        datasets: [
          {
            label: "Player Rating",
            borderWidth: 2.5,
            borderColor: this.borderGradient,
            lineTension: 0,
            pointRadius: 1 ,
            backgroundColor: this.backgroundGradient,
            data: this.playerRatingChartData
          }
        ]
      },
      {
        scales: {
          yAxes: [{
            ticks: {
              min: 0,
              max: 1000,
              stepSize: 2.550,
              fontSize: 12,
              fontFamily: "'Antic', sans-serif",
              fontColor: "#101010"

            }
          }],
          xAxes: [{
            ticks: {
              fontSize: 12,
              fontFamily: "'Antic', sans-serif",
              fontColor: "#101010",
              min: 0,
              max: 10,
              stepSize: 1
            }
          }]
        },
        legend: {
          display: true,
          position: "left",
          labels: {
            fontSize: 12,
            fontFamily: "'Antic', sans-serif",
            fontColor: "#101010",
          }
        },
        maintainAspectRatio: false
      }
    )*/
    this.renderChart(this.chartData, this.chartOptions)
  }
}
