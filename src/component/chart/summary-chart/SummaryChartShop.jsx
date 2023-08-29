import { ResponsiveBar } from "@nivo/bar";
import {data } from './mock'
import React from "react";
import theme from "../../../style/theme.js";
import { legends , themes} from './../themeChart';
export default function SummaryChartShop({data}) {
   console.log(data, '------data------------------------------------');
   return (
     <>
      {data ? (
          <ResponsiveBar
          data={data}
          theme={themes}
          legends={legends}
          keys={['birds', 'accessories', 'foods']}
          indexBy="date"
          margin={{ top: 10, right: 80, bottom: 50, left: 50 }}
          padding={0.3}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={{ scheme: "dark2" }}
          
          defs={[
             {
                id: "dots",
                type: "patternDots",
                background: "inherit",
                color: "#38bcb2",
                size: 4,
                padding: 1,
                stagger: true,
             },
             {
                id: "lines",
                type: "patternLines",
                background: "inherit",
                color: "#eed312",
                rotation: -45,
                lineWidth: 6,
                spacing: 10,
             },
          ]}
          fill={[
             {
                match: {
                   id: "fries",
                },
                id: "dots",
             },
             {
                match: {
                   id: "sandwich",
                },
                id: "lines",
             },
          ]}
          borderColor={{
             from: "color",
             modifiers: [["darker", 1.6]],
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
             tickSize: 5,
             tickPadding: 5,
             tickRotation: 0,
             legend: "day in week",
             legendPosition: "middle",
             legendOffset: 32,
          }}
          axisLeft={{
             tickSize: 5,
             tickPadding: 5,
             tickRotation: 0,
             legend: "category",
             legendPosition: "middle",
             legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor="#ffffff"
          role="application"
          ariaLabel="Nivo bar chart demo"
          barAriaLabel={(e) =>
             e.id + ": " + e.formattedValue + " in country: " + e.indexValue
          }
       />
      ) : ''}
     </>
   );
}
