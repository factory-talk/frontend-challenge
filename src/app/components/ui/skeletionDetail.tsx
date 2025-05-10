export default function SkeletonDetail() {
  return (
    <div className="flex flex-col items-center justify-center w-full mt-8 text-white">
      <div className="h-10 w-1/2 bg-white/20 rounded animate-pulse mb-2" />
      <div className="h-6 w-1/3 bg-white/20 rounded animate-pulse mb-4" />

      <div className="w-[100px] h-[100px] bg-white/20 rounded-full animate-pulse mb-4" />

      <div className="w-full overflow-x-auto rounded-lg">
        <table className="w-full table-auto border-collapse border border-gray-300 bg-white/10 shadow-md rounded animate-pulse">
          <thead className="bg-white/20 text-gray-300">
            <tr>
              <th className="px-4 py-2 text-left">Parameter</th>
              <th className="px-4 py-2 text-left">Value</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 9 }).map((_, i) => (
              <tr
                key={i}
                className={i % 2 === 0 ? "bg-white/5" : "bg-white/10"}
              >
                <td className="px-4 py-2">
                  <div className="h-4 w-3/4 bg-white/30 rounded" />
                </td>
                <td className="px-4 py-2">
                  <div className="h-4 w-1/2 bg-white/30 rounded" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
