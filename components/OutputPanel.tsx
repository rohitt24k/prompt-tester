'use client';

import React, { useState } from 'react';
import { BatchAIOutputs, OpenAIOutput } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import { Button } from './ui/button';
import { ChevronsUpDown } from 'lucide-react';

const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleString();
};

interface OutputPanelProps {
  outputs: BatchAIOutputs[];
}

const formatTokenUsage = (
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  } | null,
) => {
  if (!usage) return 'No usage data';
  return `${usage.prompt_tokens} + ${usage.completion_tokens} = ${usage.total_tokens} tokens`;
};

export default function OutputPanel({
  outputs: batchOutputs,
}: OutputPanelProps) {
  return (
    <div className="h-full w-full grid grid-rows-[auto,_1fr] overflow-auto">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-foreground">AI Outputs</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {batchOutputs.length} output(s)
        </p>
      </div>

      {batchOutputs.length === 0 ? (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Run a prompt to see AI outputs here
        </div>
      ) : (
        <div className=" overflow-auto space-y-5 ">
          {batchOutputs.map(({ id, outputs }, index) => (
            <BatchOutput
              index={batchOutputs.length - index}
              outputs={outputs}
              key={id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const BatchOutput = ({
  index,
  outputs,
}: {
  index: number;
  outputs: OpenAIOutput[];
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible
      className=" border rounded-lg p-4 py-2 "
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <div className=" flex justify-between items-center">
        <p>
          Output #{index}{' '}
          <span className=" text-gray-500 text-sm ">
            ({outputs.length} set)
          </span>
        </p>

        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <ChevronsUpDown />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className=" mt-3 ">
        <ScrollArea className=" overflow-x-auto ">
          <div className=" relative ">
            <div className="flex gap-x-4 overflow-auto ">
              {outputs.map((output, index) => (
                <Card
                  key={output.id}
                  className={` min-w-[500px] max-h-[500px] relative overflow-y-auto ${output.error ? 'border-destructive' : ''}`}
                >
                  <CardHeader className="pb-3 sticky top-0 bg-card ">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-sm">
                          {output.setName || 'Default'}
                        </CardTitle>
                        {output.error && (
                          <Badge variant="destructive">Error</Badge>
                        )}
                      </div>
                      {index === 0 && (
                        <CardDescription className="text-xs">
                          {formatTimestamp(output.timestamp)}
                        </CardDescription>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3 overflow-y-auto pb-0 ">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        Prompt:
                      </div>
                      <div className="p-2 bg-muted rounded text-sm font-mono max-h-20 overflow-y-auto">
                        {output.prompt}
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        Response:
                      </div>
                      <div
                        className={`p-3 rounded text-sm whitespace-pre-wrap ${
                          output.error
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-muted'
                        }`}
                      >
                        {output.content}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className=" sticky bottom-0 bg-card pt-3">
                    {!output.error && (
                      <div className="text-xs text-muted-foreground">
                        {formatTokenUsage(output.usage)}
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  );
};
