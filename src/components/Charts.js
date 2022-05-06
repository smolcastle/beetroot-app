import React from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

const options = {
  chart: {
    type: "line",
    height: 50,
    width: 120,
    spacingBottom: 2,
    spacingTop: 2,
    spacingLeft: 0,
    spacingRight: 0,
    backgroundColor: "transparent",
  },
  title: {
    text: null,
  },
  xAxis: {
    labels: {
      enabled: false,
    },
    visible: false,
  },
  yAxis: {
    labels: {
      enabled: false,
    },
    visible: false,
  },
  tooltip: { enabled: false },
  series: [
    {
      data: [8, 2, 2, 4, 3, 6, 9, 10, 4, 5, 8, 3],
      showInLegend: false,
    },
  ],
  plotOptions: {
    series: {
      marker: {
        enabled: false,
      },
    },
  },
  credits: {
    enabled: false,
  },
};

export default function Charts() {
  return (
    <div className="mr-8">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}
