"use client"; // Add this to make it a client component

import { trpc } from "@/lib/trpc/client"; // Import the tRPC client
import { useState, type FormEvent } from "react";

export default function HomePage() {
  // Use the tRPC hook to call the 'greeting' procedure
  const { data: greetingData, isLoading: greetingIsLoading } = trpc.greeting.useQuery({
    name: "FactSpark User",
  });

  const [claimText, setClaimText] = useState("");
  const [factCheckResult, setFactCheckResult] = useState<{
    submittedClaim: string;
    status: string;
    analysis?: string; // To store the analysis or error message from Gemini
  } | null>(null);

  const submitClaimMutation = trpc.submitClaim.useMutation({
    onSuccess: (data) => {
      setFactCheckResult(data);
      // Optionally clear the input: setClaimText("");
      console.log("Claim submission successful:", data);
    },
    onError: (error) => {
      console.error("Error submitting claim:", error);
      // Display a more user-friendly error or use a toast notification
      setFactCheckResult({
        submittedClaim: claimText,
        status: "Error processing claim:", // General status for error
        analysis: error.message, // Put the actual error message in the analysis field
      });
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (claimText.trim()) {
      submitClaimMutation.mutate({ text: claimText.trim() });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-8 pt-16 md:p-24">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-2">
          Welcome to FactSpark.io
        </h1>
        <div className="mb-8 text-lg">
          {greetingIsLoading && <p>Loading...</p>}
          {greetingData && <p>{greetingData.text}</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label htmlFor="claim" className="sr-only">
              Enter text to fact-check
            </label>
            <textarea
              id="claim"
              name="claim"
              rows={3}
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 placeholder-gray-500"
              value={claimText}
              onChange={(e) => setClaimText(e.target.value)}
              placeholder="Enter a statement, news headline, or claim to verify..."
              disabled={submitClaimMutation.isPending}
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={submitClaimMutation.isPending || !claimText.trim()}
          >
            {submitClaimMutation.isPending ? "Checking..." : "Check Fact"}
          </button>
        </form>

        {factCheckResult && (
          <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50 text-left">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Preliminary Check:</h3>
            <p className="mb-1 text-gray-700">
              <strong>Submitted:</strong> {factCheckResult.submittedClaim}
            </p>
            <p className="text-gray-700 mb-2"><strong>Status:</strong> {factCheckResult.status}</p>
            {factCheckResult.analysis && (
              <div className="p-3 bg-white border border-gray-300 rounded whitespace-pre-wrap"><p className="text-sm text-gray-800">{factCheckResult.analysis}</p></div>
            )}
          </div>
        )}

        <p className="mt-12 text-md text-gray-600">
          Full AI-Powered Fact Checking - Coming Soon!
        </p>
      </div>
    </main>
  );
}
