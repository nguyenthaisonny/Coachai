'use client';
import { updateCoverLetter } from '@/actions/cover-letter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import useFetch from '@/hooks/useFetch';
import { CoverLetter } from '@prisma/client';
import MDEditor from '@uiw/react-md-editor';
import {
  AlertTriangle,
  Download,
  Edit,
  Loader2,
  Monitor,
  Save,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const AICoverLetterResult = ({
  id,
  value,
  setValue = () => {},
}: {
  value: CoverLetter;
  setValue?: (value: CoverLetter) => void;
  id?: string;
}) => {
  const [mode, setMode] = useState<string>('edit');
  const {
    loading: isSaving,
    fn: saveCoverLetterFn,
    data: saveResult,
    error: saveError,
  } = useFetch<CoverLetter, CoverLetter>(updateCoverLetter);
  const [isDowloadingPDF, setIsDownloadingPDF] = useState<boolean>();
  const [content, setContent] = useState<string>(value?.content);
  useEffect(() => {
    if (saveResult && !isSaving) {
      setValue(saveResult);
      toast.success('Cover letter saved successfully');
    }
    if (saveError) {
      toast.error(saveError || 'Failed to save cover letter');
    }
  }, [isSaving, saveResult, saveError]);
  const handleDownloadPDF = async () => {};
  const handleSave = async () => {
    saveCoverLetterFn({ ...value, content });
  };
  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <Button
            variant="link"
            type="button"
            className="mb-2"
            onClick={() => setMode(mode === 'preview' ? 'edit' : 'preview')}
          >
            {mode === 'preview' ? (
              <>
                <Edit className="h-4 2-4" />
                Edit Cover Letter
              </>
            ) : (
              <>
                <Monitor className="h-4 w-4" />
                Show Cover Letter
              </>
            )}
          </Button>
          <div className="space-x-2">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              variant="destructive"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save
                </>
              )}
            </Button>
            <Button disabled={isDowloadingPDF} onClick={handleDownloadPDF}>
              {isDowloadingPDF ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin"></Loader2>
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {mode !== 'preview' && (
            <div className="flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span>
                You will lose edited markdown if you update the from data.
              </span>
            </div>
          )}
          <div className="border rounded-lg">
            <MDEditor
              value={content}
              onChange={(content?: string) => setContent(content || '')}
              height={800}
              preview={mode === 'preview' ? mode : 'edit'}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AICoverLetterResult;
