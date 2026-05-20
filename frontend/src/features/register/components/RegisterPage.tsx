"use client";

import { useState } from "react";
import { useCart } from "@/features/register/hooks/useCart";
import { useProducts } from "@/features/register/hooks/useProducts";
import { useRegister } from "@/features/register/hooks/useRegister";
import { CategoryFilter } from "./CategoryFilter";
import { ProductCard } from "./ProductCard";
import { CartPanel } from "./CartPanel";
import { OrderConfirmModal } from "./OrderConfirmModal";
import { PaymentModal } from "./PaymentModal";
import { CompleteModal } from "./CompleteModal";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";
import { ErrorMessage } from "@/shared/components/ErrorMessage";
import { Product, PaymentMethod } from "@/types";
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

  const handleProductClick = (product: Product) => {
    addToCart(product, []);
  };

  const handleConfirmOrder = async () => {
    if (!paymentMethod || !orderType) return;
    setIsSubmitting(true);
    try {
      await createOrder({
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
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 左側：商品選択エリア */}
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

      {/* 右側：カートエリア */}
      <div className="w-80 p-4">
        <CartPanel
          cart={cart}
          totalAmount={totalAmount}
          onRemove={removeFromCart}
          onUpdateQuantity={updateQuantity}
          onProceed={goToConfirm}
        />
      </div>

      {/* 注文確認モーダル */}
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

      {/* 支払いモーダル */}
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

      {/* 完了モーダル */}
      {step === "complete" && (
        <CompleteModal
          orderType={orderType}
          tableNumber={tableNumber}
          customerName={customerName}
          onClose={handleComplete}
        />
      )}
    </div>
  );
};
