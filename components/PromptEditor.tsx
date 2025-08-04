'use client';

import React, { useState, useEffect } from 'react';
import { Prompt, VariableSet } from '@/lib/types';
import { renderTemplate } from '@/lib/template-utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ChevronsUpDown, Copy, Play, Save } from 'lucide-react';
import VariableManager from './VariableManager';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import { copyContent } from '@/lib/utils';

interface PromptEditorProps {
  prompt: Prompt;
  variableSets: VariableSet[];
  onUpdatePrompt: (updates: Partial<Prompt>) => void;
  onUpdateVariableSets: (sets: VariableSet[]) => void;
  onRunPrompt: (prompts: Array<{ prompt: string; setName: string }>) => void;
  onSaveVersion: (note?: string) => void;
  isRunning: boolean;
}

export default function PromptEditor({
  prompt,
  variableSets,
  onUpdatePrompt,
  onUpdateVariableSets,
  onRunPrompt,
  onSaveVersion,
  isRunning,
}: PromptEditorProps) {
  const [template, setTemplate] = useState(prompt.template);
  const [renderedPreviews, setRenderedPreviews] = useState<
    Array<{ setName: string; preview: string; error?: string }>
  >([]);
  const [showSaveVersion, setShowSaveVersion] = useState(false);
  const [versionNote, setVersionNote] = useState('');
  // const [aiPromptWriterText, setAiPromptWriterText] = useState('');
  // const [isAiPromptWriterLoading, setIsAiPromptWriterLoading] = useState(false);

  // useEffect(() => {
  //   setTemplate(prompt.template);
  // }, [prompt]);

  if (template !== prompt.template) setTemplate(prompt.template);

  useEffect(() => {
    // Update rendered previews when template or variable sets change
    const previews = variableSets.map((set) => {
      try {
        const rendered = renderTemplate(template, set.variables);
        return { setName: set.name, preview: rendered };
      } catch (error: unknown) {
        return {
          setName: set.name,
          preview: '',
          error:
            error instanceof Error ? error.message : 'something went wrong',
        };
      }
    });
    setRenderedPreviews(previews);
  }, [template, variableSets]);

  const handleTemplateChange = (value: string) => {
    setTemplate(value);
    onUpdatePrompt({ template: value });
  };

  const handleVariableSetsChange = (sets: VariableSet[]) => {
    onUpdateVariableSets(sets);
  };

  const handleSaveVersion = () => {
    onSaveVersion(versionNote.trim() || undefined);
    setVersionNote('');
    setShowSaveVersion(false);
  };

  const handleRun = () => {
    const validPreviews = renderedPreviews.filter((p) => p.preview && !p.error);
    if (validPreviews.length > 0) {
      const prompts = validPreviews.map((p) => ({
        prompt: p.preview,
        setName: p.setName,
      }));
      onRunPrompt(prompts);
    }
  };

  // const handleAiPromptWriteSubmit = async () => {
  //   try {
  //     const prompt = aiPromptWritePrompt(aiPromptWriterText);
  //     setIsAiPromptWriterLoading(true);
  //     const response = await fetch('/api/openai', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ prompt }),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const result = await response.json();

  //     if (result.error) {
  //       throw new Error(result.error);
  //     }

  //     handleTemplateChange(result.content);
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setIsAiPromptWriterLoading(false);
  //   }
  // };

  return (
    <div className="@container w-full h-full grid grid-rows-[auto,_1fr] space-y-6 ">
      <div className=" flex flex-wrap items-center justify-between">
        <h1 className=" text-2xl font-bold text-foreground">{prompt.name}</h1>
        <div className="flex space-x-2">
          <Button onClick={() => setShowSaveVersion(true)} variant="outline">
            <Save className="w-4 h-4 mr-2" />
            Save Version
          </Button>
          <Button
            onClick={handleRun}
            disabled={
              isRunning ||
              renderedPreviews.filter((p) => p.preview && !p.error).length === 0
            }
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning
              ? 'Running...'
              : `Run ${renderedPreviews.filter((p) => p.preview && !p.error).length > 1 ? `(${renderedPreviews.filter((p) => p.preview && !p.error).length} sets)` : ''}`}
          </Button>
        </div>
      </div>

      <div className=" grid grid-cols-1 @2xl:grid-cols-2 gap-6 overflow-auto ">
        <div className=" w-full grid grid-rows-2 gap-y-4">
          <Card className=" flex flex-col ">
            <CardHeader>
              <CardTitle className="text-base flex justify-between items-center ">
                <p>Prompt Template</p>

                {template && (
                  <Button
                    onClick={() => {
                      copyContent(template);
                    }}
                    variant={'ghost'}
                    size={'smallIcon'}
                  >
                    <Copy size={16} />
                  </Button>
                )}
                {/* <Popover>
                  <PopoverTrigger>
                    <Button
                      variant={'ghost'}
                      size={'icon'}
                      className=" w-6 h-6 "
                      title="Use AI to write prompt"
                    >
                      <Sparkles size={14} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className=" w-96">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAiPromptWriteSubmit();
                      }}
                    >
                      <Textarea
                        value={aiPromptWriterText}
                        onChange={(e) => setAiPromptWriterText(e.target.value)}
                        placeholder="write you js/ts function along with helper functions to convert them in Jinja2 syntax"
                        className=" h-72 font-mono text-sm resize-none"
                      />
                      <Button
                        type="submit"
                        variant={'outline'}
                        size={'sm'}
                        className=" w-full mt-3 "
                        disabled={isAiPromptWriterLoading}
                      >
                        {isAiPromptWriterLoading ? 'Loading...' : ' Generate'}
                      </Button>
                    </form>
                  </PopoverContent>
                </Popover> */}
              </CardTitle>
              <CardDescription>
                Enter your prompt template using Jinja2 syntax (e.g., Hello{' '}
                {`{{ name }}`})
              </CardDescription>
            </CardHeader>
            <CardContent className=" flex-1 ">
              <Textarea
                value={template}
                onChange={(e) => handleTemplateChange(e.target.value)}
                placeholder="Enter your prompt template using Jinja2 syntax (e.g., Hello {{ name }})"
                className="h-full font-mono text-sm resize-none"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Variable Sets</CardTitle>
              <CardDescription>
                Manage different sets of variables to test your prompt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VariableManager
                template={template}
                variableSets={variableSets}
                onVariableSetsChange={handleVariableSetsChange}
              />
            </CardContent>
          </Card>
        </div>

        <Card className=" w-full overflow-x-hidden overflow-y-auto ">
          <>
            <CardHeader className=" sticky top-0 bg-card ">
              <CardTitle className="text-base">Rendered Previews</CardTitle>
              <CardDescription>
                Live preview of your template with different variable sets
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderedPreviews.length === 0 ? (
                <div className="h-80 p-3 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                  Create variable sets to see previews
                </div>
              ) : (
                <div className="space-y-4 overflow-y-auto overscroll-x-auto">
                  {renderedPreviews.map((preview, index) => (
                    <Collapsible
                      key={index}
                      defaultOpen
                      className="border rounded-lg p-3 w-full "
                    >
                      <div className="flex items-center justify-between ">
                        <Badge variant="outline">{preview.setName}</Badge>
                        <div className=" flex items-center gap-3 ">
                          {!preview.error && (
                            <Button
                              onClick={() => {
                                copyContent(preview.preview);
                              }}
                              variant={'ghost'}
                              size={'smallIcon'}
                            >
                              <Copy size={16} />
                            </Button>
                          )}
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8"
                            >
                              <ChevronsUpDown />
                            </Button>
                          </CollapsibleTrigger>
                        </div>
                      </div>
                      <CollapsibleContent className="bg-muted rounded p-3 mt-2 ">
                        {preview.error ? (
                          <div className="text-destructive font-mono text-sm">
                            Error: {preview.error}
                          </div>
                        ) : (
                          <pre className="whitespace-pre-wrap text-sm text-foreground font-mono">
                            {preview.preview || 'Empty preview'}
                          </pre>
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              )}
            </CardContent>
          </>
        </Card>
      </div>

      <Dialog open={showSaveVersion} onOpenChange={setShowSaveVersion}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Version</DialogTitle>
            <DialogDescription>
              Add an optional note to describe this version of your prompt.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={versionNote}
            onChange={(e) => setVersionNote(e.target.value)}
            placeholder="Optional note for this version"
            className="min-h-[80px] resize-none"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowSaveVersion(false);
                setVersionNote('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveVersion}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
