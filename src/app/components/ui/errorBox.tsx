interface ErrorBoxProps {
  Title: string;
  Detail: string;
}

export default function ErrorBox({Title, Detail}: ErrorBoxProps) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 p-6 rounded mt-12">
      <h2 className="text-2xl font-semibold">Error loading {Title}.</h2>
      <p>{Detail}</p>
    </div>
  );
}