import { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, FolderOpen } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
} from '@/components/ui/alert-dialog';
import { Category, type Batch } from '../backend';
import { CATEGORY_LABELS, CATEGORY_COLORS, generateId } from '../lib/utils';
import { useGetAllBatches, useCreateBatch, useUpdateBatch, useDeleteBatch } from '../hooks/useQueries';

const ALL_CATEGORIES = Object.values(Category);

interface BatchFormState {
  name: string;
  description: string;
  category: Category;
}

const defaultForm: BatchFormState = {
  name: '',
  description: '',
  category: Category.class6,
};

export default function BatchManagementSection() {
  const { data: batches = [], isLoading } = useGetAllBatches();
  const createBatch = useCreateBatch();
  const updateBatch = useUpdateBatch();
  const deleteBatch = useDeleteBatch();

  const [form, setForm] = useState<BatchFormState>(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Batch name is required');
      return;
    }
    try {
      if (editingId) {
        await updateBatch.mutateAsync({ id: editingId, ...form });
        toast.success('Batch updated successfully');
      } else {
        await createBatch.mutateAsync({ id: generateId(), ...form });
        toast.success('Batch created successfully');
      }
      setForm(defaultForm);
      setEditingId(null);
      setShowForm(false);
    } catch (err) {
      toast.error(editingId ? 'Failed to update batch' : 'Failed to create batch');
    }
  };

  const handleEdit = (batch: Batch) => {
    setForm({ name: batch.name, description: batch.description, category: batch.category });
    setEditingId(batch.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBatch.mutateAsync(id);
      toast.success('Batch deleted');
    } catch {
      toast.error('Failed to delete batch');
    }
  };

  const handleCancel = () => {
    setForm(defaultForm);
    setEditingId(null);
    setShowForm(false);
  };

  const isPending = createBatch.isPending || updateBatch.isPending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-heading font-bold text-foreground">Batch Management</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Create and manage course batches</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="gap-2 bg-primary text-primary-foreground">
            <Plus className="h-4 w-4" />
            New Batch
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              {editingId ? 'Edit Batch' : 'Create New Batch'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="batch-name">Batch Name *</Label>
                  <Input
                    id="batch-name"
                    placeholder="e.g., Class 9 Science Batch A"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="batch-category">Category *</Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => setForm({ ...form, category: v as Category })}
                  >
                    <SelectTrigger id="batch-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ALL_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {CATEGORY_LABELS[cat]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="batch-desc">Description</Label>
                <Textarea
                  id="batch-desc"
                  placeholder="Brief description of this batch..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending} className="gap-2">
                  {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingId ? 'Update Batch' : 'Create Batch'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Batch List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : batches.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FolderOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No batches yet</p>
          <p className="text-sm mt-1">Create your first batch to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.map((batch) => (
            <Card key={batch.id} className="border-border hover:border-primary/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm text-foreground line-clamp-1">{batch.name}</h3>
                  <Badge className={`text-xs shrink-0 ${CATEGORY_COLORS[batch.category]}`} variant="outline">
                    {CATEGORY_LABELS[batch.category]}
                  </Badge>
                </div>
                {batch.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{batch.description}</p>
                )}
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(batch)}
                    className="h-7 px-2 gap-1 text-xs"
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 gap-1 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Batch</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{batch.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(batch.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
