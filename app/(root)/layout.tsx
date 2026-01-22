import Header from "@/components/Header";
import { auth } from "@/lib/better-auth/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import React from "react";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) redirect("/sign-in");
  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
  };
  return (
    <div>
      <Header user={user} />
      <main className="min-h-screen text-gray-400">
        <div className="container py-10">{children}</div>
      </main>
    </div>
  );
};

export default layout;
