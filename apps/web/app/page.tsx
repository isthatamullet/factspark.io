"use client";

import { trpc } from "@/lib/trpc/client";
import { useState, type FormEvent } from "react";

export default function HomePage() {
  // tRPC hook for the initial greeting
  const { data: greetingData, isLoading: greetingIsLoading } = trpc.greeting.useQuery({
    name: "FactSpark User",
  });

  // State for the claim input form
  const [claimText, setClaimText] = useState("");
  const [factCheckResult, setFactCheckResult] = useState<{
    submittedClaim: string;
    status: string;
    analysis?: string;
  } | null>(null);

  // Fetch historical claims
  const {
    data: historicalClaims,
    isLoading: historicalClaimsLoading,
    error: historicalClaimsError,
    refetch: refetchHistoricalClaims, // Added refetch function
  } = trpc.getHistoricalClaims.useQuery(
    undefined, // No input for this query
    { refetchOnWindowFocus: false } // Optional: prevent refetching on window focus
  );

  // tRPC mutation for submitting a new claim
  const submitClaimMutation = trpc.submitClaim.useMutation({
    onSuccess: (data) => {
      setFactCheckResult(data);
      setClaimText(""); // Clear the input field on success
      refetchHistoricalClaims(); // Refetch historical claims to include the new one
      console.log("Claim submission successful:", data);
    },
    onError: (error) => {
      console.error("Error submitting claim:", error);
      setFactCheckResult({
        submittedClaim: claimText,
        status: "Error processing claim:",
        analysis: error.message,
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

        {/* Claim Submission Form */}
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

        {/* Fact Check Result Display */}
        {factCheckResult && (
          <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50 text-left">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Current Check:</h3>
            <p className="mb-1 text-gray-700">
              <strong>Submitted:</strong> {factCheckResult.submittedClaim}
            </p>
            <p className="text-gray-700 mb-2"><strong>Status:</strong> {factCheckResult.status}</p>
            {factCheckResult.analysis && (
              <div className="p-3 bg-white border border-gray-300 rounded whitespace-pre-wrap">
                <p className="text-sm text-gray-800">{factCheckResult.analysis}</p>
              </div>
            )}
          </div>
        )}

        {/* Historical Claims Display */}
        <div className="mt-12 w-full text-left">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Previously Checked Claims</h2>
          {historicalClaimsLoading && <p className="text-gray-600">Loading historical claims...</p>}
          {historicalClaimsError && <p className="text-red-600">Error loading claims: {historicalClaimsError.message}</p>}
          {historicalClaims && historicalClaims.length === 0 && <p className="text-gray-600">No claims have been checked yet.</p>}
          {historicalClaims && historicalClaims.length > 0 && (
            <ul className="space-y-6">
              {historicalClaims.map((claim: any) => ( // Consider defining a proper type for 'claim'
                <li key={claim.id} className="p-4 border border-gray-200 rounded-md shadow-sm bg-white">
                  <p className="text-xs text-gray-500 mb-1">
                    Checked on: {new Date(claim.submitted_at).toLocaleString()}
                  </p>
                  <p className="font-medium text-gray-800 mb-2">{claim.claim_text}</p>
                  {claim.analysis_text && (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded whitespace-pre-wrap text-sm text-gray-700">
                      {claim.analysis_text}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-12 text-md text-gray-600">
          Full AI-Powered Fact Checking - Coming Soon!
        </p>
      </div>
    </main>
  );
}
