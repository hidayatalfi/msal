"use client";

import DocumentsAnalytics from "./DocumentsAnalytics";
import LettersAnalytics from "./LettersAnalytics";

export default function HomepageClient() {
  return (
    <div className="relative flex h-full min-h-screen w-full flex-col space-y-3 px-8 pt-32">
      <div className="relative flex w-full flex-col border-b border-slate-400 pb-8">
        <DocumentsAnalytics />
      </div>
      <div className="relative flex w-full flex-col border-b border-slate-400 pb-8">
        <h1 className="bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent">
          Letters Analytics
        </h1>
        <LettersAnalytics />
      </div>
    </div>
  );
}
