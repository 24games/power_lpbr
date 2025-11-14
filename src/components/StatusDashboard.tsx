import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StatusData {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

interface StatusDashboardProps {
  data: StatusData[];
  totalLeads: number;
  period?: string;
  onPeriodChange?: (period: string) => void;
}

const StatusDashboard = ({ 
  data, 
  totalLeads, 
  period = "all",
  onPeriodChange 
}: StatusDashboardProps) => {
  const chartData = data.map(item => ({
    name: item.status,
    value: item.count,
  }));

  // Calcular o total para o centro do gráfico
  const totalValue = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Estatística</h3>
        <Select value={period} onValueChange={onPeriodChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="week">Esta Semana</SelectItem>
            <SelectItem value="month">Este Mês</SelectItem>
            <SelectItem value="year">Este Ano</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Donut Chart */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-sm text-muted-foreground">Total de Leads</p>
          <p className="text-3xl font-bold">{totalValue}</p>
        </div>
      </div>

      {/* Status List */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0"
                style={{ backgroundColor: `${item.color}20`, color: item.color }}
              >
                {item.percentage}%
              </div>
              <span className="font-medium text-sm truncate" title={item.status}>
                {item.status}
              </span>
            </div>
            <span className="font-semibold ml-2 flex-shrink-0">{item.count}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default StatusDashboard;
