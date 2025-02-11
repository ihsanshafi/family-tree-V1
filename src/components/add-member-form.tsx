'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FamilyMember, RelationshipType, Gender } from '@/types';
import { Form } from './ui/form';
import { FormInput } from './ui/form-input';
import { FormSelect } from './ui/form-select';
import { FormDatePicker } from './ui/form-date-picker';
import { Button } from './ui/button';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  gender: z.enum(['male', 'female', 'other']),
  dateOfBirth: z.date({
    required_error: "A date of birth is required",
  }),
  dateOfDeath: z.date().optional(),
  relationship: z.enum(['spouse', 'parent', 'child']).optional(),
});

export function AddMemberForm({
  onSubmit,
  selectedMember,
  isRoot,
  relationshipLabel
}: {
  onSubmit: (member: FamilyMember, relationship?: RelationshipType) => void;
  selectedMember?: FamilyMember;
  isRoot?: boolean;
  relationshipLabel?: string;
}) {
  const generateId = () => {
    if (typeof window !== 'undefined' && window.crypto) {
      return window.crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      gender: 'male',
      relationship: isRoot ? undefined : 'child',
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const newMember: FamilyMember = {
      id: generateId(),
      name: values.name,
      gender: values.gender as Gender,
      dateOfBirth: values.dateOfBirth.toISOString(),
      dateOfDeath: values.dateOfDeath?.toISOString(),
      parents: selectedMember?.parents || [],
      children: [],
      relationship: values.relationship as RelationshipType,
    };
    
    onSubmit(newMember, values.relationship as RelationshipType | undefined);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormInput
          control={form.control}
          name="name"
          label="Full Name"
          placeholder="Enter full name"
          description="Legal name as it should appear in the tree"
        />

        <FormSelect
          control={form.control}
          name="gender"
          label="Gender"
          items={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
          ]}
        />

        <FormDatePicker
          control={form.control}
          name="dateOfBirth"
          label="Date of Birth"
        />

        <FormDatePicker
          control={form.control}
          name="dateOfDeath"
          label="Date of Death"
          optional
        />

        {!isRoot && (
          <FormSelect
            control={form.control}
            name="relationship"
            label={relationshipLabel || 'Relationship to Selected Member'}
            items={[
              { value: 'spouse', label: 'Spouse/Partner' },
              { value: 'parent', label: relationshipLabel || 'Parent' },
              { value: 'child', label: 'Child' },
            ]}
            description="How this person relates to the selected family member"
          />
        )}

        <div className="flex justify-end gap-4">
          <Button 
            type="submit"
            className="mt-4"
          >
            {isRoot ? 'Create Family Member' : 'Add Relative'}
          </Button>
        </div>
      </form>
    </Form>
  );
}