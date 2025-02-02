interface User {
    id: string;
    name?: string;
    email: string;
    clerkUserId: string;
    imageUrl?: string;
    industry?: string;
    bio?: string;
    experience?: string;
    skills?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}
