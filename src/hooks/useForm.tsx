import { useState, Dispatch, SetStateAction } from "react";

type Error = {
  [key: string]: string | undefined;
};

type Option = {
  [key: string]: string;
};

type ValidatorInputValue = string | File | { [key: string]: string };

const useForm = <
  T extends {},
  V extends ValidatorInputValue = string | { [key: string]: string },
>(
  initInput: T,
  callback: () => Promise<void> | void,
  validator: (field: string, inputValue: V) => { [key: string]: string } | null,
): {
  input: T;
  errors: Error;
  setInput: Dispatch<SetStateAction<T>>;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  resetForm: () => void;
  submit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleChangeSelect: (option: Option) => void;
  clearValidation: (field: keyof Error) => void;
} => {
  const [input, setInput] = useState(initInput);
  const [errors, setErrors] = useState<Error>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    clearValidation(name);

    setInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeSelect = (option: Option) => {
    const { name, id, field, url } = option;

    clearValidation(field);

    setInput((prevState) => ({
      ...prevState,
      [field]: {
        name,
        id,
        url,
      },
    }));
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isFormValid = validate();

    if (!isFormValid) return;

    try {
      const callbackResult = callback();
      if (
        callbackResult &&
        typeof (callbackResult as Promise<void>).then === "function"
      ) {
        await callbackResult;
      }
      resetForm();
    } catch {
      // keeping the form state intact if callback fails
    }
  };

  const validate = () => {
    let isValid = true;

    Object.entries(input).forEach(([key, value]) => {
      const inputErrorObj = validator(key, value as V);
      if (inputErrorObj) {
        isValid = false;
        setErrors((prev) => ({ ...prev, ...inputErrorObj }));
      }
    });

    return isValid;
  };

  const clearValidation = (field: keyof Error) => {
    if (field) {
      setErrors((prevState) => ({
        ...prevState,
        [field]: undefined,
      }));
      return;
    }
    setErrors({});
  };

  const resetForm = () => {
    setInput(initInput);
    setErrors({});
  };

  return {
    input,
    errors,
    setInput,
    handleChange,
    resetForm,
    submit,
    handleChangeSelect,
    clearValidation,
  };
};

export default useForm;
