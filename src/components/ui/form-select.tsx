'use client';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

export function FormSelect({
  control,
  name,
  label,
  items,
  placeholder = 'Select an option',
  description,
}: {
  control: any;
  name: string;
  label: string;
  items: { value: string; label: string }[];
  placeholder?: string;
  description?: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}