'use client';
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTitle} from './ui/dialog';
import { AddMemberForm } from './add-member-form';
import html2canvas from 'html2canvas';
import { FamilyMember, RelationshipType } from '@/types';
import { FamilyNode } from './family-node';

const generateGenerationColor = (generation: number) => {
  const hue = (generation * 60) % 360;
  return `hsl(${hue}, 70%, 85%)`;
};

const SPOUSE_COLOR = 'hsl(330, 70%, 85%)';

export function FamilyTree() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [rootId, setRootId] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddingGrandfather, setIsAddingGrandfather] = useState(false);
  const treeContainerRef = useRef<HTMLDivElement>(null);
  const [treeDimensions, setTreeDimensions] = useState({ width: 0, height: 0 });

  const nodeMap = useMemo(() => new Map<string, FamilyMember>(
    members.map(member => [member.id, member])
  ), [members]);

  useEffect(() => {
    if (treeContainerRef.current) {
      const { scrollWidth, scrollHeight } = treeContainerRef.current;
      setTreeDimensions({ width: scrollWidth, height: scrollHeight });
    }
  }, [members]);

  const handleAddMember = useCallback((newMember: FamilyMember, relationship?: RelationshipType) => {
    setMembers(prev => {
      const parentIndex = prev.findIndex(m => m.id === selectedMember);
      const parent = parentIndex >= 0 ? prev[parentIndex] : null;
      
      if (!parent && prev.length === 0) {
        setRootId(newMember.id);
        if (isAddingGrandfather) {
          setIsAddingGrandfather(false);
          setTimeout(() => {
            setSelectedMember(newMember.id);
            setIsDialogOpen(true);
          }, 0);
        }
        return [newMember];
      }

      const updatedMembers = [...prev];
      
      if (parent) {
        const updatedParent = { ...parent };
        
        switch(relationship) {
          case 'child':
            updatedParent.children = [...updatedParent.children, newMember.id];
            updatedMembers[parentIndex] = updatedParent;
            newMember.parents = [...newMember.parents, parent.id];
            break;
            
          case 'spouse':
            updatedParent.spouse = newMember.id;
            updatedMembers[parentIndex] = updatedParent;
            newMember.spouse = parent.id;
            break;
            
          case 'parent':
            newMember.children = [...newMember.children, parent.id];
            updatedParent.parents = [...updatedParent.parents, newMember.id];
            updatedMembers[parentIndex] = updatedParent;
            break;
        }
      }

      return [...updatedMembers, newMember];
    });
    setIsDialogOpen(false);
  }, [selectedMember, isAddingGrandfather]);

  const handleDownload = async () => {
    if (treeContainerRef.current) {
      const canvas = await html2canvas(treeContainerRef.current, {
        width: treeDimensions.width,
        height: treeDimensions.height,
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        useCORS: true,
      });
      
      const link = document.createElement('a');
      link.download = 'family-tree.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const renderNode = (memberId: string, depth: number = 0, isSpouse: boolean = false) => {
    const member = nodeMap.get(memberId);
    if (!member) return null;

    return (
      <div 
        key={`node-${member.id}-${depth}`} 
        className="flex flex-col items-center relative my-4"
      >
        {member.spouse && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gray-300" />
        )}

        <div className="flex items-center gap-4 relative">
          {member.spouse && (
            <>
              {renderNode(member.spouse, depth, true)}
              <div className="w-8 h-1 bg-gray-300" />
            </>
          )}
          
          <FamilyNode
            member={member}
            onSelect={(id) => {
              setSelectedMember(id);
              setIsDialogOpen(true);
            }}
            isRoot={member.id === rootId}
            generationColor={isSpouse ? SPOUSE_COLOR : generateGenerationColor(depth)}
          />
        </div>

        {member.children.length > 0 && (
          <div className="mt-8 flex gap-8 relative">
            {member.children.map((childId, index) => (
              <div key={`child-${childId}-${index}`} className="relative">
                <div className="absolute left-1/2 -top-4 w-px h-4 bg-gray-300" />
                {index > 0 && (
                  <div className="absolute left-0 right-0 top-0 h-px bg-gray-300" 
                    style={{ top: '-16px' }}
                  />
                )}
                {renderNode(childId, depth + 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const startWithGrandfather = () => {
    setIsAddingGrandfather(true);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Family Tree Builder</h1>
        <Button onClick={handleDownload}>
          Download Tree
        </Button>
      </div>

      <div className="border rounded-lg overflow-auto">
        <div 
          id="family-tree"
          ref={treeContainerRef}
          className="relative p-8 bg-white"
          style={{
            minWidth: '100vw',
            minHeight: '100vh',
            width: 'max-content',
            height: 'max-content'
          }}
        >
          {rootId ? renderNode(rootId) : (
            <div className="flex flex-col gap-4 items-center justify-center w-[900px] h-[400px]">
              <Button 
                onClick={() => setIsDialogOpen(true)}
                className="text-lg px-8 py-4"
              >
                Start with Yourself
              </Button>
              <span className="text-muted-foreground">or</span>
              <Button 
                variant="outline" 
                onClick={startWithGrandfather}
                className="text-lg px-8 py-4"
              >
                Start with Grandfather
              </Button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
            <DialogTitle/>
          <AddMemberForm
            onSubmit={handleAddMember}
            selectedMember={selectedMember ? nodeMap.get(selectedMember) : undefined}
            isRoot={!rootId}
            relationshipLabel={isAddingGrandfather ? 'Father' : undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}