// src/components/admin/StatCard.js
import React from "react";
import { Card, Statistic } from "antd";

const StatCard = ({ title, value, icon, color }) => {
  return (
    <Card className="shadow-sm rounded-lg">
      <Statistic
        title={title}
        value={value}
        prefix={icon}
        valueStyle={{ color: color || "#1890ff" }}
      />
    </Card>
  );
};

export default StatCard;
