import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons/lib";

type NavLinkProps = {
  title: string;
  link?: string | null;
  IconName: IconType | null;
  action?: () => Promise<void>;
};

const SIDEBAR_LINK_ACTIVE =
  "shadow-2xl scale-105  bg-(--background-primary) border border-primary";

export const SIDEBAR_LINK_INACTIVE =
  " bg-white hover:shadow-2xl hover:scale-105  hover:bg-(--background-primary)";

const SIDEBAR_CONTENT_ACTIVE = "text-primary";

export const SIDEBAR_CONTENT_INACTIVE = "group-hover:text-secondary";

export default function NavLinkItem({
  IconName,
  link,
  title,
  action,
}: NavLinkProps) {
  const pathName = usePathname();

  const isActive = link && pathName.startsWith(link);

  async function handleAction() {
    await action?.();
  }

  return (
    <Link href={link ?? "#"} className="block" onClick={handleAction}>
      <div
        className={`rounded-lg flex items-center p-2 gap-3 group transition-all text-black  ${
          isActive ? SIDEBAR_LINK_ACTIVE : SIDEBAR_LINK_INACTIVE
        }`}
      >
        {IconName && (
          <IconName
            className={`size-6 ${
              isActive ? SIDEBAR_CONTENT_ACTIVE : SIDEBAR_CONTENT_INACTIVE
            }`}
          />
        )}
        <span
          className={`font-medium leading-normal ${
            isActive ? SIDEBAR_CONTENT_ACTIVE : SIDEBAR_CONTENT_INACTIVE
          }`}
        >
          {title}
        </span>
      </div>
    </Link>
  );
}
