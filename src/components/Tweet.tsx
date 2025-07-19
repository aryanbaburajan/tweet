import { registerFont } from "canvas";
import { wrapText, createClassPropHelper, shortenNumber } from "@/lib/utils";
import MediaGrid from "./MediaGrid";
import React from "react";
import path from "path";

export function Tweet({
  data,
  useSatori = false,
}: {
  data: any;
  useSatori?: boolean;
}) {
  const cx = createClassPropHelper(useSatori);

  return (
    <div
      {...cx(
        `flex flex-col p-4 ${
          data.isRoot ? "pb-0" : ""
        } bg-black text-gray-200 w-full`
      )}
    >
      <div {...cx("flex flex-row")}>
        <img
          src={data.author.avatar_url}
          width={40}
          height={40}
          alt="author-avatar"
          {...cx("rounded-full self-center")}
        />
        <div {...cx("flex flex-col self-center ml-2 leading-tight")}>
          <div {...cx("flex flex-row")}>
            <label {...cx("font-bold")}>{data.author.name}</label>
            <img
              src={`${process.env.NEXT_PUBLIC_URL}/icons/tick.svg`}
              width={16}
              height={16}
              alt="verified-tick-checkmark"
              {...cx("ml-1")}
            />
          </div>
          <span {...cx("text-gray-500")}>@{data.author.screen_name}</span>
        </div>
      </div>

      <div {...cx("text-lg mt-3 flex flex-col")}>
        {data.text.map((line: string, key: number) =>
          line != "" ? (
            <div key={key}>{line}</div>
          ) : (
            <div key={key} {...cx("flex text-black")}>
              consider this a newline ...
            </div>
          )
        )}
      </div>

      {data.media && data.media.all && (
        <div {...cx("flex mt-3")}>
          <MediaGrid media={data.media.all} useSatori={useSatori} />
        </div>
      )}

      {data.quote && (
        <div
          {...cx(
            "flex flex-row border-[1px] rounded-2xl overflow-hidden border-gray-700 mt-3"
          )}
          style={{
            transformOrigin: "top left",
          }}
        >
          <Tweet data={data.quote} useSatori={useSatori} />
        </div>
      )}

      {data.stats && (
        <div {...cx("flex flex-col my-4")}>
          <div {...cx("flex flex-row text-gray-500 text-sm")}>
            <div {...cx("flex flex-row items-center mr-auto ml-1")}>
              <img
                src={`${process.env.NEXT_PUBLIC_URL}/icons/reply.svg`}
                width={18.75}
                height={18.75}
                alt="reply"
              />
              {data.stats.replies > 0 ? (
                <span {...cx("ml-1")}>{shortenNumber(data.stats.replies)}</span>
              ) : null}
            </div>
            <div {...cx("flex flex-row items-center mr-auto ml-1")}>
              <img
                src={`${process.env.NEXT_PUBLIC_URL}/icons/repost.svg`}
                width={18.75}
                height={18.75}
                alt="repost"
              />
              {data.stats.retweets > 0 ? (
                <span {...cx("ml-1")}>
                  {shortenNumber(data.stats.retweets)}
                </span>
              ) : null}
            </div>
            <div {...cx("flex flex-row items-center mr-auto ml-1")}>
              <img
                src={`${process.env.NEXT_PUBLIC_URL}/icons/like.svg`}
                width={18.75}
                height={18.75}
                alt="like"
              />
              {data.stats.likes > 0 ? (
                <span {...cx("ml-1")}>{shortenNumber(data.stats.likes)}</span>
              ) : null}
            </div>
            <div {...cx("flex flex-row items-center mr-auto ml-1")}>
              <img
                src={`${process.env.NEXT_PUBLIC_URL}/icons/view.svg`}
                width={18.75}
                height={18.75}
                alt="view"
              />
              {data.stats.views > 0 ? (
                <span {...cx("ml-1")}>{shortenNumber(data.stats.views)}</span>
              ) : null}
            </div>
            <div {...cx("flex flex-row items-center mr-auto ml-1")}>
              <img
                src={`${process.env.NEXT_PUBLIC_URL}/icons/bookmark.svg`}
                width={18.75}
                height={18.75}
                alt="bookmark"
              />
              {data.stats.bookmarks > 0 ? (
                <span {...cx("ml-1")}>
                  {shortenNumber(data.stats.bookmarks)}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export async function fetchTweetData(tweetPath: string) {
  const fetchFromApi = async (path: string) => {
    const response = await fetch(`https://api.fxtwitter.com/${path}`, {
      cache: "force-cache",
      next: { revalidate: 36000 },
      headers: new Headers({ "User-Agent": "aryanbaburajan/tweet" }),
    });
    return await response.json();
  };

  registerFont(path.join(process.cwd(), "/public/fonts/chirp-bold.ttf"), {
    family: "Chirp",
  });
  registerFont(path.join(process.cwd(), "/public/fonts/chirp-heavy.ttf"), {
    family: "Chirp",
  });
  registerFont(path.join(process.cwd(), "/public/fonts/chirp-medium.ttf"), {
    family: "Chirp",
  });
  registerFont(path.join(process.cwd(), "/public/fonts/chirp-regular.ttf"), {
    family: "Chirp",
  });

  let tweetData = (await fetchFromApi(tweetPath)).tweet;

  tweetData.text = wrapText(tweetData.text, 568, 18, "Chirp");

  const { replies, retweets, likes, bookmarks, views, ...rest } = tweetData;
  tweetData = {
    ...rest,
    stats: {
      replies,
      retweets,
      likes,
      bookmarks,
      views,
    },
  };
  tweetData.isRoot = true;

  if (tweetData.quote) {
    const quoteResponse = await fetchFromApi(tweetData.quote.url.substr(14));
    let quoteTweetData = quoteResponse.tweet;

    console.log(quoteTweetData);

    quoteTweetData.text = wrapText(quoteTweetData.text, 568, 18, "Chirp");

    delete quoteTweetData.quote;
    quoteTweetData.isRoot = false;

    tweetData.quote = quoteTweetData;
  }

  return tweetData;
}
