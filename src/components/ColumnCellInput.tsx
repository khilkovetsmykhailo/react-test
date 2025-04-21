import React, { useState, useEffect } from 'react';

interface ColumnCellInputProps {
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const ColumnCellInput: React.FC<ColumnCellInputProps> = ({
  defaultValue = '',
  onValueChange,
  placeholder = '',
  className = '',
}) => {
  const [value, setValue] = useState(defaultValue);
  const [isEditing, setIsEditing] = useState(false);

  // Update internal value when defaultValue changes
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const handleBlur = () => {
    setIsEditing(false);
    // Notify parent component of value change
    if (onValueChange) {
      onValueChange(value);
    }
  };

  const handleFocus = () => {
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <div className={`column-cell-input ${className}`}>
      {isEditing ? (
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          placeholder={placeholder}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <div
          onClick={handleFocus}
          className="p-2 cursor-pointer hover:bg-gray-100 rounded"
        >
          {value || placeholder}
        </div>
      )}
    </div>
  );
};

export default ColumnCellInput; 