import { Button } from "@/components/ui/button";
import { clientUrl } from "@/lib/data/web-url";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function UnauthenticatedButton() {
  const pathName = usePathname();

  return (
    <div className="flex items-center gap-1">
      <Link href={clientUrl.register.path}>
        {" "}
        <Button
          variant="outline"
          className="px-5 py-2 rounded-lg font-medium hover:bg-muted"
        >
          Đăng ký
        </Button>
      </Link>
      <Link href={`${clientUrl.login.path}?redirect=${pathName}`}>
        <Button className="px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary/90">
          Đăng nhập
        </Button>
      </Link>
    </div>
  );
}
