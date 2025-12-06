import { BiInfoCircle } from "react-icons/bi";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function PhoneTooltip() {
  return (
    <Tooltip>
      <TooltipTrigger asChild className="cursor-pointer">
        <BiInfoCircle />
      </TooltipTrigger>
      <TooltipContent className="bg-white text-(--text-primary) border-secondary/40 border-2">
        <p className="font-medium mb-1">Số điện thoại hợp lệ:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>
            Bắt đầu bằng <code>0</code> hoặc <code>+84</code>
          </li>
          <li>
            Ví dụ: <code>0912345678</code>, <code>+84981234567</code>
          </li>
          <li>Độ dài: 10 chữ số (hoặc 11 nếu có mã vùng)</li>
        </ul>
      </TooltipContent>
    </Tooltip>
  );
}
