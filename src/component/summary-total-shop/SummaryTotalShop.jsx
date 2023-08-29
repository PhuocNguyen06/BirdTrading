import clsx from "clsx";
import s from "./summaryTotalShop.module.scss";
import React from "react";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import MovingIcon from "@mui/icons-material/Moving";
import SummaryChartShop from "../chart/summary-chart/SummaryChartShop";
import { motion } from "framer-motion";
import { useId } from "react";
export default function SummaryTotalShop({ data, type }) {
   const id = useId();
   const animation = {
      init: {
         opacity: 0,
      },
      animate: {
         opacity: 1,
         transition: {
            duration: 2,
         },
      },
   };
   return (
      <motion.div
         variants={animation}
         initial="init"
         animate="animate"
         exit={"exit"}
         className={clsx(s.container, "box-shadow")}
         key={id}
      >
         {data ? (
            <>
               <div className={s.metric}>
                  <h4>Total {type}</h4>
                  <span>{data.total}</span>
                  <span>
                     {data.percent >= 0 ? (
                        <>
                           {data.percent}% <MovingIcon />
                        </>
                     ) : (
                        <>
                           {data.percent}% <TrendingDownIcon />
                        </>
                     )}
                  </span>
               </div>
               <div className={s.chart}>
                  <SummaryChartShop data={data.barChartDtoList} />
               </div>
            </>
         ) : (
            ""
         )}
      </motion.div>
   );
}
