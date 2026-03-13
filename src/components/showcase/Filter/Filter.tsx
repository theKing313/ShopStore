import Checkbox from "../../UI/Checkbox/Checkbox";
import SearchInput from "../../UI/SearchInput/SearchInput";
import classes from "./Filter.module.css";

interface IFilterProps {
  checkboxItems: any[];
  onCheck: (id: string) => void;
  search: string;
  setSearch: (id: string) => void;
}

const Filter: React.FC<IFilterProps> = ({
  checkboxItems,
  onCheck,
  search,
  setSearch,
}) => {
  return (
    <div className={classes.filter}>
      <span className={classes.title}>Фильтр поиска</span>
      <SearchInput value={search} onChange={setSearch} />
      <span className={classes.title}>Фильтр по брендам</span>
      {checkboxItems.map((item) => (
        <Checkbox
          key={item.id}
          label={item.name}
          onCheck={() => onCheck(item.id)}
        />
      ))}
    </div>
  );
};

export default Filter;
