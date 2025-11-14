import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { PowerLPBR, LeadStats, TagCount, DailyLeadCount } from '@/types/power-lpbr';
import { format, subDays, parseISO, startOfDay, endOfDay } from 'date-fns';

// Buscar todos os leads com filtros opcionais
export const useLeads = (filters?: { tag?: string; startDate?: Date; endDate?: Date }) => {
  return useQuery({
    queryKey: ['power-lpbr-leads', filters],
    queryFn: async () => {
      let query = supabase
        .from('power_lpbr')
        .select('*')
        .order('created_at', { ascending: false });

      // Aplicar filtro de tag
      if (filters?.tag && filters.tag !== 'all') {
        query = query.eq('tag', filters.tag);
      }

      // Aplicar filtro de data
      if (filters?.startDate) {
        query = query.gte('created_at', startOfDay(filters.startDate).toISOString());
      }
      if (filters?.endDate) {
        query = query.lte('created_at', endOfDay(filters.endDate).toISOString());
      } else if (filters?.startDate) {
        // Se só tem data inicial, vai até hoje
        query = query.lte('created_at', endOfDay(new Date()).toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as PowerLPBR[];
    },
  });
};

// Hook para deletar um lead
export const useDeleteLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('power_lpbr')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidar queries para atualizar a lista
      queryClient.invalidateQueries({ queryKey: ['power-lpbr-leads'] });
      queryClient.invalidateQueries({ queryKey: ['power-lpbr-stats'] });
      queryClient.invalidateQueries({ queryKey: ['power-lpbr-by-tag'] });
      queryClient.invalidateQueries({ queryKey: ['power-lpbr-daily'] });
      queryClient.invalidateQueries({ queryKey: ['power-lpbr-potential'] });
    },
  });
};

// Hook para obter lista única de tags
export const useUniqueTags = () => {
  return useQuery({
    queryKey: ['power-lpbr-unique-tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('power_lpbr')
        .select('tag');

      if (error) throw error;

      const leads = data as PowerLPBR[];
      const uniqueTags = Array.from(new Set(leads.map(lead => lead.tag).filter(Boolean)));
      return uniqueTags.sort();
    },
  });
};

// Buscar estatísticas dos leads com filtros
export const useLeadStats = (filters?: { tag?: string; startDate?: Date; endDate?: Date }) => {
  return useQuery({
    queryKey: ['power-lpbr-stats', filters],
    queryFn: async () => {
      let query = supabase.from('power_lpbr').select('*');

      // Aplicar filtro de tag
      if (filters?.tag && filters.tag !== 'all') {
        query = query.eq('tag', filters.tag);
      }

      // Aplicar filtro de data
      if (filters?.startDate) {
        query = query.gte('created_at', startOfDay(filters.startDate).toISOString());
      }
      if (filters?.endDate) {
        query = query.lte('created_at', endOfDay(filters.endDate).toISOString());
      } else if (filters?.startDate) {
        // Se só tem data inicial, vai até hoje
        query = query.lte('created_at', endOfDay(new Date()).toISOString());
      }

      const { data: leads, error } = await query;

      if (error) throw error;

      const leadsData = leads as PowerLPBR[];

      // Calcular estatísticas
      const totalLeads = leadsData.length;

      // Contar leads por tag
      const tagCounts = leadsData.reduce((acc, lead) => {
        const tag = lead.tag || 'Sem tag';
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const tagEntries = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
      const bestTag = tagEntries[0] || ['N/A', 0];
      const worstTag = tagEntries[tagEntries.length - 1] || ['N/A', 0];

      // Contar leads por expertise
      const expertiseCounts = leadsData.reduce((acc, lead) => {
        const expertise = lead.expertise || 'Não informado';
        acc[expertise] = (acc[expertise] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const expertiseEntries = Object.entries(expertiseCounts).sort((a, b) => b[1] - a[1]);
      const topExpertise = expertiseEntries[0] || ['N/A', 0];

      // Calcular média de leads por dia
      const dates = leadsData
        .map(lead => lead.created_at)
        .filter(Boolean)
        .map(date => format(parseISO(date), 'yyyy-MM-dd'));

      const uniqueDates = new Set(dates);
      const averageLeadsPerDay = uniqueDates.size > 0 
        ? Math.round((totalLeads / uniqueDates.size) * 10) / 10 
        : 0;

      const stats: LeadStats = {
        totalLeads,
        bestTag: {
          name: bestTag[0],
          count: bestTag[1],
        },
        worstTag: {
          name: worstTag[0],
          count: worstTag[1],
        },
        topExpertise: {
          name: topExpertise[0],
          count: topExpertise[1],
        },
        averageLeadsPerDay,
      };

      return stats;
    },
  });
};

// Buscar contagem de leads por tag com filtros
export const useLeadsByTag = (filters?: { startDate?: Date; endDate?: Date }) => {
  return useQuery({
    queryKey: ['power-lpbr-by-tag', filters],
    queryFn: async () => {
      let query = supabase.from('power_lpbr').select('tag');

      // Aplicar filtro de data (não filtra por tag aqui pois queremos ver todas as tags)
      if (filters?.startDate) {
        query = query.gte('created_at', startOfDay(filters.startDate).toISOString());
      }
      if (filters?.endDate) {
        query = query.lte('created_at', endOfDay(filters.endDate).toISOString());
      } else if (filters?.startDate) {
        // Se só tem data inicial, vai até hoje
        query = query.lte('created_at', endOfDay(new Date()).toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      const leads = data as PowerLPBR[];
      const tagCounts = leads.reduce((acc, lead) => {
        const tag = lead.tag || 'Sem tag';
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const result: TagCount[] = Object.entries(tagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10 tags

      return result;
    },
  });
};

// Buscar evolução de leads nos últimos 30 dias com filtros
export const useDailyLeads = (days: number = 30, filters?: { tag?: string; startDate?: Date; endDate?: Date }) => {
  return useQuery({
    queryKey: ['power-lpbr-daily', days, filters],
    queryFn: async () => {
      // Usar data do filtro ou calcular baseado nos dias
      const calculatedStartDate = filters?.startDate || subDays(new Date(), days);
      const calculatedEndDate = filters?.endDate || new Date();
      
      let query = supabase
        .from('power_lpbr')
        .select('created_at')
        .gte('created_at', startOfDay(calculatedStartDate).toISOString())
        .lte('created_at', endOfDay(calculatedEndDate).toISOString());

      // Aplicar filtro de tag
      if (filters?.tag && filters.tag !== 'all') {
        query = query.eq('tag', filters.tag);
      }

      const { data, error } = await query;

      if (error) throw error;

      const leads = data as PowerLPBR[];

      // Agrupar por data
      const dailyCounts = leads.reduce((acc, lead) => {
        if (lead.created_at) {
          const date = format(parseISO(lead.created_at), 'dd/MM');
          acc[date] = (acc[date] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      // Criar array com todas as datas do período
      const result: DailyLeadCount[] = [];
      const totalDays = Math.ceil((calculatedEndDate.getTime() - calculatedStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      for (let i = 0; i < totalDays; i++) {
        const date = new Date(calculatedStartDate);
        date.setDate(date.getDate() + i);
        const dateKey = format(date, 'dd/MM');
        result.push({
          date: dateKey,
          count: dailyCounts[dateKey] || 0,
        });
      }

      return result;
    },
  });
};

// Calcular potencial total estimado com filtros
export const useTotalPotential = (filters?: { tag?: string; startDate?: Date; endDate?: Date }) => {
  return useQuery({
    queryKey: ['power-lpbr-potential', filters],
    queryFn: async () => {
      let query = supabase.from('power_lpbr').select('fat_deposito');

      // Aplicar filtro de tag
      if (filters?.tag && filters.tag !== 'all') {
        query = query.eq('tag', filters.tag);
      }

      // Aplicar filtro de data
      if (filters?.startDate) {
        query = query.gte('created_at', startOfDay(filters.startDate).toISOString());
      }
      if (filters?.endDate) {
        query = query.lte('created_at', endOfDay(filters.endDate).toISOString());
      } else if (filters?.startDate) {
        // Se só tem data inicial, vai até hoje
        query = query.lte('created_at', endOfDay(new Date()).toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      const leads = data as PowerLPBR[];

      // Mapear faixas de faturamento para valores médios
      const potentialMap: Record<string, number> = {
        'Até 50k': 25000,
        'até 50k': 25000,
        'Até 100k': 75000,
        'até 100k': 75000,
        'Até 200k': 150000,
        'até 200k': 150000,
        '+500k': 750000,
      };

      const totalPotential = leads.reduce((sum, lead) => {
        const potential = lead.fat_deposito ? potentialMap[lead.fat_deposito] || 0 : 0;
        return sum + potential;
      }, 0);

      return totalPotential;
    },
  });
};

// Buscar estatísticas de status com filtros
export const useStatusStats = (filters?: { tag?: string; startDate?: Date; endDate?: Date }) => {
  return useQuery({
    queryKey: ['power-lpbr-status-stats', filters],
    queryFn: async () => {
      let query = supabase.from('power_lpbr').select('status');

      // Aplicar filtro de tag
      if (filters?.tag && filters.tag !== 'all') {
        query = query.eq('tag', filters.tag);
      }

      // Aplicar filtro de data
      if (filters?.startDate) {
        query = query.gte('created_at', startOfDay(filters.startDate).toISOString());
      }
      if (filters?.endDate) {
        query = query.lte('created_at', endOfDay(filters.endDate).toISOString());
      } else if (filters?.startDate) {
        // Se só tem data inicial, vai até hoje
        query = query.lte('created_at', endOfDay(new Date()).toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      const leads = data as PowerLPBR[];

      // Contar leads por status
      const statusCounts = leads.reduce((acc, lead) => {
        const status = lead.status || 'Sem status';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const totalLeads = leads.length;

      // Definir cores para cada status
      const statusColors: Record<string, string> = {
        'LEADS CAPTADOS': '#3b82f6', // azul
        'CONVERSAS INICIADAS': '#06b6d4', // ciano
        'NÃO QUALIFICADOS': '#ef4444', // vermelho
        'QUALIFICADOS': '#10b981', // verde
        'AGENDADOS': '#8b5cf6', // roxo
        'NOSHOW': '#f97316', // laranja escuro
        'FOLLOWUP': '#f59e0b', // laranja
        'FECHADOS': '#059669', // verde escuro
        'EM OPERAÇÃO': '#14b8a6', // teal
        'LEAD QUENTE DESCARTADO': '#dc2626', // vermelho escuro
        'AFILIADOS QUE DESISTIRAM APÓS O FECHAMENTO': '#991b1b', // vermelho muito escuro
        'Sem status': '#6b7280', // cinza
      };

      // Criar array de resultados
      const result = Object.entries(statusCounts)
        .map(([status, count]) => ({
          status,
          count,
          percentage: totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0,
          color: statusColors[status] || '#6b7280',
        }))
        .sort((a, b) => b.count - a.count);

      return result;
    },
  });
};
