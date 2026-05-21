import { useSelector } from "react-redux";
import { NO_DISCOUNTED_PRODUCTS } from "../../../../constants/messages";
import useFilterByBrand from "../../../../hooks/useFilterByBrand";
import { RootState } from "../../../../store/store";
import Section from "../../../layouts/showcaseLayouts/Section/Section";
import SectionBody from "../../../layouts/showcaseLayouts/Section/SectionBody/SectionBody";
import SectionBodyGrid from "../../../layouts/showcaseLayouts/Section/SectionBody/SectionBodyGrid/SectionBodyGrid";
import SectionHeader from "../../../layouts/showcaseLayouts/Section/SectionHeader/SectionHeader";
import ProductCardList from "../../../showcase/ProductCardList/ProductCardList";
import Placeholder from "../../../UI/Placeholder/Placeholder";
import { useState } from "react";
import FilterPanel from "../../../showcase/Filter/Filter";

interface IDiscountProductsPageProps {}
interface IPriceProps {
  from: number;
  to: number;
}
const DiscountProductsPage: React.FC<IDiscountProductsPageProps> = () => {
  // filters

  const [price, setPrice] = useState<IPriceProps>({ from: 399, to: 2999 });
  ///////////////////////////////////////
  const { products, error } = useSelector((state: RootState) => state.product);
  const { brands } = useSelector((state: RootState) => state.brand);
  const sizes = ["XS", "S", "M", "L", "XL"];
  const materials = ["Хлопок", "Полиэстер", "Лён", "Шерсть", "Смесь"];
  const colors = ["Чёрный", "Белый", "Синий", "Красный", "Зелёный", "Серый"];
  const discountedProducts = products.filter(
    (product) => product.discountPercent && product.discountPercent > 0,
  );
  console.log("All products:", products);
  console.log("Discounted products:", discountedProducts);

  //
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  //
  const hasProducts = discountedProducts.length > 0;
  const { productsTorender } = useFilterByBrand(
    discountedProducts,
    brands,
    price,
    selectedBrands,
    selectedSizes,
    selectedMaterials,
    selectedColors,
  );
  return (
    <Section>
      <>
        <SectionHeader title={"Скидки"} />
        <SectionBody>
          <SectionBodyGrid>
            <>
              {/* <Filter
                checkboxItems={checkboxItems}
                onCheck={checkFilterItem}
                search={search}
                setSearch={setSearch}
                price={price}
                setPrice={setPrice}
              /> */}
              <FilterPanel
                isOpen={true}
                onClose={() => {}}
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
                onApply={() => console.log("apply")}
                onReset={() => {
                  setSelectedBrands([]);
                  setSelectedSizes([]);
                  setSelectedMaterials([]);
                  setSelectedColors([]);
                  setPrice({ from: 0, to: 3000 });
                }}
              />
              {error.isError && (
                <Placeholder text={error.message} size={"38px"} />
              )}
              {!hasProducts && !error.isError && (
                <Placeholder text={NO_DISCOUNTED_PRODUCTS} size={"38px"} />
              )}

              {hasProducts && <ProductCardList products={productsTorender} />}
            </>
          </SectionBodyGrid>
        </SectionBody>
      </>
    </Section>
  );
};

export default DiscountProductsPage;
