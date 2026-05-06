import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../types/common";

interface IPriceProps {
  from: number;
  to: number;
}

const useFilterByBrand = (
  products: Product[],
  checkboxBrands: any[],
  price?: IPriceProps,
  selectedBrandIds: string[] = [],
  selectedSizes: string[] = [],
  selectedMaterials: string[] = [],
  selectedColors: string[] = [],
) => {
  const [checkedFilterItems, setCheckedFilterItems] = useState<string[]>([]);
  const { url } = useParams();

  // Очистка при смене категории
  useEffect(() => {
    setCheckedFilterItems([]);
  }, [url]);

  // Вычисляем доступные бренды (только те, что есть в текущих продуктах)
  const checkboxItems = useMemo(() => {
    return checkboxBrands.filter((brand) =>
      products.some((product) => product.brand.id === brand.id),
    );
  }, [products, checkboxBrands]);

  const checkFilterItem = (id: string) => {
    setCheckedFilterItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Единая логика фильтрации (Бренды + Цена + Размер + Материал + Цвет)
  const filteredProducts = useMemo(() => {
    const activeBrandFilter =
      selectedBrandIds.length > 0 ? selectedBrandIds : checkedFilterItems;

    return products.filter((product) => {
      // 1. Проверка по бренду (если выбраны)
      const matchesBrand =
        activeBrandFilter.length === 0 ||
        activeBrandFilter.includes(product.brand.id);

      // 2. Проверка по цене (всегда)
      let matchesPrice = null;
      if (price) {
        const finalPrice = product.discount?.discountedPrice || product.price;
        matchesPrice = finalPrice >= price.from && finalPrice <= price.to;
      }

      // 3. Проверка по размерам (если выбраны)
      const matchesSize =
        selectedSizes.length === 0 ||
        (product.sizes &&
          product.sizes.some((size) => selectedSizes.includes(size)));

      // 4. Проверка по материалам (если выбраны)
      // Примечание: материал хранится в CartItem, если доступен в products
      const matchesMaterial = selectedMaterials.length === 0; // TODO: добавить поле materials в Product

      // 5. Проверка по цветам (если выбраны)
      // Примечание: цвет хранится в CartItem, если доступен в products
      const matchesColor = selectedColors.length === 0; // TODO: добавить поле colors в Product

      return (
        matchesBrand &&
        matchesPrice &&
        matchesSize &&
        matchesMaterial &&
        matchesColor
      );
    });
  }, [
    price,
    checkedFilterItems,
    products,
    selectedBrandIds,
    selectedSizes,
    selectedMaterials,
    selectedColors,
  ]);

  return {
    checkFilterItem,
    productsTorender: filteredProducts,
    checkboxItems,
    checkedFilterItems,
  };
};

export default useFilterByBrand;
