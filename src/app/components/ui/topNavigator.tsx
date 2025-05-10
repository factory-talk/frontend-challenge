interface TopNavigationProps {
  onClickBack: () => void;
}

export default function TopNavigation({onClickBack}: TopNavigationProps) {
  return (
    <div className="w-full flex items-center">
      <button
        onClick={onClickBack}
        className="flex items-center gap-2 text-white hover:text-gray-300 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span className="text-md font-medium">Back</span>
      </button>
    </div>
  );
}
