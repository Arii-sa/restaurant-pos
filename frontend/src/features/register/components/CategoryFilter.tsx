import { Category } from "@/types";

type Props = {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelect: (id: number | null) => void;
};

export const CategoryFilter = ({
  categories,
  selectedCategoryId,
  onSelect,
}: Props) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
          selectedCategoryId === null
            ? "bg-orange-500 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        すべて
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedCategoryId === category.id
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};
