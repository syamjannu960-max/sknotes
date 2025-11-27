
import { Loader } from "lucide-react";

export function PageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader className="h-8 w-8 animate-spin" />
    </div>
  );
}
