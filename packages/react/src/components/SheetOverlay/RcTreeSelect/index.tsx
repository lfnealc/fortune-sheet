import React, { useContext, useEffect, useMemo, useState } from "react";
import { Tree } from "antd";
import "./index.less";
import {
  getFlowdata,
  getSheetIndex,
  mergeBorder,
  setTreeSelectValue,
} from "@fortune-sheet/core";
import WorkbookContext from "../../../context";

const RcTreeSelect = () => {
  const { context, setContext } = useContext(WorkbookContext);
  const [treeList, setTreeList] = useState<any>([]);
  const [position, setPosition] = useState<{ left: number; top: number }>();

  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

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
    const item =
      dataVerification?.[`${rowIndex}_${colIndex}`] ||
      dataVerification?.[`*_${colIndex}`];
    const { treeList: originTreeList, list: originList } =
      context.treeData[item.treeDataName];
    if (originTreeList && originTreeList.length !== 0) {
      setTreeList(originTreeList);
    } else {
      setTreeList(originList);
    }
    setPosition({
      left: col_pre,
      top: row,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.showTreeSelect]);

  const onSelect = (_: any, { node }: any) => {
    setContext((ctx) => {
      setTreeSelectValue(ctx, {
        v: node.code,
        m: node.name,
        ct: {
          fa: "@",
          t: "s",
        },
      });
    });
  };

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
  };

  const fillLegacyProps = (dataNode: any): any => {
    if (!dataNode) {
      return dataNode;
    }

    const cloneNode = { ...dataNode };

    if (!("props" in cloneNode)) {
      Object.defineProperty(cloneNode, "props", {
        get() {
          return cloneNode;
        },
      });
    }
    return cloneNode;
  };

  const filter = React.useMemo(() => {
    if (!context.searchValue) {
      return treeList;
    }

    const upperStr = context.searchValue.toUpperCase();
    const filterOptionFunc = (_: any, dataNode: { [x: string]: any }) => {
      const { code, name } = dataNode;

      return (
        String(code).toUpperCase().includes(upperStr) ||
        String(name).toUpperCase().includes(upperStr)
      );
    };
    const newExpandedKeys: React.Key[] = [];
    function dig(filterList: any[], keepAll: boolean = false) {
      return filterList.reduce((total, dataNode) => {
        const { children } = dataNode;

        const match =
          keepAll ||
          filterOptionFunc(context.searchValue, fillLegacyProps(dataNode));
        const childList = dig(children || [], match);

        if (match || childList.length) {
          let name;
          if (match) {
            newExpandedKeys.push(dataNode.code);
            name = (
              <span className="site-tree-search-value">{dataNode.name}</span>
            );
          } else {
            name = dataNode.name;
          }
          total.push({
            ...dataNode,
            name,
            isLeaf: undefined,
            children: childList,
          });
        }
        return total;
      }, []);
    }
    const filterTreeList = dig(treeList);
    setExpandedKeys(newExpandedKeys);
    return filterTreeList;
  }, [treeList, context.searchValue]);

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
      <Tree
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent
        treeData={filter}
        fieldNames={{ title: "name", key: "code", children: "children" }}
        // selectable={false}
        onSelect={onSelect}
        blockNode
      />
    </div>
  );
};

export default RcTreeSelect;
