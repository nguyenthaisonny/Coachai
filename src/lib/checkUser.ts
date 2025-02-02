import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";


export const checkUser = async () => {
  const user = await currentUser();
  if(!user) {
    return null;
  }

  try {
    const LoggedInUser = await db.user.findUnique({ 
        where: {
            clerkUserId: user.id
        }
    })
    if(LoggedInUser) {
      return LoggedInUser
    }

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name: user.fullName || "",
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      }
    })
    return newUser
  }
  catch (error: any) { 
    console.log(error.message);
    
  }
}