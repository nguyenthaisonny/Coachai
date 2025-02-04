'use client';
import { Industry } from '@/data/industries';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { onBoardingSchema } from '@/app/lib/schema';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { set } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import useFetch from '@/hooks/useFetch';
import { updateUser } from '@/actions/user';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { UserOnBoarding } from '@/type/user';

interface OnBoardingForm {
  industry: string;
  bio?: string;
  experience: number;
  skills: string;
}

const OnBoardingForm = ({ industries }: { industries: Industry[] }) => {
  const [selectedIndustry, setSelectedIndustry] = useState<
    Industry | undefined
  >();
  const router = useRouter();

  const {
    loading: dataLoading,
    fn: updateUserFn,
    data: updateResult,
  } = useFetch<UserOnBoarding>(updateUser);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(onBoardingSchema),
  });
  const watchIndustry = watch('industry');
  const handleSetIndustryValue = (value: string) => {
    setValue('industry', value);
    setSelectedIndustry(industries.find((industry) => industry.id == value));
    setValue('subIndustry', '');
  };
  const handleSetSubIndustryValue = (value: string) => {
    setValue('subIndustry', value);
  };

  const onSubmit = (values: any) => {
    try {
      const formatIndustry = `${values.industry}-${values.subIndustry
        .toLowerCase()
        .replace(/ /g, '-')}`;
      updateUserFn({ ...values, industry: formatIndustry });
    } catch (error) {
      console.error('On boarding error: ', error);
    }
  };

  useEffect(() => {
    if (updateResult?.success && !dataLoading) {
      router.push('dashboard');
      toast.success('Profile completed successfully!');
      router.refresh();
    }
  }, [updateResult, dataLoading]);

  return (
    <div className="flex items-center justify-center bg-background">
      <Card className="w-full max-w-lg mt-10 mx-2">
        <CardHeader>
          <CardTitle className="gradient-title text-4xl">Card Title</CardTitle>
          <CardDescription>
            Select your industry to get persionalized career insights and
            recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action=""
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select onValueChange={handleSetIndustryValue}>
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry.id} value={industry.id}>
                      {industry.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-sm text-red-500">
                  {errors.industry.message as string}
                </p>
              )}
            </div>
            {watchIndustry && (
              <div className="space-y-2">
                <Label htmlFor="subIndustry">Specialization</Label>
                <Select onValueChange={handleSetSubIndustryValue}>
                  <SelectTrigger id="subIndustry">
                    <SelectValue placeholder="Select a sub industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedIndustry &&
                      selectedIndustry?.subIndustries.map((subIndustry) => (
                        <SelectItem key={subIndustry} value={subIndustry}>
                          {subIndustry}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {errors.subIndustry && (
                  <p className="text-sm text-red-500">
                    {errors.subIndustry.message as string}
                  </p>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                max="50"
                placeholder="Enter years of experience"
                {...register('experience')}
              />
              {errors.experience && (
                <p className="text-sm text-red-500">
                  {errors.experience.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                placeholder="e.g., Python, JavaScript, Project Management"
                {...register('skills')}
              />
              <p className="text-sm text-muted-foreground">
                Separate multiple skills with commas
              </p>
              {errors.skills && (
                <p className="text-sm text-red-500">
                  {errors.skills.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your professional background..."
                className="h-32"
                {...register('bio')}
              />
              {errors.bio && (
                <p className="text-sm text-red-500">
                  {errors.bio.message as string}
                </p>
              )}
            </div>
            <Button disabled={dataLoading} type="submit" className="w-full">
              {dataLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Complete Profile'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnBoardingForm;
