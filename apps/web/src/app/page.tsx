import ApiStatus from "@/components/ApiStatus";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-8">
      <h1 className="text-4xl font-bold">Travel Log</h1>
      <p className="text-gray-600">Every trip, day by day.</p>
      <ApiStatus />
    </main>
  );
}
