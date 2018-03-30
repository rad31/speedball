import { Line } from "vue-chartjs"

export default {
  extends: Pie,
  props: [
    "computedStatsChartData",
    "computedStatsChartOptions"
  ],
  mounted() {
    this.renderChart(this.computedStatsChartData, this.computedStatsChartOptions)
  }
}
