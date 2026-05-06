import { useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import ProductCardList from "../../../showcase/ProductCardList/ProductCardList";
import Placeholder from "../../../UI/Placeholder/Placeholder";
import { NO_PRODUCTS_MESSAGE } from "../../../../constants/messages";
import Section from "../../../layouts/showcaseLayouts/Section/Section";
import SectionHeader from "../../../layouts/showcaseLayouts/Section/SectionHeader/SectionHeader";
import SectionBody from "../../../layouts/showcaseLayouts/Section/SectionBody/SectionBody";
import SectionBodyGrid from "../../../layouts/showcaseLayouts/Section/SectionBody/SectionBodyGrid/SectionBodyGrid";
import FilterPanel from "../../../showcase/Filter/Filter";
import useFilterByBrand from "../../../../hooks/useFilterByBrand";
import useSearch from "../../../../hooks/useSearch";
import { useState } from "react";
import classes from "./WishlistPage.module.css";
interface IPriceProps {
  from: number;
  to: number;
}
const WishlistPage: React.FC = () => {
  const [price, setPrice] = useState<IPriceProps>({ from: 399, to: 2999 });
  const [isOpen, setIsOpen] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const { products, error } = useSelector((state: RootState) => state.product);
  const { wishlist } = useSelector((state: RootState) => state.user);
  const { brands } = useSelector((state: RootState) => state.brand);

  const wishlistProducts = products.filter((product) =>
    wishlist.includes(product.id),
  );
  const { productsTorender } = useFilterByBrand(
    wishlistProducts,
    brands,
    price,
    selectedBrands,
    selectedSizes,
    selectedMaterials,
    selectedColors,
  );
  const hasProducts = wishlistProducts.length > 0;
  const { search, setSearch, filteredProducts } = useSearch(productsTorender);

  const sizes = ["XS", "S", "M", "L", "XL"];
  const materials = ["Хлопок", "Полиэстер", "Лён", "Шерсть", "Смесь"];
  const colors = ["Чёрный", "Белый", "Синий", "Красный", "Зелёный", "Серый"];
  return (
    <Section>
      <>
        <SectionHeader title={"Избранные товары"} />
        <SectionBody>
          <SectionBodyGrid>
            <div className={classes.sidebar}>
              <div className={classes.toggleRow}>
                {!isOpen && (
                  <button
                    className={classes.openButton}
                    type="button"
                    onClick={() => setIsOpen(true)}
                  >
                    Открыть фильтр
                  </button>
                )}
              </div>

              <FilterPanel
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                price={price}
                setPrice={setPrice}
                brands={brands}
                sizes={sizes}
                materials={materials}
                colors={colors}
                selectedBrands={selectedBrands}
                setSelectedBrands={setSelectedBrands}
                selectedSizes={selectedSizes}
                setSelectedSizes={setSelectedSizes}
                selectedMaterials={selectedMaterials}
                setSelectedMaterials={setSelectedMaterials}
                selectedColors={selectedColors}
                setSelectedColors={setSelectedColors}
                onApply={() => setIsOpen(false)}
                onReset={() => {
                  setSelectedBrands([]);
                  setSelectedSizes([]);
                  setSelectedMaterials([]);
                  setSelectedColors([]);
                  setPrice({ from: 399, to: 2999 });
                }}
              />
            </div>

            <div className={classes.main}>
              {error.isError && (
                <Placeholder text={error.message} size={"38px"} />
              )}
              {!hasProducts && !error.isError && (
                <Placeholder text={NO_PRODUCTS_MESSAGE} size={"38px"} />
              )}
              {hasProducts && <ProductCardList products={filteredProducts} />}
            </div>
          </SectionBodyGrid>
        </SectionBody>
      </>
    </Section>
  );
};

export default WishlistPage;
