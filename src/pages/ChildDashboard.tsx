import { useState } from "react";
import { LogOut, Plus, Timer } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useActivities, useInitiatives, useScreenTime, useSubmitInitiative } from "@/hooks/useFamilyApp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ChildDashboard() {
  const { username, signOut } = useAuth();
  const { data: screen } = useScreenTime();
  const { data: activities } = useActivities();
  const { data: initiatives } = useInitiatives();
  const submit = useSubmitInitiative();
  const [activityId, setActivityId] = useState("");
  const [description, setDescription] = useState("");
  const selected = activities?.find((item) => item.id === activityId);

  function send() {
    if (!selected) return;
    submit.mutate({ activityId: selected.id, description, minutes: selected.minutes }, { onSuccess: () => { setActivityId(""); setDescription(""); toast.success("Iniciativa enviada para aprovação!"); }, onError: (e) => toast.error(e.message) });
  }

  return <main className="min-h-screen bg-background pb-10">
    <div className="max-w-md mx-auto px-4 py-6 space-y-4">
      <header className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Olá,</p><h1 className="text-2xl font-bold">{username || "Biel"} 👋</h1></div><Button variant="ghost" size="icon" onClick={signOut}><LogOut className="size-5" /></Button></header>
      <Card className="border-primary/30 bg-primary/5"><CardContent className="pt-6 text-center"><Timer className="size-7 mx-auto text-primary mb-2"/><p className="text-sm text-muted-foreground">Tempo disponível hoje</p><p className="text-5xl font-black text-primary">{screen?.available ?? 0}<span className="text-lg ml-1">min</span></p><p className="text-xs text-muted-foreground mt-2">{screen?.settings.guaranteed_minutes ?? 0} garantidos + {screen?.extra ?? 0} extras − {screen?.used ?? 0} usados</p></CardContent></Card>
      <Card><CardHeader><CardTitle className="text-base flex gap-2"><Plus className="size-5"/>Registrar iniciativa</CardTitle></CardHeader><CardContent className="space-y-3"><Select value={activityId} onValueChange={setActivityId}><SelectTrigger><SelectValue placeholder="O que você fez espontaneamente?" /></SelectTrigger><SelectContent>{activities?.map((a) => <SelectItem key={a.id} value={a.id}>{a.emoji} {a.name} · +{a.minutes} min</SelectItem>)}</SelectContent></Select><Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Conte um detalhe (opcional)"/><Button className="w-full" disabled={!selected || submit.isPending} onClick={send}>Enviar para a mãe aprovar</Button></CardContent></Card>
      <Card><CardHeader><CardTitle className="text-base">Iniciativas recentes</CardTitle></CardHeader><CardContent className="space-y-2">{initiatives?.length ? initiatives.slice(0, 8).map((item) => <div key={item.id} className="flex items-center justify-between rounded-lg bg-muted p-3"><span className="text-sm">{item.initiative_activities?.emoji} {item.initiative_activities?.name}</span><span className="text-xs font-semibold">{item.status === "aprovado" ? `+${item.approved_minutes} min` : item.status}</span></div>) : <p className="text-sm text-muted-foreground">Nenhuma iniciativa registrada ainda.</p>}</CardContent></Card>
    </div>
  </main>;
}
