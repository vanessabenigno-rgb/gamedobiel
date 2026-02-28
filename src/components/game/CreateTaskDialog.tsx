import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export function CreateTaskDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("📋");
  const [points, setPoints] = useState(10);
  const [category, setCategory] = useState("geral");
  const [weekdays, setWeekdays] = useState("all");
  const [essential, setEssential] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    await supabase.from("tasks").insert({
      name: name.trim(),
      emoji,
      points,
      category,
      weekdays,
      essential,
    });
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    queryClient.invalidateQueries({ queryKey: ["daily_tasks"] });
    setName("");
    setEmoji("📋");
    setPoints(10);
    setCategory("geral");
    setWeekdays("all");
    setEssential(false);
    setLoading(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full gradient-primary font-bold">
          <Plus className="w-4 h-4 mr-2" /> Nova Missão
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>🆕 Criar Nova Tarefa</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-[60px_1fr] gap-2">
            <div>
              <Label>Emoji</Label>
              <Input value={emoji} onChange={(e) => setEmoji(e.target.value)} className="text-center text-xl" />
            </div>
            <div>
              <Label>Nome</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome da tarefa" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Pontos</Label>
              <Input type="number" value={points} onChange={(e) => setPoints(Number(e.target.value))} min={1} />
            </div>
            <div>
              <Label>Categoria</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="geral">Geral</SelectItem>
                  <SelectItem value="escola">Escola</SelectItem>
                  <SelectItem value="higiene">Higiene</SelectItem>
                  <SelectItem value="casa">Casa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Periodicidade</Label>
            <Select value={weekdays} onValueChange={setWeekdays}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os dias</SelectItem>
                <SelectItem value="weekdays">Seg-Sex</SelectItem>
                <SelectItem value="weekend">Fim de semana</SelectItem>
                <SelectItem value="once">Única vez</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={essential} onCheckedChange={setEssential} />
            <Label>Tarefa essencial (obrigatória para "dia completo")</Label>
          </div>
          <Button onClick={handleSubmit} disabled={loading || !name.trim()} className="w-full gradient-primary font-bold">
            {loading ? "Criando..." : "Criar Tarefa"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
