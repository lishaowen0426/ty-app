"use client";

import classes from "@/components/style/Message.module.css";

export interface MessageSender {}
export interface MessageReceiver {}

export interface MessageProp {
  msg: string;
  sender: MessageSender;
  recv?: MessageReceiver;
}

export default function Message() {
  return (
    <div className={classes["msg-container"]}>
      <p className={`${classes["content"]} ${classes["left"]}`}>
        {"你好".repeat(20)}
      </p>
      <p className={`${classes["content"]} ${classes["right"]}`}>
        {"你好".repeat(20)}
      </p>
      <p className={`${classes["content"]} ${classes["left"]}`}>
        {"你好".repeat(20)}
      </p>
      <p className={`${classes["content"]} ${classes["left"]}`}>
        {"你好".repeat(20)}
      </p>
    </div>
  );
}
