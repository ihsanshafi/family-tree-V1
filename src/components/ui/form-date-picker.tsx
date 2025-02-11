'use client';
import { ControllerRenderProps } from 'react-hook-form';
import { format } from 'date-fns';
import { CalendarIcon } from '@radix-ui/react-icons';
import { Button } from './button';
import { Calendar } from './calendar';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './form';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface FormDatePickerProps {
  control: any;
  name: string;
  label: string;
  optional?: boolean;
}

export function FormDatePicker({ control, name, label, optional }: FormDatePickerProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>
            {label}
            {optional && <span className="text-muted-foreground"> (optional)</span>}
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className="pl-3 text-left font-normal"
                >
                  {field.value ? (
                    format(field.value, 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) =>
                  date > new Date() || date < new Date('1900-01-01')
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormDescription>
            {name === 'dateOfBirth' ? 'Birth date' : 'Death date'}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}