'use client';

import React from 'react';
import { PromptVersion } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RotateCcw, Trash2, ChevronRight } from 'lucide-react';

interface VersionPanelProps {
  versions: PromptVersion[];
  onRestoreVersion: (version: PromptVersion) => void;
  onDeleteVersion: (versionId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function VersionPanel({
  versions,
  onRestoreVersion,
  onDeleteVersion,
  isOpen,
  onToggle,
}: VersionPanelProps) {
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div
      className={`bg-card shrink-0 border-l border-border transition-all duration-300 ${
        isOpen ? 'w-80' : 'w-0'
      } overflow-hidden`}
    >
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Versions</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {versions.length} version(s)
        </p>
      </div>

      <ScrollArea className="h-[calc(100vh-140px)] w-80 ">
        <div className=" p-4 space-y-3">
          {versions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No versions saved yet. Save a version to see it here.
            </div>
          ) : (
            versions
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              )
              .map((version, index) => (
                <Card key={version.id} className=" w-[288px] ">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">
                        Version #{versions.length - index}
                      </CardTitle>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRestoreVersion(version)}
                          className="h-8 w-8"
                          title="Restore this version"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (
                              confirm(
                                'Are you sure you want to delete this version?',
                              )
                            ) {
                              onDeleteVersion(version.id);
                            }
                          }}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          title="Delete this version"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription className="text-xs">
                      {formatTimestamp(version.createdAt)}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-3 w-full">
                    {version.note && (
                      <div className="text-sm">{version.note}</div>
                    )}

                    <div className="space-y-2">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          Template:
                        </div>
                        <div className="p-2 bg-muted rounded text-xs font-mono max-h-16 overflow-y-auto">
                          {version.template || 'Empty template'}
                        </div>
                      </div>
                      {/* <div>
                        <div className="text-xs text-muted-foreground mb-1">
                          Variables:
                        </div>
                        <div className="p-2 bg-muted rounded text-xs font-mono max-h-16 overflow-y-auto">
                          {version.variables || '{}'}
                        </div>
                      </div> */}
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
