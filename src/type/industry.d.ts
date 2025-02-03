import { IndustryInsight } from "@prisma/client";

type Insights = Omit<IndustryInsight, 'industry'>;