import { createContext, useContext } from "react";
import { useState } from "react";
import { Session } from "next-auth";

type ContextT = ReturnType<typeof useState<string | undefined>>;
type ContextTT = { avatar: ContextT[0]; setAvatar: ContextT[1] };

const AvatarContext = createContext<ContextTT>({
  avatar: undefined,
  setAvatar: () => {},
});

const useAvatar = (user: Session["user"] | undefined) => {
  if (!AvatarContext) {
    throw new Error("useAvatar is unavailable in server component");
  }
  if (!user) {
    return;
  }
  const { avatar, setAvatar } = useContext(AvatarContext);
  if (avatar) {
    return avatar;
  }

  try {
    fetch(
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
      });
  } catch (e) {
    console.log("avatar error");
    console.log(e);
  }
};

export { AvatarContext, useAvatar };
