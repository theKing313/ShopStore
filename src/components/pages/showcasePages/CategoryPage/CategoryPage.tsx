import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import ProductCardList from "../../../showcase/ProductCardList/ProductCardList";
import { Category } from "../../../../types/common";
import Placeholder from "../../../UI/Placeholder/Placeholder";
import useFilterByBrand from "../../../../hooks/useFilterByBrand";
import { NO_PRODUCTS_MESSAGE } from "../../../../constants/messages";
import Section from "../../../layouts/showcaseLayouts/Section/Section";
import SectionHeader from "../../../layouts/showcaseLayouts/Section/SectionHeader/SectionHeader";
import SectionBody from "../../../layouts/showcaseLayouts/Section/SectionBody/SectionBody";
import NotFound from "../NotFound/NotFound";
import SectionBodyGrid from "../../../layouts/showcaseLayouts/Section/SectionBody/SectionBodyGrid/SectionBodyGrid";
import CategoriesList from "../../../showcase/CategoriesList/CategoriesList";
import classes from "./CategoryPage.module.css";
import FilterPanel from "../../../showcase/Filter/Filter";
import { useState } from "react";
interface IPriceProps {
  from: number;
  to: number;
}

const CategoryPage: React.FC = () => {
  const { categories } = useSelector((state: RootState) => state.category);
  const { products } = useSelector((state: RootState) => state.product);
  const { brands } = useSelector((state: RootState) => state.brand);
  const { url } = useParams();

  // Фильтры
  const [price, setPrice] = useState<IPriceProps>({ from: 0, to: 10000 });
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [showFilter, setShowFilter] = useState(false);

  const sizes = ["XS", "S", "M", "L", "XL"];
  const materials = ["Хлопок", "Полиэстер", "Лён", "Шерсть", "Смесь"];
  const colors = ["Чёрный", "Белый", "Синий", "Красный", "Зелёный", "Серый"];

  // Найдём категорию
  const category = categories.find((cat) => cat.url === url) as Category;

  // Получим продукты для этой категории (или пустой массив если категория не найдена)
  const categoryProducts = category
    ? products.filter((product) => product.category.id === category.id)
    : [];

  const { productsTorender } = useFilterByBrand(
    categoryProducts,
    brands,
    price,
    selectedBrands,
    selectedSizes,
    selectedMaterials,
    selectedColors,
  );

  if (!category) {
    return <NotFound />;
  }

  const hasProducts = productsTorender.length > 0;

  return (
    <Section>
      <>
        <SectionHeader
          title={category.name}
          description={category.description}
        />
        <SectionBody>
          <SectionBodyGrid>
            <>
              <div className={classes.wrapper}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "2px",
                    flexDirection: "column",
                  }}
                >
                  <CategoriesList categories={categories} />
                  <button
                    onClick={() => setShowFilter(!showFilter)}
                    style={{
                      width: "100%",
                      padding: "8px 16px",
                      backgroundColor: showFilter ? "#333" : "transparent",
                      color: showFilter ? "white" : "#333",
                      border: "2px solid #333",
                      borderRadius: "25px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      transition: "all 0.3s ease",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {showFilter ? "✕ Закрыть" : "⚙ Фильтры"}
                  </button>
                </div>
                {showFilter && (
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
                      setPrice({ from: 0, to: 10000 });
                    }}
                  />
                )}
              </div>

              {hasProducts && <ProductCardList products={productsTorender} />}
              {!hasProducts && (
                <Placeholder text={NO_PRODUCTS_MESSAGE} size={"38px"} />
              )}
            </>
          </SectionBodyGrid>
        </SectionBody>
      </>
    </Section>
  );
};

export default CategoryPage;
