
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
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import type { Dictionary } from '@/lib/dictionaries';
import { ALL_ACTION_TYPES, type StockActionType } from '@/types';
import { Settings } from 'lucide-react';

interface ActionTypeManagementDialogProps {
  dictionary: Dictionary['holdingProcessor'];
  actionTypeDictionary: Dictionary['actionTypes'];
}

export function ActionTypeManagementDialog({ dictionary, actionTypeDictionary }: ActionTypeManagementDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const formSchema = z.object({
    actionTypes: z.array(z.string()).refine((value) => value.some((item) => item), {
      message: "You have to select at least one item.",
    }),
  });
  
  const defaultSelectedTypes = ALL_ACTION_TYPES;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      actionTypes: defaultSelectedTypes,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log("Selected action types:", data.actionTypes);
    // In a real app, you would submit this data to a server
    
    setIsOpen(false); // Close the dialog
    toast({
      title: dictionary.manageDialog.toastSuccessTitle,
      description: dictionary.manageDialog.toastSuccessDescription,
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto">
          <Settings className="mr-2 h-4 w-4" /> {dictionary.manageActionTypesButton}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{dictionary.manageDialog.title}</DialogTitle>
          <DialogDescription>{dictionary.manageDialog.description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="actionTypes"
              render={() => (
                <FormItem className="space-y-3">
                  {ALL_ACTION_TYPES.map((type) => (
                    <FormField
                      key={type}
                      control={form.control}
                      name="actionTypes"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={type}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(type)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, type])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== type
                                        )
                                      )
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {actionTypeDictionary[type as StockActionType]}
                            </FormLabel>
                          </FormItem>
                        )
                      }}
                    />
                  ))}
                </FormItem>
              )}
            />
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">{dictionary.manageDialog.cancelButton}</Button>
                </DialogClose>
                <Button type="submit">{dictionary.manageDialog.submitButton}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


    