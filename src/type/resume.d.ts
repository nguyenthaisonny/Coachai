type EntryResume = {
  title: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
  current: boolean;
};

type ContactResume = {
  email: string;
  mobile: string;
  linkedin: string;
  twitter: string;
};

type Resume = {
  contacInfo: ContactResume;
  summary: string;
  skills: string;
  experience: EntryResume[];
  education: EntryResume[];
  project: EntryResume[];
};
