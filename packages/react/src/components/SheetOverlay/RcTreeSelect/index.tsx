import React, { useState } from "react";
import { TreeSelect } from "antd";
import { gData } from "./dataUtil";
import "antd/dist/antd.css";

const RcTreeSelect = () => {
  const [searchValue, setSearchValue] = useState();
  const [rcValue, setRcValue] = useState();
  const onSelect = (...args: any[]) => {
    // use onChange instead
    console.log(args);
    setRcValue(args[0]);
  };
  const onSearch = (value: any, ...args: any[]) => {
    console.log("Do Search:", value, ...args);
    setSearchValue(value);
  };

  return (
    <TreeSelect
      autoFocus
      className="coding-input"
      showSearch
      style={{ width: "100%" }}
      value={rcValue}
      dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
      // treeData={renderTreeData(treeList)}
      treeData={gData}
      treeNodeFilterProp="title"
      // treeDefaultExpandAll
      onSearch={onSearch}
      onSelect={onSelect}
      searchValue={searchValue}
    />
  );
};

export default RcTreeSelect;
