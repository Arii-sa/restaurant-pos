type Props = {
  message?: string;
};

export const LoadingSpinner = ({ message = "読み込み中..." }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3">
      <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
};
