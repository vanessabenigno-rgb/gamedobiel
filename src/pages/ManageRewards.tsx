import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import { useAllRewards, useCreateReward, useUpdateReward, useDeleteReward } from "@/hooks/useRewards";
import { toast } from "sonner";

function RewardForm({
  initial,
  onSubmit,
  submitLabel,
  loading,
}: {
  initial?: { name: string; points_required: number; type: string };
  onSubmit: (data: { name: string; points_required: number; type: string }) => void;
  submitLabel: string;
  loading: boolean;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [points, setPoints] = useState(initial?.points_required || 50);
  const [type, setType] = useState(initial?.type || "individual");

  return (
    <div className="space-y-4">
      <div>
        <Label>Nome</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: 1h extra de videogame" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label>Pontos</Label>
          <Input type="number" value={points} onChange={(e) => setPoints(Number(e.target.value))} min={1} />
        </div>
        <div>
          <Label>Tipo</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="coletiva">Coletiva</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button
        onClick={() => onSubmit({ name: name.trim(), points_required: points, type })}
        disabled={loading || !name.trim()}
        className="w-full gradient-primary font-bold"
      >
        {loading ? "Salvando..." : submitLabel}
      </Button>
    </div>
  );
}

export default function ManageRewards() {
  const navigate = useNavigate();
  const { data: rewards, isLoading } = useAllRewards();
  const createReward = useCreateReward();
  const updateReward = useUpdateReward();
  const deleteReward = useDeleteReward();
  const [createOpen, setCreateOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const handleCreate = (data: { name: string; points_required: number; type: string }) => {
    createReward.mutate(data, {
      onSuccess: () => {
        toast.success("Recompensa criada!");
        setCreateOpen(false);
      },
    });
  };

  const handleUpdate = (id: string, data: { name: string; points_required: number; type: string }) => {
    updateReward.mutate({ id, ...data }, {
      onSuccess: () => {
        toast.success("Recompensa atualizada!");
        setEditId(null);
      },
    });
  };

  const handleToggleActive = (id: string, active: boolean) => {
    updateReward.mutate({ id, active });
  };

  const handleDelete = (id: string) => {
    deleteReward.mutate(id, {
      onSuccess: () => toast.success("Recompensa excluída!"),
    });
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/mae")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-extrabold text-xl">🎁 Gerenciar Recompensas</h1>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="w-full gradient-primary font-bold">
              <Plus className="w-4 h-4 mr-2" /> Nova Recompensa
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>🆕 Criar Recompensa</DialogTitle>
            </DialogHeader>
            <RewardForm onSubmit={handleCreate} submitLabel="Criar" loading={createReward.isPending} />
          </DialogContent>
        </Dialog>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Carregando...</div>
        ) : (
          <div className="space-y-3">
            {rewards?.map((r) => (
              <Card key={r.id} className={!r.active ? "opacity-50" : ""}>
                <CardContent className="py-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <p className="font-bold text-sm">{r.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold text-primary">{r.points_required} pts</span>
                        <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full">
                          {r.type === "individual" ? "Individual" : "Coletiva"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Switch
                        checked={r.active}
                        onCheckedChange={(checked) => handleToggleActive(r.id, checked)}
                      />
                      <Dialog open={editId === r.id} onOpenChange={(open) => setEditId(open ? r.id : null)}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-sm">
                          <DialogHeader>
                            <DialogTitle>✏️ Editar Recompensa</DialogTitle>
                          </DialogHeader>
                          <RewardForm
                            initial={{ name: r.name, points_required: r.points_required, type: r.type }}
                            onSubmit={(data) => handleUpdate(r.id, data)}
                            submitLabel="Salvar"
                            loading={updateReward.isPending}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDelete(r.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {rewards?.length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-4">
                Nenhuma recompensa cadastrada.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
