import clsx from "clsx";
import s from "./staticsPriceByCategory.module.scss";
import React, { useEffect, useState } from "react";
import StaticsPriceCategoryPieChart from "../chart/stattics-price-category-pie-chart-shop/StaticsPriceCategoryPieChart";
import { motion } from "framer-motion";
import { api } from "../../api/api";

export default function StaticsPriceByCategory() {
   const [staticsPieChart, setStaticsPieChart] =  useState(null);
   useEffect(() => {
      getStaticTrending();
   }, []);
   const getStaticTrending = async () => {
      try {
         const response = await api.get('/shop-owner/pie-chart');
         console.log(response)
         const data = await response.data;
         console.log(data);
         setStaticsPieChart(data);
      } catch (err) {
         console.error(err);
      }
   }
   console.log(staticsPieChart);
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
      >
         <div className={s.title}>
            <span>Pie chart in categories</span>
         </div>
         <div className={s.chart}>
            <StaticsPriceCategoryPieChart data={staticsPieChart}/>
         </div>
      </motion.div>
   );
}
