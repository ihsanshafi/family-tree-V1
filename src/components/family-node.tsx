'use client';
import { FamilyMember } from '@/types';
import { Button } from './ui/button';

export function FamilyNode({
  member,
  onSelect,
  isRoot,
  generationColor,
}: {
  member: FamilyMember;
  onSelect: (id: string) => void;
  isRoot?: boolean;
  generationColor: string;
}) {
  return (
    <Button
      variant="outline"
      onClick={() => onSelect(member.id)}
      style={{ backgroundColor: generationColor }}
      className={`flex flex-col items-center p-4 rounded-full transition-transform hover:scale-105 ${
        isRoot ? 'border-4 border-primary' : ''
      }`}
    >
      <span className="font-bold text-base">{member.name}</span>
      <span className="text-sm mt-1">
        {new Date(member.dateOfBirth).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
        })}
        {member.dateOfDeath && ' - ' + new Date(member.dateOfDeath).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
        })}
      </span>
      <span className="text-xs mt-1 capitalize">{member.gender}</span>
    </Button>
  );
}