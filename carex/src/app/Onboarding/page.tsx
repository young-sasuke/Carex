import Onboarding from "./Onboarding";
import prisma from "@/utils/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const OnboardingPage = async () => {
  const user: any | null = await currentUser();

  if (user?.primaryEmailAddress) {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: user.primaryEmailAddress.emailAddress
      },
    });
    console.log(existingUser)
    if (existingUser) {
      redirect("/");
    }
  }

  return (
    <>
      <Onboarding />
    </>
  );
};

export default OnboardingPage;
