import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertCircle } from "lucide-react";

type ShowAlertProps = {
  open: boolean;
  reason: string;
  desc: string;
};

export default function ShowAlert({ open, reason, desc }: ShowAlertProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="bg-[#252526] border-[#3d3d3d] text-[#d4d4d4]">
        <AlertDialogHeader>
          <div className="flex justify-center mb-2">
            <div className="rounded-full bg-red-500/10 p-3">
              <AlertCircle className="size-6 text-red-400" />
            </div>
          </div>

          <AlertDialogTitle className="text-center text-white">
            {reason}
          </AlertDialogTitle>

          <AlertDialogDescription className="text-center text-[#999]">
            {desc}
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
