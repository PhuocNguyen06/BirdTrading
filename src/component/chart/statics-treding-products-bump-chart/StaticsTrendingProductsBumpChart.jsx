import React from "react";
import { ResponsiveBump } from "@nivo/bump";
import { ResponsiveLine } from "@nivo/line";
const legends = [
   {
      dataFrom: "keys",
      anchor: "bottom-right",
      direction: "column",
      justify: false,
      translateX: 120,
      translateY: 0,
      itemsSpacing: 2,
      itemWidth: 100,
      itemHeight: 20,
      itemDirection: "left-to-right",
      itemOpacity: 0.85,
      itemTextColor: "#010101",
      symbolSize: 20,
      effects: [
         {
            on: "hover",
            style: {
               itemOpacity: 1,
            },
         },
      ],
   },
];
const themes = {
   height: "100%",
   axis: {
      fontSize: "14px",
      text: {
         fill: "#0b1d00",
      },
      tickColor: "#eee",
      ticks: {
         line: {
            stroke: "#ffdfdf",
         },
         text: {
            fill: "#0b1c00",
         },
      },
      legend: {
         text: {
            fill: "#ffffff",
         },
      },
      domain: {
         text: {
            fill: "#ffffff",
         },
      },
      keys: {
         text: {
            fill: "#0c0000",
         },
      },
   },
   dots: {
      text: {
         fill: "#281a29",
      },
   },
   grid: {
      line: {
         stroke: "#7f7f7f",
      },
      text: {
         fill: "#0a0a0a",
      },
   },
};
export default function StaticsTrendingProductsBumpChart({ data }) {
   console.log(data);
   return (
      <>
         {data ? (
            <ResponsiveLine
               data={data}
               theme={themes}
               labelTextColor="#ffffff"
               pointLabelColor="#4dfec9"
               legends={legends}
               margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
               xScale={{ type: "point" }}
               yScale={{
                  type: "linear",
                  min: "auto",
                  max: "auto",
                  stacked: true,
                  reverse: false,
               }}
               yFormat=" >-.1f"
               curve="catmullRom"
               axisTop={null}
               axisRight={null}
               axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "transportation",
                  legendOffset: 36,
                  legendPosition: "middle",
               }}
               axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: "count",
                  legendOffset: -40,
                  legendPosition: "middle",
               }}
               colors={{ scheme: "dark2" }}
               pointSize={10}
               pointColor={{ theme: "background" }}
               pointBorderWidth={2}
               pointBorderColor={{ from: "serieColor" }}
               pointLabelYOffset={-12}
               useMesh={true}
            />
         ) : (
            ""
         )}
      </>
   );
}
