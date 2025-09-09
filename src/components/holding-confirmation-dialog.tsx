
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
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
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Dictionary } from '@/lib/dictionaries';

interface HoldingConfirmationDialogProps {
  dictionary: Dictionary['holdingProcessor'];
}

export function HoldingConfirmationDialog({ dictionary }: HoldingConfirmationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const formSchema = z.object({
    remarks: z.string().min(1, { message: dictionary.dialog.remarksRequired }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      remarks: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Processing confirmed with remarks:", values.remarks);
    // In a real app, you would submit this data to a server
    
    setIsOpen(false); // Close the dialog
    form.reset(); // Reset form
    toast({
      title: dictionary.dialog.toastSuccessTitle,
      description: dictionary.dialog.toastSuccessDescription,
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>{dictionary.confirmProcessButton}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{dictionary.dialog.title}</DialogTitle>
          <DialogDescription>{dictionary.dialog.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.dialog.remarksLabel}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={dictionary.dialog.remarksPlaceholder}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">{dictionary.dialog.cancelButton}</Button>
                </DialogClose>
                <Button type="submit">{dictionary.dialog.submitButton}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
