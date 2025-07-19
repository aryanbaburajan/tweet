import { fetchTweetData, Tweet } from "@/components/Tweet";

export default async function Test() {
  const tweetData = await fetchTweetData(
    "aryanbaburajan/status/1933965572020347247"
  );

  return <Tweet data={tweetData} useSatori={false} />;
}
