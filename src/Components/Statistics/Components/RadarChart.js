import { Radar } from "vue-chartjs"

export default {
  extends: Radar,
  props: [
    "radarChartData"
  ],
  data() {
    return {
      canvas: null
    }
  },
  mounted() {
      this.renderChart(
      {
        labels: ["Finishes", "First Finishes", "Knock Offs", "Saves", "Denies"],
        datasets: [
          {
            data: this.radarChartData,
            borderWidth: 1.5,
            borderColor: "#94aeac",
            backgroundColor: "#94aeac80",
            pointRadius: 0
          }
        ]
      },
      {
        scale: {
          ticks: {
            display: false,
            min: -0.2,
            max: 1,
            stepSize: 0.2
          },
          pointLabels: {
            fontSize: 12,
            fontStyle: "normal",
            fontFamily: "'Antic', sans-serif",
            fontColor: "#505050"
          }
        },
        legend: {
          display: false
        },
        maintainAspectRatio: false
      }
    )
  }
}
