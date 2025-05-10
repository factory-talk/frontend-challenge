export default function SkeletonTable() {
  const skeletonArray = Array.from({ length: 10 });

  return skeletonArray.map((_, index) => (
    <li key={index} className="list-none p-2 mb-2 bg-white/10 rounded-lg">
      <div className="flex items-center animate-pulse">
        <div className="w-12 h-12 bg-gray-300 rounded-full dark:bg-gray-700" />
        <div className="flex-1 min-w-0 ms-4 space-y-2">
          <div className="h-3 w-1/2 bg-gray-300 rounded dark:bg-gray-600" />
          <div className="h-3 w-1/3 bg-gray-300 rounded dark:bg-gray-600" />
        </div>
        <div className="w-10 h-4 bg-gray-300 rounded dark:bg-gray-600 mr-5" />
      </div>
    </li>
  ));
}