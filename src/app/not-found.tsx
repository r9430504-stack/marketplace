import Link from "next/link";
import { IconPhone } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <IconPhone className="mx-auto h-14 w-14 text-gray-300 dark:text-gray-600" />
      <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">
        Model not found
      </h1>
      <p className="mt-3 text-gray-500 dark:text-gray-400">
        This page doesn’t exist, or the phone hasn’t been added to the archive yet.
      </p>
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <Link href="/phones" className="btn-primary px-6 py-3">
          Open the catalog
        </Link>
        <Link href="/" className="btn-outline px-6 py-3">
          Go home
        </Link>
      </div>
    </div>
  );
}
