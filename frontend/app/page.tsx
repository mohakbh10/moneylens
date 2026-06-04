"use client";

import { useEffect } from "react";
import { getUploads } from "@/lib/api";

export default function Home() {

  useEffect(() => {

    async function load() {

      const uploads =
        await getUploads();

      console.log(
        uploads
      );
    }

    load();

  }, []);

  return (
    <div>
      MoneyLens
    </div>
  );
}