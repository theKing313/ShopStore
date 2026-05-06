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

  // Единая логика фильтрации (Бренды + Цена)
  const filteredProducts = useMemo(() => {
    const activeBrandFilter =
      selectedBrandIds.length > 0 ? selectedBrandIds : checkedFilterItems;

    return products.filter((product) => {
      // 1. Проверка по бренду (если выбраны)
      const matchesBrand =
        activeBrandFilter.length === 0 ||
        activeBrandFilter.includes(product.brand.id);

      // 2. Проверка по цене (всегда)
      // ВАЖНО: используем актуальную цену товара (с учетом скидки, если есть)
      let matchesPrice = null;
      if (price) {
        const finalPrice = product.discount?.discountedPrice || product.price;
        matchesPrice = finalPrice >= price.from && finalPrice <= price.to;
      }

      return matchesBrand && matchesPrice;
    });
  }, [price, checkedFilterItems, products, selectedBrandIds]);

  return {
    checkFilterItem,
    productsTorender: filteredProducts, // Теперь это один массив с обоими фильтрами
    checkboxItems,
    checkedFilterItems, // Полезно знать, что именно выбрано
  };
};

export default useFilterByBrand;
