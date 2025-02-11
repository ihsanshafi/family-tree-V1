export type RelationshipType = 'spouse' | 'parent' | 'child';
export type Gender = 'male' | 'female' | 'other';

export interface FamilyMember {
  id: string;
  name: string;
  gender: Gender;
  dateOfBirth: string;
  dateOfDeath?: string;
  relationship?: RelationshipType;
  parents: string[];
  children: string[];
  spouse?: string;
}