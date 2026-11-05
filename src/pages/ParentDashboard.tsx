import { Check, LogOut, RotateCcw, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useInitiatives, useReviewInitiative } from "@/hooks/useFamilyApp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function ParentDashboard() {
  const { username, signOut } = useAuth();
  const { data: pending } = useInitiatives(true);
  const review = useReviewInitiative();
  const act = (id: string, decision: "aprovado" | "recusado" | "correcao", minutes?: number) => review.mutate({ id, decision, minutes }, { onSuccess: () => toast.success("Registro revisado."), onError: (e) => toast.error(e.message) });
  return <main className="min-h-screen bg-background pb-10"><div className="max-w-md mx-auto px-4 py-6 space-y-4">
    <header className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Painel da responsável</p><h1 className="text-2xl font-bold">{username || "Mãe"} 👩</h1></div><Button variant="ghost" size="icon" onClick={signOut}><LogOut className="size-5" /></Button></header>
    <Card><CardHeader><CardTitle className="text-base">Aguardando aprovação ({pending?.length ?? 0})</CardTitle></CardHeader><CardContent className="space-y-3">{pending?.length ? pending.map((item) => <div key={item.id} className="rounded-xl border p-3 space-y-3"><div className="flex justify-between gap-3"><div><p className="font-semibold">{item.initiative_activities?.emoji} {item.initiative_activities?.name}</p>{item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}</div><span className="font-bold text-primary">+{item.proposed_minutes} min</span></div><div className="grid grid-cols-3 gap-2"><Button size="sm" onClick={() => act(item.id, "aprovado", item.proposed_minutes)}><Check className="size-4"/>Aprovar</Button><Button size="sm" variant="outline" onClick={() => act(item.id, "correcao")}><RotateCcw className="size-4"/>Corrigir</Button><Button size="sm" variant="destructive" onClick={() => act(item.id, "recusado")}><X className="size-4"/>Recusar</Button></div></div>) : <p className="text-sm text-muted-foreground text-center py-6">Nada aguardando aprovação.</p>}</CardContent></Card>
    <Card><CardHeader><CardTitle className="text-base">Próximas etapas</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground space-y-1"><p>• Responsabilidades habituais</p><p>• Acompanhamento escolar diário</p><p>• Registro de uso do tempo de tela</p><p>• Resumo semanal</p></CardContent></Card>
  </div></main>;
}
