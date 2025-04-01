import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Rectangle } from "recharts";
import { motion } from "framer-motion"; // For animation effect

const SalesBarChart = ({ data }) => {
  // Custom animated bar for the latest entry
  const AnimatedBar = (props) => {
    const { x, y, width, height } = props;
    return (
      <motion.rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="red"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
      />
    );
  };

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Bar 
          dataKey="amount" 
          fill="#663399" 
          barSize={30}
          shape={(props) => 
            props.index === data.length - 1 
              ? <AnimatedBar {...props} /> 
              : <Rectangle {...props} fill="#663399" />
          }
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SalesBarChart;
