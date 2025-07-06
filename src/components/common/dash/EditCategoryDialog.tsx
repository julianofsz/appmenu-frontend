import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import { updateCategory } from '@/services/categoryService';
import { AxiosError } from 'axios';
import { showMassage } from '@/adapters/showMassage';

interface EditCategoryDialogProps {
  categoryId: string;
  currentName: string;
  onUpdate: () => void; 
  children: React.ReactNode; 
}

export function EditCategoryDialog({ categoryId, currentName, onUpdate, children }: EditCategoryDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newName, setNewName] = useState(currentName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!newName.trim()) {
      setError("O nome não pode ficar em branco.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      await updateCategory(categoryId, { nome: newName });
      showMassage.success("Categoria atualizada com sucesso!");
      onUpdate(); 
      setIsOpen(false); 
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        setError(err.response.data.message);
      } else {
        setError("Ocorreu um erro inesperado.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md bg-white text-gray-900 border-gray-200">
        <DialogHeader>
          <DialogTitle>Editar Categoria</DialogTitle>
          <DialogDescription>
            Digite o novo nome para a categoria "{currentName}".
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="new-category-name">Novo Nome</Label>
          <Input
            id="new-category-name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="mt-2"
          />
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="destructive">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={isSubmitting} className=' bg-amber-500 text-gray-900 font-semibold hover:bg-amber-600'>
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}