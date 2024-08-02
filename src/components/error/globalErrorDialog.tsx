import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography } from "@material-tailwind/react";
import { useState, useEffect } from "react";

export function GlobalErrorDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleShowError = (event: CustomEvent) => {
      setErrorMessage(event.detail);
      setIsOpen(true);
    };

    window.addEventListener("showGlobalError", handleShowError);

    return () => {
      window.removeEventListener("showGlobalError", handleShowError);
    };
  }, []);

  const closeError = () => {
    setIsOpen(false);
    setErrorMessage("");
  };

  return (
    <Dialog open={isOpen} handler={closeError}>
      <DialogHeader>Error</DialogHeader>
      <DialogBody>
        <Typography color="red">{errorMessage}</Typography>
      </DialogBody>
      <DialogFooter>
        <Button color="red" onClick={closeError}>Close</Button>
      </DialogFooter>
    </Dialog>
  );
}

// Export the showError function to be used globally
export const globalErrorDialog = {
  showError: (message: string) => {
    setTimeout(() => {
      const event = new CustomEvent("showGlobalError", { detail: message });
      window.dispatchEvent(event);
    }, 0);
  }
};