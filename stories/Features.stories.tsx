import React, { useState, useCallback, useRef } from "react";
import { Meta, StoryFn } from "@storybook/react";
import { Sheet } from "@fortune-sheet/core";
import { Workbook, WorkbookInstance } from "@fortune-sheet/react";
import moment from "moment";
import { Button } from "antd";
import cell from "./data/cell";
import formula from "./data/formula";
import empty from "./data/empty";
import freeze from "./data/freeze";
import dataVerification from "./data/dataVerification";
import lockcellData from "./data/protected";

export default {
  component: Workbook,
} as Meta<typeof Workbook>;

const Template: StoryFn<typeof Workbook> = ({
  // eslint-disable-next-line react/prop-types
  data: data0,
  ...args
}) => {
  const [data, setData] = useState<Sheet[]>(data0);
  const onChange = useCallback((d: Sheet[]) => {
    setData(d);
  }, []);
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Workbook {...args} data={data} onChange={onChange} />
    </div>
  );
};

export const Basic = Template.bind({});
// @ts-ignore
Basic.args = { data: [cell] };

export const Formula = Template.bind({});
// @ts-ignore
Formula.args = { data: [formula] };

export const Empty = Template.bind({});
Empty.args = { data: [empty] };

export const Tabs = Template.bind({});
// @ts-ignore
Tabs.args = { data: [cell, formula] };

export const Freeze = Template.bind({});
// @ts-ignore
Freeze.args = { data: [freeze] };

export const DataVerification = Template.bind({});
// @ts-ignore
DataVerification.args = { data: [dataVerification] };

export const ProtectedSheet = Template.bind({});
// @ts-ignore
ProtectedSheet.args = {
  data: lockcellData,
};

export const MultiInstance: StoryFn<typeof Workbook> = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "inline-block",
          width: "50%",
          height: "100%",
          paddingRight: "12px",
          boxSizing: "border-box",
        }}
      >
        <Workbook data={[empty]} />
      </div>
      <div
        style={{
          display: "inline-block",
          width: "50%",
          height: "100%",
          paddingLeft: "12px",
          boxSizing: "border-box",
        }}
      >
        <Workbook data={[empty]} />
      </div>
    </div>
  );
};

export const Bookkeeping: StoryFn<typeof Workbook> = () => {
  const workBookRef = useRef<WorkbookInstance>(null);
  const [sheetId, setSheetId] = useState<number>(1);
  const onClick = () => {
    const data = workBookRef.current?.getSheet({ id: `${sheetId}` });
    console.log(data);
  };
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Button type="primary" onClick={onClick}>
        试试
      </Button>
      <Workbook
        ref={workBookRef}
        lang="zh"
        hooks={{
          afterActivateSheet(id) {
            setSheetId(parseInt(id, 10));
          },
          beforeUpdateCell(r: number, c: number, value: any) {
            return true;
          },
          afterUpdateCell(r: number, c: number, _: any, newValue: any) {
            if (sheetId === 1) {
              if (c === 0) {
                const dateStr = newValue.v.trim();
                if (dateStr) {
                  let momentValue;
                  if (dateStr.indexOf("-") !== -1) {
                    momentValue = moment(dateStr, "DD-MM-YYYY");
                  } else if (dateStr.indexOf("/") !== -1) {
                    momentValue = moment(dateStr, "DD/MM/YYYY");
                  } else {
                    momentValue = moment(dateStr, "DDMMYYYY");
                  }
                  if (momentValue.isValid()) {
                    workBookRef.current?.setCellValue(r, c, {
                      m: momentValue.format("DD-MM-YYYY"),
                      v: momentValue.format("YYYY-MM-DD"),
                      ct: {
                        fa: "@",
                        t: "s",
                      },
                    });
                  } else {
                    workBookRef.current?.setCellValue(r, c, {
                      m: null,
                      v: null,
                    });
                  }
                } else {
                  workBookRef.current?.setCellValue(r, c, {
                    m: null,
                    v: null,
                  });
                }
              } else if (c === 4 || c === 5) {
              }
            }
            return false;
          },
        }}
        treeData={{
          coding: {
            treeList: [
              {
                code: "435",
                name: "435-DEBTOR OR CREDITOR",
                children: [
                  {
                    code: "435-1",
                    name: "435-1-BANK ACCOUNTS",
                    children: [
                      {
                        code: "5692",
                        name: "5692-Bank account no. 1",
                      },
                    ],
                  },
                ],
              },
            ],
            list: [
              { code: "435", name: "DEBTOR OR CREDITOR" },
              { code: "435-1", name: "BANK ACCOUNTS" },
              { code: "5692", name: "Bank account no. 1" },
            ],
          },
          calculateMethod: {
            list: [
              {
                code: "1",
                name: "Standard",
              },
              {
                code: "2",
                name: "No VAT",
              },
              {
                code: "3",
                name: "Exempt",
              },
              {
                code: "4",
                name: "5%",
              },
              {
                code: "5",
                name: "Zero (0%)",
              },
              {
                code: "0",
                name: "Other",
              },
            ],
          },
        }}
        data={[
          {
            id: "1",
            name: "PDB",
            frozen: {
              type: "row",
            },
            row: 10,
            column: 8,
            celldata: [
              {
                r: 0,
                c: 0,
                v: {
                  m: "Date",
                  ct: {
                    fa: "@",
                    t: "s",
                  },
                  v: "",
                  lo: 1,
                },
              },
              {
                r: 0,
                c: 1,
                v: {
                  v: "Desc",
                  lo: 1,
                },
              },
              {
                r: 0,
                c: 2,
                v: {
                  v: "Payee",
                  lo: 1,
                },
              },
              {
                r: 0,
                c: 3,
                v: {
                  v: "Amount",
                  lo: 1,
                },
              },
              {
                r: 0,
                c: 4,
                v: {
                  v: "Calculate method",
                  lo: 1,
                },
              },
              {
                r: 0,
                c: 5,
                v: {
                  v: "VAT",
                  lo: 1,
                },
              },
              {
                r: 0,
                c: 6,
                v: {
                  v: "Category",
                  lo: 1,
                },
              },
              {
                r: 0,
                c: 7,
                v: {
                  v: "Payment method",
                  lo: 1,
                },
              },
            ],
            dataVerification: {
              "*_4": {
                type: "treeselect",
                rangeTxt: "A1",
                treeDataName: "calculateMethod",
                validity: "",
                remote: false,
                prohibitInput: true,
                hintShow: true,
                hintValue: "",
                checked: false,
              },
              "*_6": {
                type: "treeselect",
                rangeTxt: "A1",
                treeDataName: "coding",
                validity: "",
                remote: false,
                prohibitInput: true,
                hintShow: true,
                hintValue: "",
                checked: false,
              },
            },
          },
          {
            id: "2",
            name: "Sales",
            celldata: [
              {
                r: 0,
                c: 0,
                v: {
                  v: "Date",
                },
              },
              {
                r: 0,
                c: 1,
                v: {
                  v: "Desc",
                },
              },
              {
                r: 0,
                c: 2,
                v: {
                  v: "Payee",
                },
              },
              {
                r: 0,
                c: 3,
                v: {
                  v: "Amount",
                },
              },
              {
                r: 0,
                c: 4,
                v: {
                  v: "Calculate method",
                },
              },
              {
                r: 0,
                c: 5,
                v: {
                  v: "VAT",
                },
              },
              {
                r: 0,
                c: 6,
                v: {
                  v: "Category",
                },
              },
              {
                r: 0,
                c: 7,
                v: {
                  v: "Payment method",
                },
              },
            ],
          },
          {
            id: "3",
            name: "BankStatement",
            celldata: [
              {
                r: 0,
                c: 0,
                v: {
                  v: "Date",
                },
              },
              {
                r: 0,
                c: 1,
                v: {
                  v: "Money",
                },
              },
              {
                r: 0,
                c: 2,
                v: {
                  v: "Description",
                },
              },
              {
                r: 0,
                c: 3,
                v: {
                  v: "Payee",
                },
              },
              {
                r: 0,
                c: 4,
                v: {
                  v: "Category",
                },
              },
              {
                r: 0,
                c: 5,
                v: {
                  v: "Account",
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};
