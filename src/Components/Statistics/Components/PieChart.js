import { Pie } from "vue-chartjs"

export default {
  extends: Pie,
  props: [
    "pieChartData",
    "pieChartOptions"
  ],
  mounted() {
    this.renderChart(this.pieChartData, this.pieChartOptions)
  }
}
