export const legends = [
   {
      dataFrom: "keys",
      anchor: "bottom-right",
      direction: "column",
      justify: false,
      translateX: 110,
      translateY: 0,
      itemsSpacing: 2,
      itemWidth: 100,
      itemHeight: 20,
      itemDirection: "left-to-right",
      itemOpacity: 0.85,
      itemTextColor: "#050010",
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
export const themes = {
   fontSize: '8px',
   axis: {
      fontSize: "10px",
      tickColor: "#eee",
      ticks: {
         line: {
            stroke: "#555555",
         },
         text: {
            fill: "#040a00",
         },
      },
      legend: {
         text: {
            fill: "#2e2e2e",
         },
      },
      domain: {
         text: {
            fill: "#190000",
         },
      },
      keys: {
         text: {
            fill: "#333333",
         },
      },
   },
   grid: {
      line: {
         stroke: "#555555",
      },
   },
};