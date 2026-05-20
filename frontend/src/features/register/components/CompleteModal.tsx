"use client";

type Props = {
  orderType: string | null;
  tableNumber: string;
  customerName: string;
  onClose: () => void;
};

export const CompleteModal = ({
  orderType,
  tableNumber,
  customerName,
  onClose,
}: Props) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm text-center p-8">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">注文完了！</h2>
        <p className="text-gray-500 mb-4">ご注文ありがとうございます</p>

        {orderType === "dine_in" && tableNumber && (
          <div className="bg-orange-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500">テーブル番号</p>
            <p className="text-2xl font-bold text-orange-500">{tableNumber}</p>
          </div>
        )}

        {orderType === "takeout" && customerName && (
          <div className="bg-orange-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500">お名前</p>
            <p className="text-2xl font-bold text-orange-500">{customerName}</p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors"
        >
          次の注文へ
        </button>
      </div>
    </div>
  );
};
