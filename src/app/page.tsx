"use client";

import { fetchTweetData, Tweet } from "@/components/Tweet";
import { useState } from "react";

export default function Home() {
  const DOMAIN = "x-embed.vercel.app";

  const [url, setUrl] = useState("");
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputUrl = e.target.value;

    setIsLoading(true);
    setHasError(false);
    setUrl(
      inputUrl.replace("x.com", `${DOMAIN}`).replace("twitter.com", `${DOMAIN}`)
    );
  };

  const getPath = (url: string) => {
    return url.replace("https://x.com", "").replace("https://twitter.com", "");
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center">
      <div className="max-w-[600px] mb-5 mt-[30vh] flex flex-col gap-6 items-center">
        <h1 className="text-4xl font-bold text-center">
          What would you like to embed?
        </h1>
        <p>
          Just replace <span className="bold text-[#1D9BF0]">x.com</span> with{" "}
          <span className="bold text-[#1D9BF0]">x-embed.vercel.app</span>
        </p>
        <div className="w-full p-2">
          <input
            type="text"
            placeholder="https://x.com/aryanbaburajan/status/1933965572020347247"
            value={url}
            onChange={handleChange}
            className="w-full p-3 pl-4 border border-white text-black bg-white focus:outline-none focus:ring-0 focus:border-transparent"
          />
        </div>
        <span>
          Made by{" "}
          <a
            href="https://x.com/aryanbaburajan"
            className="bold text-[#1D9BF0]"
            target="_blank"
          >
            @aryanbaburajan
          </a>
        </span>

        <div className="relative w-full">
          <img
            src={
              getPath(url) !== ""
                ? getPath(url)
                : "/aryanbaburajan/status/1933965572020347247"
            }
            alt="tweet preview"
            className={`w-full ${hasError ? "hidden" : ""}`}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
          />

          {isLoading && (
            <div className="absolute inset-0 flex justify-center items-center bg-black/50 z-10">
              <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
