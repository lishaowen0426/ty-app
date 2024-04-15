import { ReactNode, createContext, useContext, Suspense } from "react";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, use, forwardRef } from "react";
import { Session } from "next-auth";

type ContextT = ReturnType<typeof useState<string | undefined>>;
type ContextTT = { avatar: ContextT[0]; setAvatar: ContextT[1] };

const AvatarContext = createContext<ContextTT>({
  avatar: undefined,
  setAvatar: () => {},
});

interface FetchAvatarProps {
  user: Session["user"];
}

const FetchAvatar = forwardRef<HTMLImageElement, FetchAvatarProps>(
  ({ user }, ref) => {
    if (!AvatarContext) {
      throw new Error("useAvatar is unavailable in server component");
    }

    const { avatar, setAvatar } = useContext(AvatarContext);
    if (avatar) {
      return <AvatarImage src={avatar} ref={ref} />;
    }

    let url;

    try {
      url = fetch(
        "/api/avatar?" +
          new URLSearchParams({
            user: user.id,
          }),
        {
          method: "GET",
        }
      )
        .then((resp) => {
          return resp.blob();
        })
        .then((blob) => {
          return URL.createObjectURL(blob);
        })
        .then((url) => {
          setAvatar(url);
          return url;
        });
    } catch (e) {
      console.log(e);
      throw e;
    }
    let res = use(url);
    return <AvatarImage src={res} ref={ref} />;
  }
);

interface UserAvatarProps {
  user?: Session["user"];
  children?: ReactNode;
  url?: string;
}

const UserAvatar = forwardRef<HTMLImageElement, UserAvatarProps>(
  ({ user, children, url }, ref) => {
    if (!user) {
      return children;
    }

    if (url) {
      return <AvatarImage src={url} ref={ref} />;
    }
    return (
      <Suspense fallback={children}>
        <FetchAvatar user={user} ref={ref} />
      </Suspense>
    );
  }
);

AvatarContext.displayName = "AvatarContext";
UserAvatar.displayName = "UserAvatar";
FetchAvatar.displayName = "FetchAvatar";

export { AvatarContext, UserAvatar };
