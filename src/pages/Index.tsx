import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Calendar, Tag, X, TrendingUp, Loader2 } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import InsightCard from "@/components/InsightCard";
import LeadsTable from "@/components/LeadsTable";
import StatusDashboard from "@/components/StatusDashboard";
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
import { 
  useLeads, 
  useLeadStats, 
  useLeadsByTag, 
  useDailyLeads,
  useTotalPotential,
  useDeleteLead,
  useUniqueTags,
  useStatusStats
} from "@/hooks/usePowerLPBR";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format as formatDate } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

const Index = () => {
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  // Buscar dados do Supabase com filtros
  const filters = {
    tag: selectedTag,
    startDate,
    endDate,
  };

  // Filtros apenas de data (para gráficos que mostram todas as tags)
  const dateFilters = {
    startDate,
    endDate,
  };
  
  const { data: leads, isLoading: leadsLoading } = useLeads(filters);
  const { data: stats, isLoading: statsLoading } = useLeadStats(filters);
  const { data: tagData, isLoading: tagLoading } = useLeadsByTag(dateFilters);
  const { data: dailyData, isLoading: dailyLoading } = useDailyLeads(30, filters);
  const { data: totalPotential, isLoading: potentialLoading } = useTotalPotential(filters);
  const { data: statusData, isLoading: statusLoading } = useStatusStats(filters);
  const { data: uniqueTags } = useUniqueTags();
  const deleteLead = useDeleteLead();

  const handleClearFilters = () => {
    setSelectedTag("all");
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const handleDeleteLead = async (id: number) => {
    try {
      await deleteLead.mutateAsync(id);
      toast.success("Lead deletado com sucesso!");
    } catch (error) {
      toast.error("Erro ao deletar lead. Tente novamente.");
      console.error(error);
    }
  };

  // Formatar dados para os gráficos
  const barChartData = tagData?.map(item => ({
    name: item.tag,
    value: item.count
  })).slice(0, 10) || [];

  const lineChartData = dailyData?.map(item => ({
    date: item.date,
    value: item.count
  })) || [];

  // Formatar potencial total
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Loading state
  if (leadsLoading || statsLoading || tagLoading || dailyLoading || potentialLoading || statusLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Dashboard de Leads</h1>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">
              Análise de performance das Landing Pages
            </p>
            {(selectedTag !== "all" || startDate || endDate) && (
              <span className="px-2 py-1 rounded text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                Filtros ativos
              </span>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Filtro de Data Inicial */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 border-primary/20 hover:border-primary hover:bg-primary/10"
              >
                <Calendar className="h-4 w-4" />
                {startDate ? formatDate(startDate, "dd/MM/yyyy", { locale: ptBR }) : "Data inicial"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                locale={ptBR}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Filtro de Data Final */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 border-primary/20 hover:border-primary hover:bg-primary/10"
              >
                <Calendar className="h-4 w-4" />
                {endDate ? formatDate(endDate, "dd/MM/yyyy", { locale: ptBR }) : "Data final"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                locale={ptBR}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Filtro de Tag */}
          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="w-[200px] border-primary/20 hover:border-primary hover:bg-primary/10">
              <Tag className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Todas as tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as tags</SelectItem>
              {uniqueTags?.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Botão Limpar Filtros */}
          {(selectedTag !== "all" || startDate || endDate) && (
            <Button
              variant="ghost"
              onClick={handleClearFilters}
              className="gap-2 hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-4 w-4" />
              Limpar filtros
            </Button>
          )}
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total de Leads"
            value={stats?.totalLeads.toString() || "0"}
            subtitle="Leads captados"
          />
          <StatsCard
            title="Melhor Tag"
            value={stats?.bestTag.name || "N/A"}
            subtitle={`${stats?.bestTag.count || 0} leads`}
            highlight
          />
          <StatsCard
            title="Potencial Total"
            value={totalPotential ? formatCurrency(totalPotential) : "R$ 0"}
            subtitle="Faturamento estimado"
          />
          <StatsCard
            title="Pior Tag"
            value={stats?.worstTag.name || "N/A"}
            subtitle={`${stats?.worstTag.count || 0} leads`}
          />
        </div>

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InsightCard
            title="TAG com mais Potencial"
            value={stats?.bestTag.name || "N/A"}
            subtitle={`${stats?.bestTag.count || 0} leads`}
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <InsightCard
            title="Expertise mais atingida"
            value={stats?.topExpertise.name || "N/A"}
            subtitle={`${stats?.topExpertise.count || 0} leads preenchidos`}
            icon={<TrendingUp className="h-5 w-5" />}
          />
          <InsightCard
            title="Média de Leads por Dia"
            value={stats?.averageLeadsPerDay.toString() || "0"}
            subtitle="diário"
            compact
          />
        </div>

        {/* Status Dashboard & Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Dashboard */}
          <div className="lg:col-span-1">
            <StatusDashboard
              data={statusData || []}
              totalLeads={stats?.totalLeads || 0}
            />
          </div>

          {/* Charts */}
          <div className="lg:col-span-2 grid grid-cols-1 gap-6">
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
        </div>

        {/* Leads Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">Todos os Leads</h3>
            <p className="text-muted-foreground">
              {leads?.length || 0} lead{leads?.length !== 1 ? 's' : ''} encontrado{leads?.length !== 1 ? 's' : ''}
            </p>
          </div>
          <LeadsTable leads={leads || []} onDelete={handleDeleteLead} />
        </div>
      </div>
    </div>
  );
};

export default Index;
