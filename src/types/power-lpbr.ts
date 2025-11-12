export interface PowerLPBR {
  id: number;
  created_at: string;
  nome: string | null;
  email: string | null;
  telefone: string | null;
  fat_deposito: string | null;
  tag: string | null;
  id_trello: string | null;
  instagram: string | null;
  expertise: string | null;
  status: string | null;
}

export interface LeadStats {
  totalLeads: number;
  bestTag: {
    name: string;
    count: number;
  };
  worstTag: {
    name: string;
    count: number;
  };
  topExpertise: {
    name: string;
    count: number;
  };
  averageLeadsPerDay: number;
}

export interface TagCount {
  tag: string;
  count: number;
}

export interface DailyLeadCount {
  date: string;
  count: number;
}
