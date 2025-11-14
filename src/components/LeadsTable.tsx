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
import { PowerLPBR } from "@/types/power-lpbr";
import { format, parseISO } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  leads: PowerLPBR[];
  onDelete?: (id: number) => void;
}

const LeadsTable = ({ leads, onDelete }: LeadsTableProps) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'dd/MM/yyyy HH:mm');
    } catch {
      return 'N/A';
    }
  };
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
              <TableCell className="font-medium">{lead.nome || 'N/A'}</TableCell>
              <TableCell className="text-muted-foreground">{lead.email || 'N/A'}</TableCell>
              <TableCell className="text-muted-foreground">{lead.telefone || 'N/A'}</TableCell>
              <TableCell className="text-primary font-semibold">{lead.fat_deposito || 'N/A'}</TableCell>
              <TableCell className="text-muted-foreground">{lead.expertise || 'N/A'}</TableCell>
              <TableCell>
                <span className="px-2 py-1 rounded text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  {lead.tag || 'Sem tag'}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">{formatDate(lead.created_at)}</TableCell>
              <TableCell className="text-right">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja deletar o lead <strong>{lead.nome || 'sem nome'}</strong>?
                        Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete?.(lead.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Deletar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadsTable;
