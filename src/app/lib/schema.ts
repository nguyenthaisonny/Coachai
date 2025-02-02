import { z, ZodType } from "zod"

export const onBoardingSchema = z.object({
    industry: z.string({
        required_error: 'Please select an industry'
    }),
    subIndustry: z.string({
        required_error: 'Please select a specialization'
    }),
    bio: z.string().max(500).optional(),
    experience: z
        .string()
        .transform((val) => parseInt(val, 10))
        .pipe(
            z
                .number()
                .min(0, "Experience must be at least 0 years")
                .max(50, "Experience must be at most 50 years")
        )
        ,
    skills: z.string().optional().transform((val) => {
        return val 
            ? val.split(',')
            .map((skill) => skill.trim())
            .filter(Boolean) // remove empty strings
            : undefined;
    })
})