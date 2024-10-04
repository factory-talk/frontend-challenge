import { Suspense } from "react";
import SearchCities from "./_components/SearchCities";
import SelectedCities from "./_components/SelectedCities";
import TemperatureUnitOptions from "./_components/TemperatureUnitOptions";
import Loading from "./loading";

export default function Index() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-4 p-4">
      <h1 className="text-4xl font-bold text-center flex-2">Have a Good Weather Day!</h1>
      <Suspense fallback={<Loading />}>
        <SearchCities />
      </Suspense>
      <div className="flex justify-end w-full">
        <Suspense fallback={<Loading />}><TemperatureUnitOptions /></Suspense>
      </div>
      <Suspense fallback={<Loading />}><SelectedCities /></Suspense>
    </main>
  )
}