"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { mergeCloudFavorites } from "@/lib/saved";

// When the user is signed in, merge their device favorites with the cloud
// (union), so nothing is lost and both stay in sync.
export default function FavoritesSync() {
  const { status } = useSession();
  useEffect(() => {
    if (status === "authenticated") mergeCloudFavorites();
  }, [status]);
  return null;
}
