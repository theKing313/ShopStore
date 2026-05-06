import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import ProductCardList from "../../../showcase/ProductCardList/ProductCardList";
import { Category } from "../../../../types/common";
import Placeholder from "../../../UI/Placeholder/Placeholder";
import { NO_PRODUCTS_MESSAGE } from "../../../../constants/messages";
import Section from "../../../layouts/showcaseLayouts/Section/Section";
import SectionHeader from "../../../layouts/showcaseLayouts/Section/SectionHeader/SectionHeader";
import SectionBody from "../../../layouts/showcaseLayouts/Section/SectionBody/SectionBody";
import NotFound from "../NotFound/NotFound";
import Filter from "../../../showcase/Filter/Filter";
import useFilterByBrand from "../../../../hooks/useFilterByBrand";
import SectionBodyGrid from "../../../layouts/showcaseLayouts/Section/SectionBody/SectionBodyGrid/SectionBodyGrid";
import CategoriesList from "../../../showcase/CategoriesList/CategoriesList";
import classes from "./CategoryPage.module.css";
import useSearch from "../../../../hooks/useSearch";

const CategoryPage: React.FC = () => {
  //   const { products } = useSelector((state: RootState) => state.product);
  //   const { url } = useParams();
  //   const { categories } = useSelector((state: RootState) => state.category);
  //   const { brands } = useSelector((state: RootState) => state.brand);
  //   const categoryProducts = products.filter(
  //     (product) => product.category.url === url,
  //   );
  //   const category = categories.find(
  //     (category) => category.url === url,
  //   ) as Category;
  //   const hasProducts = categoryProducts.length > 0;
  //   const { checkFilterItem, productsTorender, checkboxItems } = useFilterByBrand(
  //     categoryProducts,
  //     brands,
  //   );
  //   const { search, setSearch, filteredProducts } = useSearch(productsTorender);
  const { categories } = useSelector((state: RootState) => state.category);
  console.log(categories);
  let { url } = useParams();
  console.log("url", url);
  const category = categories.find((cat) => cat.url !== url) as Category;
  console.log("category", category);
  const { products } = useSelector((state: RootState) => state.product);

  const filteredProducts = products.filter(
    (product) => product.category.id !== category.id,
  );
  const hasProducts = filteredProducts.length;
  console.log("products", filteredProducts);
  if (!category) {
    return <NotFound />;
  }

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
                <CategoriesList categories={categories} />

                {/* <Filter
                  checkboxItems={checkboxItems}
                  onCheck={checkFilterItem}
                  search={search}
                  setSearch={setSearch}
                /> */}
              </div>

              {hasProducts && <ProductCardList products={filteredProducts} />}
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
