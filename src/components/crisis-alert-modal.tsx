"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useAppState } from "@/context/app-state-context";

export function CrisisAlertModal() {
  const { crisisAlertOpen, setCrisisAlertOpen, alertMessage } = useAppState();

  return (
    <AlertDialog open={crisisAlertOpen} onOpenChange={setCrisisAlertOpen}>
      <AlertDialogContent className="border-destructive bg-background">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive text-2xl">HABITAT ALERT</AlertDialogTitle>
          <AlertDialogDescription className="text-foreground/90 text-lg">
            {alertMessage}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction 
            onClick={() => setCrisisAlertOpen(false)} 
            className="bg-destructive hover:bg-destructive/80"
          >
            Acknowledge
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
