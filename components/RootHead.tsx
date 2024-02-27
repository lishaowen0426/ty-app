"use client";

import React from "react";
import { mediaStyles } from "@/components/Media";

function RootHead() {
  return (
    <head>
      <style
        key="distance-css"
        dangerouslySetInnerHTML={{ __html: mediaStyles }}
        type="text/css"
      />
    </head>
  );
}

export default RootHead;
