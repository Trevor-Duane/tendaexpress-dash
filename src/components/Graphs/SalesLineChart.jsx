import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Dot } from "recharts";
import { motion } from "framer-motion"; // For animation effect

const SalesAreaChart = ({ data }) => {
  // Custom blinking dot for the latest point
  const BlinkingDot = (props) => {
    const { cx, cy } = props;
    return (
      <motion.circle
        cx={cx}
        cy={cy}
        r={6} // Size of the dot
        fill="red"
        animate={{ opacity: [1, 0.3, 1] }} // Blinking effect
        transition={{ repeat: Infinity, duration: 0.8 }}
      />
    );
  };

  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Area 
          type="monotone" 
          dataKey="amount" 
          stroke="#663399" 
          fill="#663399" 
          fillOpacity={0.3} 
          strokeWidth={2}
          dot={(props) => {
            const { key, ...restProps } = props; // Extract key
            return props.index === data.length - 1 
              ? <BlinkingDot key={key} {...restProps} />
              : <Dot key={key} {...restProps} fill="#8884d8" />;
          }}
          
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SalesAreaChart;
