import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getNameAbbreviation } from "@/lib/schemas/common";

type Props = {
  imageUrl?: string | null;
  userFullName?: string | null;
};

export default function UserAvatarProfile({ imageUrl, userFullName }: Props) {
  return (
    <div>
      <Avatar className="h-24 w-24">
        <AvatarImage src={imageUrl ?? ""} alt={"User Avatar"} />
        <AvatarFallback>{getNameAbbreviation(userFullName)}</AvatarFallback>
      </Avatar>
    </div>
  );
}
