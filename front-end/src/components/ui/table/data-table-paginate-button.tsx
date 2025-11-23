import { Button } from "@/components/ui/button";

type DataTablePaginateButtonProps = {
  onPreviousClick: () => void;
  onNextClick: () => void;
  isPreviousDisabled: boolean;
  isNextDisabled: boolean;
};

export default function DataTablePaginateButton({
  isNextDisabled,
  isPreviousDisabled,
  onNextClick,
  onPreviousClick,
}: DataTablePaginateButtonProps) {
  return (
    <div>
      {" "}
      <Button
        variant="outline"
        size="sm"
        onClick={onPreviousClick}
        disabled={isPreviousDisabled}
      >
        Trang trước
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onNextClick}
        disabled={isNextDisabled}
      >
        Trang sau
      </Button>
    </div>
  );
}
