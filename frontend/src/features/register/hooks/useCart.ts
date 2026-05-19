import { useState, useCallback } from "react";
import { CartItem, CartItemOption, Product } from "@/types";
import { v4 as uuidv4 } from "uuid";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // カートに商品を追加
  const addToCart = useCallback(
    (product: Product, options: CartItemOption[] = []) => {
      const optionTotal = options.reduce((sum, o) => sum + o.price_diff, 0);
      const unitPrice = product.price + optionTotal;

      setCart((prev) => {
        // 同じ商品・同じオプションがあれば数量を増やす
        const sameItem = prev.find(
          (item) =>
            item.product.id === product.id &&
            JSON.stringify(item.options) === JSON.stringify(options),
        );

        if (sameItem) {
          return prev.map((item) =>
            item.cartId === sameItem.cartId
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  subtotal: unitPrice * (item.quantity + 1),
                }
              : item,
          );
        }

        return [
          ...prev,
          {
            cartId: uuidv4(),
            product,
            quantity: 1,
            unit_price: unitPrice,
            subtotal: unitPrice,
            options,
          },
        ];
      });
    },
    [],
  );

  // カートから商品を削除
  const removeFromCart = useCallback((cartId: string) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  }, []);

  // 数量を変更
  const updateQuantity = useCallback((cartId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.cartId !== cartId));
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.cartId === cartId
          ? { ...item, quantity, subtotal: item.unit_price * quantity }
          : item,
      ),
    );
  }, []);

  // カートをリセット
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // 合計金額
  const totalAmount = cart.reduce((sum, item) => sum + item.subtotal, 0);

  // 合計個数
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalAmount,
    totalCount,
  };
};
