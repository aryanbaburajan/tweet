import { createClassPropHelper } from "@/lib/utils";

export default function MediaGrid({
  media,
  useSatori = false,
}: {
  media: any[];
  useSatori?: boolean;
}) {
  const cx = createClassPropHelper(useSatori);

  const count = media.length;

  media = media.map((medium) => {
    if (medium.type === "video" || medium.type === "gif")
      medium.url = medium.thumbnail_url;
    return medium;
  });

  if (count === 0) return null;

  if (count === 1) {
    return (
      <div {...cx("w-full flex flex-row rounded-2xl overflow-hidden")}>
        <img src={media[0].url} />
      </div>
    );
  }

  return (
    <div {...cx("w-full h-[292px] flex flex-row")}>
      {(() => {
        if (count === 2) {
          return (
            <>
              <div {...cx("flex flex-col w-1/2 mr-[1px]")}>
                <MediaImage
                  src={media[0].url}
                  orientation="vertical"
                  className="h-full rounded-tl-2xl rounded-bl-2xl"
                  cx={cx}
                />
              </div>
              <div {...cx("flex flex-col w-1/2 ml-[1px]")}>
                <MediaImage
                  src={media[1].url}
                  orientation="vertical"
                  className="h-full rounded-tr-2xl rounded-br-2xl"
                  cx={cx}
                />
              </div>
            </>
          );
        }

        if (count === 3) {
          return (
            <>
              <div {...cx("flex flex-col w-1/2 mr-[1px] mb-[-2px]")}>
                <MediaImage
                  src={media[0].url}
                  orientation="vertical"
                  className="h-full rounded-tl-2xl rounded-bl-2xl"
                  cx={cx}
                />
              </div>
              <div {...cx("flex flex-col w-1/2 ml-[1px]")}>
                <MediaImage
                  src={media[1].url}
                  orientation="horizontal"
                  className="h-1/2 rounded-tr-2xl mb-[1px]"
                  cx={cx}
                />
                <MediaImage
                  src={media[2].url}
                  orientation="horizontal"
                  className="h-1/2 rounded-br-2xl mt-[1px]"
                  cx={cx}
                />
              </div>
            </>
          );
        }

        if (count === 4) {
          return (
            <>
              <div {...cx("flex flex-col w-1/2 mr-[1px]")}>
                <MediaImage
                  src={media[0].url}
                  orientation="horizontal"
                  className="h-1/2 rounded-tl-2xl mb-[1px]"
                  cx={cx}
                />
                <MediaImage
                  src={media[2].url}
                  orientation="horizontal"
                  className="h-1/2 rounded-bl-2xl mt-[1px]"
                  cx={cx}
                />
              </div>
              <div {...cx("flex flex-col w-1/2 ml-[1px]")}>
                <MediaImage
                  src={media[1].url}
                  orientation="horizontal"
                  className="h-1/2 rounded-tr-2xl mb-[1px]"
                  cx={cx}
                />
                <MediaImage
                  src={media[3].url}
                  orientation="horizontal"
                  className="h-1/2 rounded-br-2xl mt-[1px]"
                  cx={cx}
                />
              </div>
            </>
          );
        }
      })()}
    </div>
  );
}

function MediaImage({
  src,
  cx,
  className,
  orientation,
}: {
  src: string;
  cx: ReturnType<typeof createClassPropHelper>;
  className?: string;
  orientation: "horizontal" | "vertical";
}) {
  return (
    <div
      {...cx(`flex items-center justify-center overflow-hidden ${className}`)}
    >
      {orientation === "horizontal" ? (
        <img src={src} width="100%" />
      ) : (
        <img src={src} height="100%" />
      )}
    </div>
  );
}
