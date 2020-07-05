import React from 'react';

const DropdownList = ({ array, className, onChange }) => (
  <section>
    <label htmlFor={`${className}__resort-name`}>Choose a resort</label>
    <select
      id={`${className}__resort-name`}
      onChange={({ target: { value } }) => onChange(array[value])}
    >
      {array.map((item, i) => {
        return (
          <option key={item.id} value={i}>
            {item.name}
          </option>
        );
      })}
    </select>
  </section>
);

export default DropdownList;
