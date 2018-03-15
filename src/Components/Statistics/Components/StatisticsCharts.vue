<template>
</template>

<script>

import { Pie } from "vue-chart-js"

export default {

  extends: Pie,

  props: ["chartData", "chartOptions"]

  mounted() {
    this.renderChart(this.chartData, this.chartOptions)
  }
</script>

<style scoped>
</style>
