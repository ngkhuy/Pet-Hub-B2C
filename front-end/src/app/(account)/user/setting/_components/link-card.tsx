import Link from "next/link";

type LinkCardType = {
  url: string;
  children: React.ReactNode;
};

export function LinkCard({ url, children }: LinkCardType) {
  return (
    <Link
      href={url}
      className="
            transition-all duration-300 ease-out
            hover:scale-[1.01] hover:-translate-y-1
            hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)]
            cursor-pointer
          bg-white dark:bg-(--background-secondary) p-6 lg:p-8 rounded-xl shadow-sm dark:border-gray-700"
    >
      {children}
    </Link>
  );
}
