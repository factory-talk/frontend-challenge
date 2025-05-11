interface AppHeaderProps {
  onClickAdd: () => void;
}

export default function AppHeader({ onClickAdd }: AppHeaderProps) {
  return (
    <div className="w-full flex items-center justify-between mb-5 relative">
      <header className="font-playwrite absolute left-1/2 transform -translate-x-1/2 text-white text-2xl font-semibold tracking-wide drop-shadow-md">
        Weather List
      </header>
      <div className="flex justify-end ml-auto">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 p-0 hover:bg-primary-light transition-all"
          onClick={onClickAdd}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary"
          >
            <path
              d="M12 5V19M5 12H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
