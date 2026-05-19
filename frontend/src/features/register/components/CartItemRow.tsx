import { CartItem } from "@/types";

type Props = {
  item: CartItem;
  onRemove: (cartId: string) => void;
  onUpdateQuantity: (cartId: string, quantity: number) => void;
};

export const CartItemRow = ({ item, onRemove, onUpdateQuantity }: Props) => {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-800 text-sm truncate">
          {item.product.name}
        </p>
        {item.options.length > 0 && (
          <p className="text-xs text-gray-400 mt-0.5">
            {item.options.map((o) => o.option_item_name).join(" / ")}
          </p>
        )}
        <p className="text-orange-500 font-bold text-sm mt-1">
          ¥{item.subtotal.toLocaleString()}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.cartId, item.quantity - 1)}
          className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors text-lg leading-none"
        >
          −
        </button>
        <span className="w-6 text-center font-medium text-sm">
          {item.quantity}
        </span>
        <button
          onClick={() => onUpdateQuantity(item.cartId, item.quantity + 1)}
          className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center hover:bg-orange-200 transition-colors text-lg leading-none"
        >
          ＋
        </button>
        <button
          onClick={() => onRemove(item.cartId)}
          className="w-7 h-7 rounded-full bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors text-sm ml-1"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
