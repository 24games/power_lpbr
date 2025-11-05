import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  potential: string;
  expertise: string;
  tag: string;
  date: string;
}

interface LeadsTableProps {
  leads: Lead[];
  onDelete?: (id: string) => void;
}

const LeadsTable = ({ leads, onDelete }: LeadsTableProps) => {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border">
            <TableHead className="text-foreground">Nome</TableHead>
            <TableHead className="text-foreground">Email</TableHead>
            <TableHead className="text-foreground">Telefone</TableHead>
            <TableHead className="text-foreground">Potencial</TableHead>
            <TableHead className="text-foreground">Expertise</TableHead>
            <TableHead className="text-foreground">Tag</TableHead>
            <TableHead className="text-foreground">Data</TableHead>
            <TableHead className="text-foreground text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead, index) => (
            <TableRow
              key={lead.id}
              className={index % 2 === 0 ? "bg-card/50" : "bg-card"}
            >
              <TableCell className="font-medium">{lead.name}</TableCell>
              <TableCell className="text-muted-foreground">{lead.email}</TableCell>
              <TableCell className="text-muted-foreground">{lead.phone}</TableCell>
              <TableCell className="text-primary font-semibold">{lead.potential}</TableCell>
              <TableCell className="text-muted-foreground">{lead.expertise}</TableCell>
              <TableCell>
                <span className="px-2 py-1 rounded text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  {lead.tag}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">{lead.date}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => onDelete?.(lead.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadsTable;
