import { Input } from "@/components/components/ui/input"
import { SearchIcon } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
     <div className="flex items-center w-full max-w-sm space-x-2 rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-900 px-3.5 py-2">
      <SearchIcon className="h-4 w-4" />
      <Input type="search" placeholder="Search" className="w-full border-0 h-8 font-semibold" />
    </div>
    </main>
  );
}
