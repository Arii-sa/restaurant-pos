import { Product } from "@/types";

type Props = {
  product: Product;
  onClick: (product: Product) => void;
};

export const ProductCard = ({ product, onClick }: Props) => {
  return (
    <button
      onClick={() => onClick(product)}
      className="bg-white rounded-xl border border-gray-200 p-4 text-left hover:border-orange-400 hover:shadow-md transition-all active:scale-95"
    >
      <div className="aspect-square bg-orange-50 rounded-lg mb-3 flex items-center justify-center">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <span className="text-4xl">🍔</span>
        )}
      </div>
      <p className="font-medium text-gray-800 text-sm leading-tight">
        {product.name}
      </p>
      <p className="text-orange-500 font-bold mt-1">
        ¥{product.price.toLocaleString()}
      </p>
      {product.is_customizable && (
        <span className="text-xs text-gray-400 mt-1 block">カスタマイズ可</span>
      )}
    </button>
  );
};
