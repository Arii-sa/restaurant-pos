"use client";

import { useState } from "react";
import { Product, OptionGroup, OptionItem, CartItemOption } from "@/types";

type Props = {
  product: Product;
  onAdd: (options: CartItemOption[]) => void;
  onClose: () => void;
};

export const CustomizeModal = ({ product, onAdd, onClose }: Props) => {
  const [singleSelections, setSingleSelections] = useState<
    Record<number, number | null>
  >(() => {
    const init: Record<number, number | null> = {};
    product.option_groups.forEach((group) => {
      if (group.type === "single") {
        const defaultItem = group.option_items.find((i) => i.is_default);
        init[group.id] = defaultItem?.id ?? null;
      }
    });
    return init;
  });

  const [multiSelections, setMultiSelections] = useState<
    Record<number, Set<number>>
  >(() => {
    const init: Record<number, Set<number>> = {};
    product.option_groups.forEach((group) => {
      if (group.type === "multi") {
        init[group.id] = new Set<number>();
      }
    });
    return init;
  });

  const canAdd = product.option_groups
    .filter((g) => g.required && g.type === "single")
    .every(
      (g) =>
        singleSelections[g.id] !== null && singleSelections[g.id] !== undefined,
    );

  const handleSingleSelect = (groupId: number, itemId: number) => {
    setSingleSelections((prev) => ({ ...prev, [groupId]: itemId }));
  };

  const handleMultiToggle = (groupId: number, itemId: number) => {
    setMultiSelections((prev) => {
      const next = new Set<number>(prev[groupId]);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return { ...prev, [groupId]: next };
    });
  };

  const handleAdd = () => {
    const options: CartItemOption[] = [];

    product.option_groups.forEach((group) => {
      if (group.type === "single") {
        const selectedId = singleSelections[group.id];
        if (selectedId !== null && selectedId !== undefined) {
          const item = group.option_items.find((i) => i.id === selectedId);
          if (item) {
            options.push({
              option_item_id: item.id,
              option_item_name: item.name,
              price_diff: item.price_diff,
            });
          }
        }
      } else {
        const selected = multiSelections[group.id];
        if (selected) {
          selected.forEach((itemId) => {
            const item = group.option_items.find((i) => i.id === itemId);
            if (item) {
              options.push({
                option_item_id: item.id,
                option_item_name: item.name,
                price_diff: item.price_diff,
              });
            }
          });
        }
      }
    });

    onAdd(options);
  };

  const calcOptionTotal = (): number => {
    let total = 0;
    product.option_groups.forEach((group) => {
      if (group.type === "single") {
        const selectedId = singleSelections[group.id];
        if (selectedId !== null && selectedId !== undefined) {
          const item = group.option_items.find((i) => i.id === selectedId);
          total += item?.price_diff ?? 0;
        }
      } else {
        const selected = multiSelections[group.id];
        if (selected) {
          selected.forEach((itemId) => {
            const item = group.option_items.find((i) => i.id === itemId);
            total += item?.price_diff ?? 0;
          });
        }
      }
    });
    return total;
  };

  const optionTotal = calcOptionTotal();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">{product.name}</h2>
          <p className="text-orange-500 font-bold mt-1">
            ¥{product.price.toLocaleString()}
            {optionTotal > 0 && (
              <span className="text-sm text-gray-400 ml-2">
                + ¥{optionTotal.toLocaleString()}
              </span>
            )}
          </p>
        </div>

        <div className="p-6 space-y-6">
          {product.option_groups.map((group) => (
            <OptionGroupSection
              key={group.id}
              group={group}
              singleSelected={singleSelections[group.id] ?? null}
              multiSelected={multiSelections[group.id] ?? new Set<number>()}
              onSingleSelect={handleSingleSelect}
              onMultiToggle={handleMultiToggle}
            />
          ))}
        </div>

        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
          >
            キャンセル
          </button>
          <button
            onClick={handleAdd}
            disabled={!canAdd}
            className="flex-1 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            カートに追加
            <span className="ml-2 text-sm font-normal">
              ¥{(product.price + optionTotal).toLocaleString()}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

type SectionProps = {
  group: OptionGroup;
  singleSelected: number | null;
  multiSelected: Set<number>;
  onSingleSelect: (groupId: number, itemId: number) => void;
  onMultiToggle: (groupId: number, itemId: number) => void;
};

const OptionGroupSection = ({
  group,
  singleSelected,
  multiSelected,
  onSingleSelect,
  onMultiToggle,
}: SectionProps) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <p className="font-medium text-gray-800">{group.name}</p>
        {group.required && (
          <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">
            必須
          </span>
        )}
        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
          {group.type === "single" ? "1つ選択" : "複数選択可"}
        </span>
      </div>
      <div className="space-y-2">
        {group.option_items.map((item) => (
          <OptionItemButton
            key={item.id}
            item={item}
            isSelected={
              group.type === "single"
                ? singleSelected === item.id
                : multiSelected.has(item.id)
            }
            onClick={() =>
              group.type === "single"
                ? onSingleSelect(group.id, item.id)
                : onMultiToggle(group.id, item.id)
            }
            isMulti={group.type === "multi"}
          />
        ))}
      </div>
    </div>
  );
};

type ItemButtonProps = {
  item: OptionItem;
  isSelected: boolean;
  onClick: () => void;
  isMulti: boolean;
};

const OptionItemButton = ({
  item,
  isSelected,
  onClick,
  isMulti,
}: ItemButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-colors ${
        isSelected
          ? "border-orange-500 bg-orange-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-5 h-5 flex items-center justify-center border-2 transition-colors ${
            isMulti ? "rounded" : "rounded-full"
          } ${isSelected ? "border-orange-500 bg-orange-500" : "border-gray-300"}`}
        >
          {isSelected && (
            <span className="text-white text-xs font-bold">✓</span>
          )}
        </div>
        <span
          className={`font-medium ${isSelected ? "text-orange-600" : "text-gray-700"}`}
        >
          {item.name}
        </span>
      </div>
      {item.price_diff !== 0 && (
        <span
          className={`text-sm ${isSelected ? "text-orange-500" : "text-gray-400"}`}
        >
          {item.price_diff > 0 ? "+" : ""}¥{item.price_diff.toLocaleString()}
        </span>
      )}
    </button>
  );
};
