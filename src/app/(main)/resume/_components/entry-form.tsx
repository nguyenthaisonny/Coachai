'use client';
import { improveWithAI } from '@/actions/resume';
import { entrySchema, resumeSchema } from '@/app/lib/schemas/resume';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import useFetch from '@/hooks/useFetch';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Loader2, PlusCircle, Sparkles, X } from 'lucide-react';
import { parse } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const formatDate = (date: string) => {
  if (!date) return;
  const parsedDate = parse(date, 'yyyy-MM', new Date());
  return format(parsedDate, 'MMM yyyy');
};

const EntryForm = ({
  type,
  entries,
  onChange,
}: {
  type: string;
  entries: EntryResume[];
  onChange: (entries: EntryResume[]) => void;
}) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const {
    reset,
    register,
    handleSubmit: handleValidation,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: '',
      organization: '',
      startDate: '',
      endDate: '',
      description: '',
      current: false,
    },
  });

  const {
    data: improvedContent,
    loading: isImproving,
    error: improveError,
    fn: improveWithAIFn,
  } = useFetch<{ current: string; type: string }, string>(improveWithAI);
  const handleAdd = handleValidation((data: EntryResume) => {
    console.log();

    const formatedData = {
      ...data,
      startDate: formatDate(data.startDate) as string,
      endDate: data?.current ? '' : (formatDate(data.endDate) as string),
    };
    onChange([...entries, formatedData]);
    console.log(entries);
  });
  const handleDelete = (index: number) => {
    const newEntries = entries.filter((_, i) => i !== index);
    onChange(newEntries);
  };
  useEffect(() => {
    if (improvedContent && !isImproving) {
      setValue('description', improvedContent);
      toast.success('Description impoved successfully');
    }
    if (improveError) {
      toast.error(improveError?.message || 'Failed to improve desciprtion');
    }
  }, [improvedContent, improveError, isImproving]);
  const handleImproveDescription = async () => {
    const desciption = watch('description');
    if (!desciption) {
      toast.error('Please enter a description first');
      return;
    }
    await improveWithAIFn({
      current: desciption,
      type: type.toLowerCase(),
    });
  };

  const current = watch('current');
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {entries &&
          entries.map((entry: EntryResume, index: number) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex flex-row justify-between items-center">
                  <CardTitle>
                    {entry.title} at @{entry.organization}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    onClick={() => handleDelete(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {entry.startDate} -{' '}
                  {entry.current ? 'present' : entry.endDate}
                </p>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-2"></CardDescription>
                <p className="text-sm">{entry.description}</p>
              </CardContent>
            </Card>
          ))}
      </div>
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add {type}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input placeholder="Title/Position" {...register('title')} />
                <p className="text-sm text-red-500">{errors.title?.message}</p>
              </div>
              <div>
                <Input
                  placeholder="Organization/Company"
                  {...register('organization')}
                />
                {errors.organization && (
                  <p className="text-sm text-red-500">
                    {errors.organization?.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input type="month" {...register('startDate')} />
                {errors.startDate && (
                  <p className="text-sm text-red-500">
                    {errors.startDate?.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  type="month"
                  {...register('endDate')}
                  disabled={current}
                />
                <p className="text-sm text-red-500">
                  {errors.endDate?.message}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="current"
                {...register('current')}
                onChange={(e) => {
                  setValue('current', e.target.checked);
                  if (e.target.checked) {
                    setValue('endDate', '');
                  }
                }}
              />
              <label htmlFor="current">Currrent {type}</label>
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder={`Description of your ${type.toLowerCase()}`}
                className="h-32"
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description?.message}
                </p>
              )}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleImproveDescription}
              disabled={isImproving || !watch('description')}
            >
              {isImproving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Improve with AI
                </>
              )}
            </Button>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setIsAdding(false);
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleAdd}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </CardFooter>
        </Card>
      )}
      {!isAdding && (
        <Button
          className="w-full"
          variant="outline"
          onClick={() => setIsAdding(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2">Add {type}</PlusCircle>
        </Button>
      )}
    </div>
  );
};

export default EntryForm;
