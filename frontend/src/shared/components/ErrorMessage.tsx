type Props = {
  message: string;
};

export const ErrorMessage = ({ message }: Props) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
        <p className="font-medium">エラーが発生しました</p>
        <p className="text-sm mt-1">{message}</p>
      </div>
    </div>
  );
};
