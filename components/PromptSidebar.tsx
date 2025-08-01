'use client';

import React, { useState } from 'react';
import { Prompt } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Edit2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PromptSidebarProps {
  prompts: Prompt[];
  currentPromptId: string;
  onSelectPrompt: (id: string) => void;
  onCreatePrompt: (name: string) => void;
  onDeletePrompt: (id: string) => void;
  onUpdatePrompt: (updates: Partial<Prompt> & { id: string }) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function PromptSidebar({
  prompts,
  currentPromptId,
  onSelectPrompt,
  onCreatePrompt,
  onDeletePrompt,
  onUpdatePrompt,
  isOpen,
  onToggle,
}: PromptSidebarProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPromptName, setNewPromptName] = useState('');
  const [editingId, setEditingId] = useState<string>('');
  const [editingName, setEditingName] = useState('');

  const handleCreate = () => {
    if (newPromptName.trim()) {
      onCreatePrompt(newPromptName.trim());
      setNewPromptName('');
      setShowCreateForm(false);
    }
  };

  const handleRename = (id: string) => {
    if (editingName.trim()) {
      onUpdatePrompt({ id, name: editingName.trim() });
      setEditingId('');
      setEditingName('');
    }
  };

  const startEditing = (prompt: Prompt) => {
    setEditingId(prompt.id);
    setEditingName(prompt.name);
  };

  return (
    <>
      <div
        className={`bg-card border-r border-border transition-all duration-300 ${
          isOpen ? 'w-80' : 'w-0'
        } overflow-hidden`}
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Prompts</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>

          {showCreateForm ? (
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Prompt name"
                value={newPromptName}
                onChange={(e) => setNewPromptName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                autoFocus
              />
              <div className="flex space-x-2">
                <Button onClick={handleCreate} className="flex-1">
                  Create
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewPromptName('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => setShowCreateForm(true)} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              New Prompt
            </Button>
          )}
        </div>

        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="p-4 space-y-2">
            {prompts.map((prompt) => (
              <Card
                key={prompt.id}
                className={`cursor-pointer transition-colors ${
                  prompt.id === currentPromptId
                    ? 'ring-2 ring-primary'
                    : 'hover:bg-accent'
                }`}
                onClick={() => onSelectPrompt(prompt.id)}
              >
                <CardContent className="p-3">
                  {editingId === prompt.id ? (
                    <Input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRename(prompt.id);
                        if (e.key === 'Escape') {
                          setEditingId('');
                          setEditingName('');
                        }
                      }}
                      onBlur={() => handleRename(prompt.id)}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-foreground">
                          {prompt.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(prompt.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(prompt);
                          }}
                          className="h-8 w-8"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              confirm(
                                'Are you sure you want to delete this prompt?',
                              )
                            ) {
                              onDeletePrompt(prompt.id);
                            }
                          }}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {prompts.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No prompts yet. Create your first prompt to get started.
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {!isOpen && (
        <div className=" fixed left-0 pl-4 top-4 z-10 group cursor-pointer ">
          <Button
            onClick={onToggle}
            className=" opacity-40 group-hover:opacity-100 transition-all duration-300 -translate-x-8 group-hover:translate-x-0 "
            size="icon"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </>
  );
}
