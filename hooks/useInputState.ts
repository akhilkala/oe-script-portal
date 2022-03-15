import { useState } from "react";

export interface InputState {
  value: string;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleReset: () => void;
}

const useInputState = (init?: string): InputState => {
  const initialState = init || "";

  const [value, setValue] = useState<string>(initialState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setValue(e.target.value);
  };

  const handleReset = (): void => {
    setValue(initialState);
  };

  return { value, handleChange, handleReset };
};

export default useInputState;
