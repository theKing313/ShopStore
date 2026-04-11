import classes from "./SearchInput.module.css";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const SearchInput: React.FC<Props> = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Поиск по товарам..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={classes.input}
    />
  );
};

export default SearchInput;
