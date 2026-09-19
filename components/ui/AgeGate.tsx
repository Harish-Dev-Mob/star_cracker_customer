"use client";

import { useState, useEffect } from "react";

export default function AgeGate() {
  const [show, setShow] = useState(false);
  const [config, setConfig] = useState<{ ageGateEnabled?: string; ageGateText?: string } | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Check local storage first
    if (localStorage.getItem("age_verified") === "true") {
      return;
    }

    const checkConfig = async () => {
      try {
        const res = await fetch("/api/public/site-config");
        if (res.ok) {
          const data = await res.json();
          if (data.ageGateEnabled === "true") {
            setConfig(data);
            setShow(true);
          }
        }
      } catch (err) {
        console.error("Failed to load age gate config", err);
      }
    };
    checkConfig();
  }, []);

  const handleConfirm = () => {
    localStorage.setItem("age_verified", "true");
    setShow(false);
  };

  const handleDeny = () => {
    setError(true);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 max-w-md w-full p-8 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
        <h2 className="text-3xl font-black text-gray-900 dark:text-white font-display mb-4 relative z-10">Age Verification</h2>
        <p className="text-gray-600 dark:text-gray-300 font-medium mb-8 relative z-10">
          {config?.ageGateText || "You must be 18 years of age or older to enter this site and purchase firecrackers."}
        </p>

        {error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl font-bold border border-red-200">
            Sorry, you must be of legal age to view this content.
          </div>
        ) : (
          <div className="flex flex-col gap-3 relative z-10">
            <button 
              onClick={handleConfirm}
              className="bg-red-600 text-white w-full py-4 rounded-xl font-black text-lg shadow-lg hover:bg-red-700 hover:shadow-red-500/25 hover:-translate-y-0.5 transition-all uppercase tracking-wider"
            >
              I am 18 or older
            </button>
            <button 
              onClick={handleDeny}
              className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 w-full py-4 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              I am under 18
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
