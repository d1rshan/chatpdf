import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { ArrowRight, LogIn } from "lucide-react";
import FileUpload from "@/components/FileUpload";
// import { checkSubscription } from "@/lib/subscription";
// import SubscriptionButton from "@/components/SubscriptionButton";
// import { db } from "@/lib/db";
// import { chats } from "@/lib/db/schema";
// import { eq } from "drizzle-orm";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-rose-100 to-teal-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center min-h-screen justify-center">
          <div className="flex items-center">
            <h1 className="mr-3 text-5xl font-semibold">Chat with any PDF</h1>
            <UserButton afterSignOutUrl="/" />
          </div>

          <div className="flex mt-2">
            {isAuth && (
              <>
                <Button>
                  Go to Chats <ArrowRight className="ml-2" />
                </Button>

                <div className="ml-3">
                  {/* <SubscriptionButton isPro={isPro} /> */}
                </div>
              </>
            )}
          </div>

          <p className="max-w-xl mt-1 text-lg text-slate-600">
            Join millions of students, researchers and professionals to
            instantly answer questions and understand research with AI
          </p>

          <div className="w-full mt-4">
            {isAuth ? (
              <FileUpload />
            ) : (
              <Link href="/sign-in">
                <Button>
                  Login to get Started!
                  <LogIn className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
