import { Radar } from "vue-chartjs"

export default {
  extends: Radar,
  props: ["radarChartData", "radarChartOptions"],
  mounted() {
    this.renderChart(this.radarChartData, this.radarChartOptions)
  }
}
