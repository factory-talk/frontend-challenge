import { X } from "lucide-react";

type City = {
  name: string;
  lat: number;
  lon: number;
  country: string;
};

const CityCard = ({
  item,
  onDelete,
  onClickCity,
}: {
  item: City;
  onDelete?: () => void;
  onClickCity?: () => void;
}) => {
  return (
   <div
  onClick={onClickCity}
  className="relative cursor-pointer p-4 rounded-xl bg-card border shadow transition hover:shadow-lg hover:ring-1 hover:ring-primary/20"
>
  <button
    onClick={(e) => {
      e.stopPropagation()
      onDelete?.()
    }}
    className="absolute top-2 right-2 text-muted-foreground hover:text-destructive transition"
    title="Remove"
  >
    <X size={16} />
  </button>
  <div className="space-y-1 text-sm text-muted-foreground">
    <p className="text-base text-foreground font-semibold">
      📍 {item?.name}, {item?.country}
    </p>
    <p>🌐 Latitude: {item?.lat}</p>
    <p>🌐 Longitude: {item?.lon}</p>
  </div>
</div>

  );
};

export { CityCard };
