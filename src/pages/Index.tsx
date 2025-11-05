import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Calendar, Tag, X, TrendingUp } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import InsightCard from "@/components/InsightCard";
import LeadsTable from "@/components/LeadsTable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

// Mock data
const barChartData = [
  { name: "BIO IGOR", value: 32 },
  { name: "CR 17 | LEVA 1", value: 115 },
  { name: "CR 6 | LEVA 1", value: 65 },
  { name: "CR 2 | LEVA 1", value: 95 },
];

const lineChartData = [
  { date: "01/09", value: 5 },
  { date: "04/09", value: 18 },
  { date: "07/09", value: 20 },
  { date: "10/09", value: 21 },
  { date: "13/09", value: 8 },
  { date: "16/09", value: 24 },
  { date: "19/09", value: 22 },
  { date: "22/09", value: 19 },
  { date: "25/09", value: 7 },
  { date: "28/09", value: 3 },
];

const leadsData = [
  {
    id: "1",
    name: "Fernanda Laryssa",
    email: "felary2015@gmail.com",
    phone: "34991118103",
    potential: "até 50k",
    expertise: "Outro",
    tag: "BIO IGOR",
    date: "03/11/2025 16:40",
  },
  {
    id: "2",
    name: "Luis Fernando",
    email: "xluisaj@gmail.com",
    phone: "87996793112",
    potential: "+500k",
    expertise: "Expert de aviator",
    tag: "BIO IGOR",
    date: "30/10/2025 02:14",
  },
  {
    id: "3",
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "11987654321",
    potential: "até 100k",
    expertise: "Expert de roleta",
    tag: "CR 17 | LEVA 1",
    date: "02/11/2025 14:22",
  },
  {
    id: "4",
    name: "Maria Santos",
    email: "maria.s@email.com",
    phone: "21976543210",
    potential: "até 200k",
    expertise: "Expert de roleta",
    tag: "CR 17 | LEVA 1",
    date: "01/11/2025 09:15",
  },
];

const Index = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("all");
  const [selectedTag, setSelectedTag] = useState("all");

  const handleClearFilters = () => {
    setSelectedPeriod("all");
    setSelectedTag("all");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Dashboard de Leads</h1>
          </div>
          <p className="text-muted-foreground">
            Análise de performance das Landing Pages
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <Button
            variant="outline"
            className="gap-2 border-primary/20 hover:border-primary hover:bg-primary/10"
          >
            <Calendar className="h-4 w-4" />
            Selecionar período
          </Button>
          <Button
            variant="outline"
            className="gap-2 border-primary/20 hover:border-primary hover:bg-primary/10"
          >
            <Tag className="h-4 w-4" />
            Todas as tags
          </Button>
          <Button
            variant="ghost"
            onClick={handleClearFilters}
            className="gap-2 hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-4 w-4" />
            Limpar filtros
          </Button>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total de Leads"
            value="357"
            subtitle="Leads captados"
            trend={12}
          />
          <StatsCard
            title="Melhor Tag"
            value="CR 17 | LEVA 1"
            subtitle="115 leads"
            highlight
          />
          <StatsCard
            title="Potencial Total"
            value="R$ 41.9M"
            subtitle="Faturamento estimado"
            trend={8}
          />
          <StatsCard
            title="Pior Tag"
            value="CR 2 | LEVA 1"
            subtitle="3 leads"
            trend={-5}
          />
        </div>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InsightCard
            title="TAG com mais Potencial"
            value="CR 1 | LEVA 1"
            subtitle="11 leads com valores altos"
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <InsightCard
            title="Expertise mais atingida"
            value="Expert de roleta"
            subtitle="106 leads preenchidos"
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <InsightCard
            title="Média de Leads por Dia"
            value="9.2"
            subtitle="diário"
            compact
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Leads por Tag (LP)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  angle={-15}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="hsl(var(--primary))"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Line Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">
              Evolução de Leads (Últimos 7 dias)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={lineChartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Leads Table */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">Todos os Leads</h3>
          <LeadsTable leads={leadsData} onDelete={(id) => console.log("Delete:", id)} />
        </div>
      </div>
    </div>
  );
};

export default Index;
