import React, { useState } from "react";
import { TreeSelect } from "antd";
import "./index.less";

const RcTreeSelect = (props: any) => {
  const { inputRef, onChange, list, treeList, ...rest } = props;
  const [searchValue, setSearchValue] = useState("");
  const [valueState, setValue] = useState();
  const onSearch = (value: any) => {
    setSearchValue(value);
  };

  const handleChange = (value: any) => {
    setValue(value);
    onChange(value);
  };

  const onBlur = () => {
    if (list && list.length > 0 && searchValue) {
      let item = list.find(
        (it: any) => it.code.toUpperCase() === searchValue.toUpperCase()
      );
      if (item) {
        handleChange(item.code);
      } else {
        item = list.find((it: any) => {
          const { name } = it;
          return name.toUpperCase().indexOf(searchValue.toUpperCase()) !== -1;
        });
        if (item) {
          handleChange(item.code);
        } else {
          handleChange(undefined);
        }
      }
      setSearchValue("");
    }
  };

  return (
    <div>
      <TreeSelect
        {...rest}
        className="coding-input"
        tabIndex={0}
        ref={(e) => {
          inputRef?.(e);
        }}
        showSearch
        allowClear
        style={{ width: "100%" }}
        value={valueState}
        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        treeData={treeList}
        treeNodeFilterProp="title"
        onChange={handleChange}
        onSearch={onSearch}
        searchValue={searchValue}
        onBlur={onBlur}
      />
    </div>
  );
};

export default RcTreeSelect;
