import Header from "@/components/Header";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      <main className="min-h-screen text-gray-400">
        <div className="container py-10">{children}</div>
      </main>
    </div>
  );
};

export default layout;
