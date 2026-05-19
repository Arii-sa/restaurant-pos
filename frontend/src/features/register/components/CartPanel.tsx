import { CartItem } from "@/types";
import { CartItemRow } from "./CartItemRow";

type Props = {
  cart: CartItem[];
  totalAmount: number;
  onRemove: (cartId: string) => void;
  onUpdateQuantity: (cartId: string, quantity: number) => void;
  onProceed: () => void;
};

export const CartPanel = ({
  cart,
  totalAmount,
  onRemove,
  onUpdateQuantity,
  onProceed,
}: Props) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200">
      <div className="p-4 border-b border-gray-100">
        <h2 className="font-bold text-gray-800">注文内容</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
            <span className="text-4xl">🛒</span>
            <p className="text-sm">商品を選択してください</p>
          </div>
        ) : (
          cart.map((item) => (
            <CartItemRow
              key={item.cartId}
              item={item}
              onRemove={onRemove}
              onUpdateQuantity={onUpdateQuantity}
            />
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-gray-800">合計</span>
          <span className="text-2xl font-bold text-orange-500">
            ¥{totalAmount.toLocaleString()}
          </span>
        </div>
        <button
          onClick={onProceed}
          disabled={cart.length === 0}
          className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          注文確認へ
        </button>
      </div>
    </div>
  );
};
