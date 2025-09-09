
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import type { Dictionary } from '@/lib/dictionaries';
import { HelpCircle } from 'lucide-react';

interface InstructionsDialogProps {
  dictionary: Dictionary['instructionsDialog'];
}

export function InstructionsDialog({ dictionary }: InstructionsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
            <HelpCircle className="h-5 w-5" />
            <span className="sr-only">{dictionary.triggerButton}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dictionary.title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
            <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground">
                <li>{dictionary.step1}</li>
                <li>{dictionary.step2}</li>
            </ol>
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button type="button">{dictionary.closeButton}</Button>
            </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
