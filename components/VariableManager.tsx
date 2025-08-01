'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { VariableSet } from '@/lib/types';
import { extractVariables } from '@/lib/template-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings, X, Copy } from 'lucide-react';

interface VariableManagerProps {
  template: string;
  variableSets: VariableSet[];
  onVariableSetsChange: (sets: VariableSet[]) => void;
}

export default function VariableManager({
  template,
  variableSets,
  onVariableSetsChange,
}: VariableManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [extractedVars, setExtractedVars] = useState<string[]>([]);
  const [editingSetId, setEditingSetId] = useState<string | null>(null);
  const [newSetName, setNewSetName] = useState('');

  useEffect(() => {
    const vars = extractVariables(template);
    setExtractedVars(vars);
  }, [template]);

  const createNewSet = () => {
    const newSet: VariableSet = {
      id: Date.now().toString(),
      name: newSetName || `Set ${variableSets.length + 1}`,
      variables: extractedVars.reduce(
        (acc, varName) => {
          acc[varName] = '';
          return acc;
        },
        {} as Record<string, string>,
      ),
    };

    onVariableSetsChange([...variableSets, newSet]);
    setEditingSetId(newSet.id);
    setNewSetName('');
  };

  const updateVariableSet = (setId: string, updates: Partial<VariableSet>) => {
    const updatedSets = variableSets.map((set) =>
      set.id === setId ? { ...set, ...updates } : set,
    );

    // console.log(updatedSets);

    onVariableSetsChange(updatedSets);
  };

  const deleteVariableSet = (setId: string) => {
    const updatedSets = variableSets.filter((set) => set.id !== setId);
    onVariableSetsChange(updatedSets);
  };

  const duplicateVariableSet = (set: VariableSet) => {
    const newSet: VariableSet = {
      ...set,
      id: Date.now().toString(),
      name: `${set.name} (Copy)`,
    };
    onVariableSetsChange([...variableSets, newSet]);
  };

  const updateVariableValue = (
    setId: string,
    varName: string,
    value: string,
  ) => {
    updateVariableSet(setId, {
      variables: {
        ...variableSets.find((s) => s.id === setId)?.variables,
        [varName]: value,
      },
    });
  };

  const editingSet = useMemo(() => {
    if (!editingSetId) return;
    return variableSets.find((set) => set.id === editingSetId);
  }, [variableSets, editingSetId]);

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-medium">Variable Sets</h3>
          <Badge variant="secondary">{variableSets.length}</Badge>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
          <Settings className="w-4 h-4 mr-2" />
          Manage Variables
        </Button>
      </div>

      {extractedVars.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-muted-foreground mb-2">
            Template Variables:
          </div>
          <div className="flex flex-wrap gap-1">
            {extractedVars.map((varName) => (
              <Badge key={varName} variant="outline" className="text-xs">
                {varName}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Manage Variable Sets</DialogTitle>
            <DialogDescription>
              Create and manage different sets of variables to test your prompt
              with various inputs.
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-4 h-[60vh]">
            {/* Left panel - Variable sets list */}
            <div className="w-1/3 border-r pr-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Variable Sets</h4>
                <Button
                  size="sm"
                  onClick={createNewSet}
                  disabled={extractedVars.length === 0}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Set
                </Button>
              </div>

              {extractedVars.length === 0 ? (
                <div className="text-sm text-muted-foreground text-center py-8">
                  Add variables to your template (e.g., {`{{ name }}`}) to
                  create variable sets.
                </div>
              ) : (
                <ScrollArea className="h-full -mx-4 ">
                  <div className="space-y-2 p-4 ">
                    {variableSets.map((set) => (
                      <Card
                        key={set.id}
                        className={`cursor-pointer transition-colors ${
                          editingSet?.id === set.id
                            ? 'ring-2 ring-primary'
                            : 'hover:bg-accent'
                        }`}
                        onClick={() => setEditingSetId(set.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm truncate">
                                {set.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {Object.keys(set.variables).length} variables
                              </div>
                            </div>
                            <div className="flex space-x-1 ml-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  duplicateVariableSet(set);
                                }}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();

                                  deleteVariableSet(set.id);
                                  if (editingSet?.id === set.id) {
                                    setEditingSetId(null);
                                  }
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>

            {/* Right panel - Variable set editor */}
            <div className="flex-1">
              {editingSet ? (
                <div className="h-full flex flex-col">
                  <div className="mb-4">
                    <Input
                      value={editingSet.name}
                      onChange={(e) =>
                        updateVariableSet(editingSet.id, {
                          name: e.target.value,
                        })
                      }
                      placeholder="Set name"
                      className="font-medium"
                    />
                  </div>

                  <ScrollArea className="flex-1">
                    <div className="space-y-4">
                      {extractedVars.map((varName) => (
                        <div key={varName}>
                          <label className="block text-sm font-medium mb-2">
                            {varName}
                          </label>
                          <Input
                            value={editingSet.variables[varName] || ''}
                            onChange={(e) =>
                              updateVariableValue(
                                editingSet.id,
                                varName,
                                e.target.value,
                              )
                            }
                            placeholder={`Enter value for ${varName}`}
                          />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  {variableSets.length === 0
                    ? 'Create a variable set to get started'
                    : 'Select a variable set to edit'}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
