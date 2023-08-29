import { ResponsivePie } from "@nivo/pie";
import React from "react";
const legends = [
   {
      dataFrom: "keys",
      anchor: "bottom",
      direction: "row",
      justify: false,
      translateX: 0,
      translateY: 50,
      itemsSpacing: 10,
      itemWidth: 100,
      itemHeight: 20,
      itemDirection: "left-to-right",
      itemOpacity: 0.85,
      itemTextColor: "#000000",
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
   fontSize: "1.6rem",
   axis: {
      fontSize: "10px",
      tickColor: "#eee",
      ticks: {
         line: {
            stroke: "#f2f1f1",
         },
         text: {
            fill: "#ffffff",
         },
      },
      legend: {
         text: {
            fill: "#260000",
         },
      },
      domain: {
         text: {
            fill: "#ffffff",
         },
      },
      keys: {
         text: {
            fill: "#ffffff",
         },
      },
   },
   grid: {
      line: {
         stroke: "#120000",
      },
   },
};
export default function AdminPieChart({ data }) {
   console.log(data);
   return (
      <>
         {data ? (
            <ResponsivePie
               data={data}
               theme={themes}
               margin={{ top: 40, right: 100, bottom: 80, left: 120 }}
               innerRadius={0.5}
               padAngle={0.7}
               cornerRadius={3}
               activeOuterRadiusOffset={8}
               borderWidth={1}
               borderColor={{
                  from: "color",
                  modifiers: [["darker", 0.2]],
               }}
               colors={{ scheme: "dark2" }}
               arcLinkLabelsSkipAngle={10}
               arcLinkLabelsTextColor="#000000"
               arcLinkLabelsThickness={2}
               arcLinkLabelsColor={{ from: "color" }}
               arcLabelsSkipAngle={10}
               arcLabelsTextColor={{
                  from: "color",
                  modifiers: [["darker", 2]],
               }}
               defs={[
                  {
                     id: "dots",
                     type: "patternDots",
                     background: "inherit",
                     color: "rgba(255, 255, 255, 0.3)",
                     size: 4,
                     padding: 1,
                     stagger: true,
                  },
                  {
                     id: "lines",
                     type: "patternLines",
                     background: "inherit",
                     color: "rgba(255, 255, 255, 0.3)",
                     rotation: -45,
                     lineWidth: 6,
                     spacing: 10,
                  },
               ]}
               fill={[
                  {
                     match: {
                        id: "ruby",
                     },
                     id: "dots",
                  },
                  {
                     match: {
                        id: "c",
                     },
                     id: "dots",
                  },
                  {
                     match: {
                        id: "go",
                     },
                     id: "dots",
                  },
                  {
                     match: {
                        id: "python",
                     },
                     id: "dots",
                  },
                  {
                     match: {
                        id: "scala",
                     },
                     id: "lines",
                  },
                  {
                     match: {
                        id: "lisp",
                     },
                     id: "lines",
                  },
                  {
                     match: {
                        id: "elixir",
                     },
                     id: "lines",
                  },
                  {
                     match: {
                        id: "javascript",
                     },
                     id: "lines",
                  },
               ]}
            />
         ) : (
            ""
         )}
      </>
   );
}
