"use client";
import React from "react";

export default function InputFieldControlled({
  type,
  id,
  name,
  onChange,
  label,
  ariaLabel,
  style,
  value,
  disabled,
}) {
  return (
    <div>
      <p className="text-xs">{label}</p>
      <input
        type={type}
        id={id}
        disabled={disabled}
        name={name}
        className={`${style} border-b-2 border-gray-200 px-1 h-10 outline-none`}
        onChange={onChange}
        placeholder="-"
        aria-label={ariaLabel}
        value={value}
      />
    </div>
  );
}
