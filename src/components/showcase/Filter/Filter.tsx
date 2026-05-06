import React, { useEffect, useState } from "react";
import classes from "./Filter.module.css";

interface IPrice {
  from: number;
  to: number;
}

interface Brand {
  id: string;
  name?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;

  price: IPrice;
  setPrice: (price: IPrice) => void;

  brands: Brand[];
  selectedBrands: string[];
  setSelectedBrands: React.Dispatch<React.SetStateAction<string[]>>;
  selectedSizes: string[];
  setSelectedSizes: React.Dispatch<React.SetStateAction<string[]>>;
  onApply: () => void;
  onReset: () => void;
}

const FilterPanel: React.FC<Props> = ({
  isOpen,
  onClose,
  price,
  setPrice,
  brands,
  selectedBrands,
  setSelectedBrands,
  selectedSizes,
  setSelectedSizes,
  onApply,
  onReset,
}) => {
  const [localPrice, setLocalPrice] = useState(price);
  useEffect(() => {
    setLocalPrice(price);
  }, [price]);

  // const toggleSize = (size: string[]) => {
  //   setSelectedSizes((prev) =>
  //     prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
  //   );
  // };

  const toggleBrand = (brand: Brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand.id)
        ? prev.filter((id) => id !== brand.id)
        : [...prev, brand.id],
    );
  };

  const applyFilters = () => {
    setPrice(localPrice);
    onApply();
    onClose();
  };

  return (
    <>
      <div className={`${classes.panel} ${isOpen ? classes.open : ""}`}>
        <div className={classes.header}>
          <h2>Фильтры</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Цена */}
        <div className={classes.section}>
          <h3>Цена</h3>

          <div className={classes.priceInputs}>
            <input
              type="number"
              value={localPrice.from}
              onChange={(e) =>
                setLocalPrice({
                  ...localPrice,
                  from: Number(e.target.value),
                })
              }
            />
            <input
              type="number"
              value={localPrice.to}
              onChange={(e) =>
                setLocalPrice({
                  ...localPrice,
                  to: Number(e.target.value),
                })
              }
            />
          </div>

          <input
            type="range"
            min={0}
            max={5000}
            value={localPrice.to}
            onChange={(e) =>
              setLocalPrice({
                ...localPrice,
                to: Number(e.target.value),
              })
            }
          />
        </div>

        {/* Размеры */}
        <div className={classes.section}>
          <h3>Размер</h3>
          {/* <div className={classes.sizes}>
            {sizes.map((size) => (
              <button
                key={size}
                className={`${classes.sizeBtn} ${
                  selectedSizes.includes(size) ? classes.active : ""
                }`}
                onClick={() => toggleSize(size)}
              >
                {size}
              </button>
            ))}
          </div> */}
        </div>

        {/* Бренды */}
        <div className={classes.section}>
          <h3>Бренды</h3>
          <div className={classes.brands}>
            {brands.map((brand) => (
              <label key={brand.id}>
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand.id)}
                  onChange={() => toggleBrand(brand)}
                />
                {brand.name}
              </label>
            ))}
          </div>
        </div>

        {/* Кнопки */}
        <div className={classes.footer}>
          <button className={classes.reset} onClick={onReset}>
            Сбросить
          </button>
          <button className={classes.apply} onClick={applyFilters}>
            Применить
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;
