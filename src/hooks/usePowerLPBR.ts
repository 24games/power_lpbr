import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { PowerLPBR, LeadStats, TagCount, DailyLeadCount } from '@/types/power-lpbr';
import { format, subDays, parseISO } from 'date-fns';

// Buscar todos os leads
export const useLeads = () => {
  return useQuery({
    queryKey: ['power-lpbr-leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('power_lpbr')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as PowerLPBR[];
    },
  });
};

// Buscar estatísticas dos leads
export const useLeadStats = () => {
  return useQuery({
    queryKey: ['power-lpbr-stats'],
    queryFn: async () => {
      const { data: leads, error } = await supabase
        .from('power_lpbr')
        .select('*');

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

// Buscar contagem de leads por tag
export const useLeadsByTag = () => {
  return useQuery({
    queryKey: ['power-lpbr-by-tag'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('power_lpbr')
        .select('tag');

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

// Buscar evolução de leads nos últimos 30 dias
export const useDailyLeads = (days: number = 30) => {
  return useQuery({
    queryKey: ['power-lpbr-daily', days],
    queryFn: async () => {
      const startDate = subDays(new Date(), days);
      
      const { data, error } = await supabase
        .from('power_lpbr')
        .select('created_at')
        .gte('created_at', startDate.toISOString());

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
      for (let i = days - 1; i >= 0; i--) {
        const date = subDays(new Date(), i);
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

// Calcular potencial total estimado
export const useTotalPotential = () => {
  return useQuery({
    queryKey: ['power-lpbr-potential'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('power_lpbr')
        .select('fat_deposito');

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
