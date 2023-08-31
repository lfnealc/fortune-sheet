import React, { useCallback, useContext, useEffect, useRef } from "react";
import _ from "lodash";
import RcTreeSelect from "./RcTreeSelect";
import WorkbookContext from "../../context";
import { gData } from "./RcTreeSelect/dataUtil";

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
  const { context } = useContext(WorkbookContext);
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
        console.log(html);
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

  const render = () => {
    if (context.inputTypeTreeSelect) {
      return (
        <RcTreeSelect
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
          inputRef={innerRef}
          list={[]}
          treeList={gData}
        />
      );
    }
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
      />
    );
  };

  return render();
};

export default ContentEditable;
