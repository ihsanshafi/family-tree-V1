'use client';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './form';
import { Input } from './input';

export function FormInput({
  control,
  name,
  label,
  placeholder,
  description,
}: {
  control: any;
  name: string;
  label: string;
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
          <FormControl>
            <Input placeholder={placeholder} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}