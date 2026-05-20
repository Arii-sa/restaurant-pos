import { useState } from "react";
import { OrderType, PaymentMethod } from "@/types";
import { RegisterStep } from "@/features/register/types";

export const useRegister = () => {
  const [step, setStep] = useState<RegisterStep>("order");
  const [orderType, setOrderType] = useState<OrderType | null>(null);
  const [tableNumber, setTableNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null,
  );

  const goToConfirm = () => setStep("confirm");
  const goToPayment = () => setStep("payment");
  const goToComplete = () => setStep("complete");
  const goToOrder = () => setStep("order");

  const reset = () => {
    setStep("order");
    setOrderType(null);
    setTableNumber("");
    setCustomerName("");
    setCustomerPhone("");
    setPaymentMethod(null);
  };

  return {
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
  };
};
