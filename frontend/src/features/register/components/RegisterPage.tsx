"use client";

import { useState } from "react";
import { useCart } from "@/features/register/hooks/useCart";
import { useProducts } from "@/features/register/hooks/useProducts";
import { useRegister } from "@/features/register/hooks/useRegister";
import { CategoryFilter } from "./CategoryFilter";
import { ProductCard } from "./ProductCard";
import { CartPanel } from "./CartPanel";
import { CustomizeModal } from "./CustomizeModal";
import { OrderConfirmModal } from "./OrderConfirmModal";
import { PaymentModal } from "./PaymentModal";
import { CompleteModal } from "./CompleteModal";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { ErrorMessage } from "@/shared/components/ErrorMessage";
import { Product, CartItemOption, PaymentMethod } from "@/types";
import { createOrder } from "@/lib/api/orders";

export const RegisterPage = () => {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalAmount,
  } = useCart();

  const {
    products,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    isLoading,
    error,
  } = useProducts();

  const {
    step,
    orderType,
    setOrderType,
    tableNumber,
    setTableNumber,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    paymentMethod,
    setPaymentMethod,
    goToConfirm,
    goToPayment,
    goToComplete,
    goToOrder,
    reset,
  } = useRegister();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState<number | null>(null);
  const [dailyOrderNumber, setDailyOrderNumber] = useState<number | null>(null);
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(
    null,
  );

  const handleProductClick = (product: Product) => {
    if (product.is_customizable && product.option_groups.length > 0) {
      setCustomizingProduct(product);
    } else {
      addToCart(product, []);
    }
  };

  const handleCustomizeAdd = (options: CartItemOption[]) => {
    if (!customizingProduct) return;
    addToCart(customizingProduct, options);
    setCustomizingProduct(null);
  };

  const handleConfirmOrder = async () => {
    if (!paymentMethod || !orderType) return;
    setIsSubmitting(true);
    try {
      const result = await createOrder({
        order_type: orderType,
        table_number: tableNumber || undefined,
        customer_name: customerName || undefined,
        customer_phone: customerPhone || undefined,
        payment_method: paymentMethod,
        total_amount: totalAmount,
        items: cart.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.subtotal,
          options: item.options.map((o) => ({
            option_item_id: o.option_item_id,
            price_diff: o.price_diff,
          })),
        })),
      });
      setCompletedOrderId(result.order.id);
      setDailyOrderNumber(result.daily_number);
      goToComplete();
    } catch {
      alert("注文の送信に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = () => {
    clearCart();
    reset();
    setCompletedOrderId(null);
    setDailyOrderNumber(null);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden p-4 gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">🍔 レジ</h1>
        </div>

        <CategoryFilter
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
        />

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-3 gap-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={handleProductClick}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="w-80 p-4">
        <CartPanel
          cart={cart}
          totalAmount={totalAmount}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onProceed={goToConfirm}
        />
      </div>

      {customizingProduct && (
        <CustomizeModal
          product={customizingProduct}
          onAdd={handleCustomizeAdd}
          onClose={() => setCustomizingProduct(null)}
        />
      )}

      {step === "confirm" && (
        <OrderConfirmModal
          cart={cart}
          totalAmount={totalAmount}
          orderType={orderType}
          tableNumber={tableNumber}
          customerName={customerName}
          customerPhone={customerPhone}
          onOrderTypeChange={setOrderType}
          onTableNumberChange={setTableNumber}
          onCustomerNameChange={setCustomerName}
          onCustomerPhoneChange={setCustomerPhone}
          onNext={goToPayment}
          onBack={goToOrder}
        />
      )}

      {step === "payment" && (
        <PaymentModal
          totalAmount={totalAmount}
          paymentMethod={paymentMethod}
          onPaymentMethodChange={(method: PaymentMethod) =>
            setPaymentMethod(method)
          }
          onConfirm={handleConfirmOrder}
          onBack={goToConfirm}
          isLoading={isSubmitting}
        />
      )}

      {step === "complete" && completedOrderId && (
        <CompleteModal
          orderId={completedOrderId}
          dailyOrderNumber={dailyOrderNumber ?? completedOrderId}
          orderType={orderType}
          tableNumber={tableNumber}
          customerName={customerName}
          paymentMethod={paymentMethod}
          cart={cart}
          totalAmount={totalAmount}
          onClose={handleComplete}
        />
      )}
    </div>
  );
};
