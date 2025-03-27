import { cn } from '@/lib/utils';
import { Navbar } from '@/components/layout/navbar';

export default function Home() {
  return (
    <div className="pt-[4.1rem] text-foreground/90 ">
      <Navbar />
      <main>
        <div className="flex h-[calc(100vh-4.1rem)] w-full items-center justify-center">
          <h1 className="text-4xl font-bold text-red-400">Yalla hob Landing page</h1>
        </div>
      </main>
    </div>
  );
}
