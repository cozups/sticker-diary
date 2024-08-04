import { InputHTMLAttributes, forwardRef } from 'react';

const StyledInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  return (
    <input
      className="py-1 border-b-2 border-indigo-700 border-opacity-30"
      ref={ref}
      {...props}
    />
  );
});

StyledInput.displayName = 'StyledInput';

export default StyledInput;
