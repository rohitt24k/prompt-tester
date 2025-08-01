'use client';

import React, { useState, useEffect } from 'react';
import {
  Prompt,
  PromptVersion,
  VariableSet,
  BatchAIOutputs,
} from '@/lib/types';
import {
  loadPrompts,
  savePrompts,
  loadVersions,
  saveVersions,
  loadVariableSets,
  saveVariableSets,
} from '@/lib/storage';
import PromptSidebar from './PromptSidebar';
import PromptEditor from './PromptEditor';
import OutputPanel from './OutputPanel';
import VersionPanel from './VersionPanel';

export default function PromptPlayground() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [currentPromptId, setCurrentPromptId] = useState<string>('');
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
  const [versions, setVersions] = useState<PromptVersion[]>([]);
  const [outputs, setOutputs] = useState<BatchAIOutputs[]>([]);
  const [promptVariableSets, setPromptVariableSets] = useState<
    Record<string, VariableSet[]>
  >({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [versionPanelOpen, setVersionPanelOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const savedPrompts = loadPrompts();
    const savedVersions = loadVersions();
    const savedVariableSets = loadVariableSets();

    setPrompts(savedPrompts);
    setVersions(savedVersions);
    setPromptVariableSets(savedVariableSets);

    if (savedPrompts.length > 0) {
      setCurrentPromptId(savedPrompts[0].id);
      setCurrentPrompt(savedPrompts[0]);
    }
  }, []);

  useEffect(() => {
    if (currentPromptId) {
      const prompt = prompts.find((p) => p.id === currentPromptId);
      setCurrentPrompt(prompt || null);
    }
  }, [currentPromptId, prompts]);

  const createPrompt = (name: string) => {
    const newPrompt: Prompt = {
      id: Date.now().toString(),
      name,
      template: '',
      variables: '{}',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedPrompts = [...prompts, newPrompt];
    setPrompts(updatedPrompts);
    savePrompts(updatedPrompts);
    setCurrentPromptId(newPrompt.id);
  };

  const updatePrompt = (updates: Partial<Prompt>) => {
    if (!currentPrompt) return;

    const updatedPrompt = {
      ...currentPrompt,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updatedPrompts = prompts.map((p) =>
      p.id === currentPrompt.id ? updatedPrompt : p,
    );

    setPrompts(updatedPrompts);
    savePrompts(updatedPrompts);
    setCurrentPrompt(updatedPrompt);
  };

  const deletePrompt = (id: string) => {
    const updatedPrompts = prompts.filter((p) => p.id !== id);
    setPrompts(updatedPrompts);
    savePrompts(updatedPrompts);

    const updatedVersions = versions.filter((v) => v.promptId !== id);
    setVersions(updatedVersions);
    saveVersions(updatedVersions);

    // Also delete variable sets for this prompt
    const updatedVariableSets = { ...promptVariableSets };
    delete updatedVariableSets[id];
    setPromptVariableSets(updatedVariableSets);
    saveVariableSets(updatedVariableSets);

    if (id === currentPromptId) {
      if (updatedPrompts.length > 0) {
        setCurrentPromptId(updatedPrompts[0].id);
      } else {
        setCurrentPromptId('');
        setCurrentPrompt(null);
      }
    }
  };

  const saveVersion = (note?: string) => {
    if (!currentPrompt) return;

    const newVersion: PromptVersion = {
      id: Date.now().toString(),
      promptId: currentPrompt.id,
      template: currentPrompt.template,
      variables: currentPrompt.variables,
      note: note || '',
      createdAt: new Date().toISOString(),
    };

    const updatedVersions = [...versions, newVersion];
    setVersions(updatedVersions);
    saveVersions(updatedVersions);
  };

  const restoreVersion = (version: PromptVersion) => {
    updatePrompt({
      template: version.template,
      variables: version.variables,
    });
  };

  const deleteVersion = (versionId: string) => {
    const updatedVersions = versions.filter((v) => v.id !== versionId);
    setVersions(updatedVersions);
    saveVersions(updatedVersions);
  };

  const updateVariableSets = (
    promptId: string,
    variableSets: VariableSet[],
  ) => {
    const updatedVariableSets = {
      ...promptVariableSets,
      [promptId]: variableSets,
    };
    setPromptVariableSets(updatedVariableSets);
    saveVariableSets(updatedVariableSets);
  };

  const runPrompt = async (
    prompts: Array<{ prompt: string; setName: string }>,
  ) => {
    setIsRunning(true);

    try {
      // Run all prompts in parallel
      const promises = prompts.map(async ({ prompt, setName }) => {
        try {
          const response = await fetch('/api/openai', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();

          if (result.error) {
            throw new Error(result.error);
          }

          return {
            id: `${Date.now()}-${Math.random()}`,
            promptId: currentPromptId,
            prompt,
            content: result.content,
            usage: result.usage,
            timestamp: result.timestamp,
            setName,
          };
        } catch (error: unknown) {
          return {
            id: `${Date.now()}-${Math.random()}`,
            promptId: currentPromptId,
            prompt,
            content: `Error: ${error instanceof Error ? error.message : 'something went wrong'}`,
            usage: null,
            timestamp: new Date().toISOString(),
            error: true,
            setName,
          };
        }
      });

      const results = await Promise.all(promises);
      setOutputs((prev) => [
        {
          id: `${Date.now()}-${Math.random()}`,
          promptId: currentPromptId,
          outputs: results,
        },
        ...prev,
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const currentVersions = versions.filter(
    (v) => v.promptId === currentPromptId,
  );

  const currentVariableSets = promptVariableSets[currentPromptId] || [];

  return (
    <div className="flex h-screen bg-background">
      <PromptSidebar
        prompts={prompts}
        currentPromptId={currentPromptId}
        onSelectPrompt={setCurrentPromptId}
        onCreatePrompt={createPrompt}
        onDeletePrompt={deletePrompt}
        onUpdatePrompt={updatePrompt}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 grid grid-cols-2">
        <div className="p-6 w-full h-full overflow-hidden ">
          {currentPrompt ? (
            <PromptEditor
              prompt={currentPrompt}
              variableSets={currentVariableSets}
              onUpdatePrompt={updatePrompt}
              onUpdateVariableSets={(sets) =>
                updateVariableSets(currentPrompt.id, sets)
              }
              onRunPrompt={runPrompt}
              onSaveVersion={saveVersion}
              isRunning={isRunning}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Create a prompt to get started
            </div>
          )}
        </div>

        <div className="border-l border-border p-6 overflow-hidden ">
          <OutputPanel
            outputs={outputs.filter((o) => o.promptId === currentPromptId)}
          />
        </div>
      </div>

      <VersionPanel
        versions={currentVersions}
        onRestoreVersion={restoreVersion}
        onDeleteVersion={deleteVersion}
        isOpen={versionPanelOpen}
        onToggle={() => setVersionPanelOpen(!versionPanelOpen)}
      />

      {!versionPanelOpen && (
        <button
          onClick={() => setVersionPanelOpen(true)}
          className="fixed right-4 top-4 bg-primary text-primary-foreground p-2 rounded-lg shadow-lg hover:bg-primary/90 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
