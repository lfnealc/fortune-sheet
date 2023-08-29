import React, { useCallback, useEffect, useRef, useState } from "react";
import _ from "lodash";
import TreeSelect from "rc-tree-select";
import { gData } from "stories/data/dataUtil";

type ContentEditableProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> & {
  initialContent?: string;
  innerRef?: (e: HTMLDivElement | null) => void;
  onChange?: (html: string, isBlur?: boolean) => void;
  onBlur?: (e: React.FocusEvent<HTMLDivElement, Element>) => void;
  autoFocus?: boolean;
  allowEdit?: boolean;
};

const ContentEditable: React.FC<ContentEditableProps> = ({ ...props }) => {
  const lastHtml = useRef("");
  const root = useRef<HTMLDivElement | null>(null);
  const { autoFocus, initialContent, onChange } = props;

  useEffect(() => {
    if (autoFocus) {
      root.current?.focus();
    }
  }, [autoFocus]);

  // UNSAFE_componentWillUpdate
  useEffect(() => {
    if (initialContent && root.current != null) {
      root.current.innerHTML = initialContent;
    }
  }, [initialContent]);

  const fnEmitChange = useCallback(
    (__: any, isBlur?: boolean) => {
      let html;

      if (root.current != null) {
        html = root.current.innerHTML;
      }
      if (onChange && html !== lastHtml.current) {
        onChange(html || "", isBlur);
      }
      lastHtml.current = html || "";
    },
    [root, onChange]
  );

  const { innerRef, onBlur } = props;
  let { allowEdit } = props;
  if (_.isNil(allowEdit)) allowEdit = true;

  const [searchValue, setSearchValue] = useState();
  const [rcValue, setRcValue] = useState();
  const [open, setOpen] = useState(false);
  const onSelect = (...args) => {
    // use onChange instead
    console.log(args);
  };
  const onSearch = (value, ...args) => {
    console.log("Do Search:", value, ...args);
    setSearchValue(value);
  };

  return (
    <div
      onDoubleClick={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      {..._.omit(
        props,
        "innerRef",
        "onChange",
        "html",
        "onBlur",
        "autoFocus",
        "allowEdit",
        "initialContent"
      )}
      ref={(e) => {
        root.current = e;
        innerRef?.(e);
      }}
      tabIndex={0}
      onInput={fnEmitChange}
      onBlur={(e) => {
        fnEmitChange(null, true);
        onBlur?.(e);
      }}
      contentEditable={allowEdit}
    >
      <TreeSelect
        style={{ width: 300 }}
        transitionName="rc-tree-select-dropdown-slide-up"
        choiceTransitionName="rc-tree-select-selection__choice-zoom"
        // dropdownStyle={{ maxHeight: 200, overflow: 'auto' }}
        placeholder={<i>请下拉选择</i>}
        showSearch
        allowClear
        treeLine
        searchValue={searchValue}
        value={rcValue}
        treeData={gData}
        treeNodeFilterProp="label"
        filterTreeNode={false}
        onSearch={onSearch}
        open={open}
        onChange={(val, ...args) => {
          console.log("onChange", val, ...args);
          setRcValue(val);
        }}
        onDropdownVisibleChange={(v) => {
          console.log("single onDropdownVisibleChange", v);
          setOpen(v);
        }}
        onSelect={onSelect}
      />
    </div>
  );
};

export default ContentEditable;
