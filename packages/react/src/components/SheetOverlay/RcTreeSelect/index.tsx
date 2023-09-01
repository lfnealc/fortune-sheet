import React, { useContext, useEffect, useState } from "react";
import { Tree } from "antd";
import "./index.less";
import WorkbookContext from "packages/react/src/context";
import {
  getFlowdata,
  getSheetIndex,
  mergeBorder,
  setTreeSelectValue,
} from "@fortune-sheet/core";

const RcTreeSelect = () => {
  const { context, setContext } = useContext(WorkbookContext);
  const [list, setList] = useState<any>([]);
  const [treeList, setTreeList] = useState<any>([]);
  const [searchValue, setSearchValue] = useState("");
  const [position, setPosition] = useState<{ left: number; top: number }>();
  const [valueState, setValue] = useState();

  useEffect(() => {
    if (!context.luckysheet_select_save) return;
    const last =
      context.luckysheet_select_save[context.luckysheet_select_save.length - 1];
    const rowIndex = last.row_focus;
    const colIndex = last.column_focus;
    if (rowIndex == null || colIndex == null) return;
    let row = context.visibledatarow[rowIndex];
    let col_pre = colIndex === 0 ? 0 : context.visibledatacolumn[colIndex - 1];
    const d = getFlowdata(context);
    if (!d) return;
    const margeSet = mergeBorder(context, d, rowIndex, colIndex);
    if (margeSet) {
      [, row] = margeSet.row;
      [col_pre, ,] = margeSet.column;
    }
    const index = getSheetIndex(context, context.currentSheetId) as number;
    const { dataVerification } = context.luckysheetfile[index];
    const item = dataVerification[`${rowIndex}_${colIndex}`];
    // const dropdownList = getDropdownList(context, item.value1);
    // 初始化多选的下拉列表
    // const cellValue = getCellValue(rowIndex, colIndex, d);

    // if (cellValue) {
    //   setSelected(cellValue.toString().split(","));
    // }
    setTreeList(item.value2);
    setPosition({
      left: col_pre,
      top: row,
    });
    // setIsMul(item.type2 === "true");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = (value: any) => {
    setSearchValue(value);
  };

  const handleChange = (value: any) => {
    setValue(value);
    setContext((ctx) => {
      setTreeSelectValue(ctx, value);
    });
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
    <div
      className="coding-input"
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      style={{ ...position }}
    >
      <Tree treeData={treeList} selectable={false} />
    </div>
  );
};

export default RcTreeSelect;
