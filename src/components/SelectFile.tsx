import { ChangeEvent, useState, useEffect } from "react";
import * as XLSX from "xlsx";
import List from "./List";
import { DataItem, ListRow, ListType } from "../types/types";

const SelectFile = () => {
  const [firstFile, setFirstFile] = useState<DataItem[]>([]);
  const [firstFileName, setFirstFileName] = useState<string>("");
  const [firstFileColumn, setFirstFileColumn] = useState<string[]>([]);
  const [firstSelectedOption, setFirstSelectedOption] = useState<string>("");
  const [secondFile, setSecondFile] = useState<DataItem[]>([]);
  const [secondFileName, setSecondFileName] = useState<string>("");
  const [secondFileColumn, setSecondFileColumn] = useState<string[]>([]);
  const [secondSelectedOption, setSecondSelectedOption] = useState<string>("");
  const [list, setList] = useState<ListType[]>([]);
  const [listRows, setListRows] = useState<ListRow[]>([]);
  const [mergedData, setMergedData] = useState<DataItem[]>([]);

  useEffect(() => {
    if (firstFile.length > 0 && secondFile.length > 0) {
      const mergedData = [];
      for (let i = 0; i < firstFile.length; i++) {
        const dataFromFirstFile = firstFile[i];
        for (let j = 0; j < secondFile.length; j++) {
          const dataFromSecondFile = secondFile[j];
          if (
            dataFromFirstFile[firstSelectedOption] ===
            dataFromSecondFile[secondSelectedOption]
          ) {
            mergedData.push({ ...dataFromFirstFile, ...dataFromSecondFile });
            break;
          }
        }
      }
      setMergedData(mergedData);
    }
  }, [firstFile, secondFile, firstSelectedOption, secondSelectedOption]);

  const handleFileUpload = (
    e: ChangeEvent<HTMLInputElement>,
    setData: (data: DataItem[]) => void,
    setColumn: (key: string[]) => void,
    setSelectedOption: (option: string) => void,
    setFileName: (name: string) => void
  ) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = () => {
      const data = reader.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData: DataItem[] = XLSX.utils.sheet_to_json(sheet);
      setData(parsedData);
      setFileName(sheetName);
      setColumn(Object.keys(parsedData[0]));
      setSelectedOption("");
    };
  };

  const handleFirstFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(
      e,
      setFirstFile,
      setFirstFileColumn,
      setFirstSelectedOption,
      setFirstFileName
    );
  };

  const handleSecondFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(
      e,
      setSecondFile,
      setSecondFileColumn,
      setSecondSelectedOption,
      setSecondFileName
    );
  };

  const handleAddList = () => {
    const newList = {
      source: [firstFileName, secondFileName],
      column: "",
      types: ["Text", "Formel"],
      textType: "text",
      targetColumnName: "",
      id: Date.now().toString(),
    };
    setList((prev) => [...prev, newList]);

    const newRow: ListRow = {
      selectedFiles: "",
      selectedColumns: "",
      selectedTypes: "",
      additionalText: "",
      targetColumnNames: "",
    };
    setListRows((prev) => [...prev, newRow]);
  };

  const btnDisabled = firstSelectedOption === "" || secondSelectedOption === "";

  return (
    <div className="p-10">
      <div className="flex gap-20 mb-10">
        <p>Desk 4 file</p>
        <div className="flex flex-col gap-4">
          <div className="cursor-pointer border-2 p-2 relative">
            <input
              type="file"
              className="opacity-0 relative z-10 cursor-pointer"
              accept=".xlsx, .xls"
              onChange={handleFirstFileUpload}
            />
            <p className="absolute top-3">
              {firstFileName ? firstFileName : "Select file"}
            </p>
          </div>
          <select
            id="dropdown"
            className="border-2 py-4 px-2"
            value={firstSelectedOption}
            onChange={(e) => setFirstSelectedOption(e.target.value)}
          >
            <option value="">Select...</option>
            {firstFileColumn.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <p>File 2</p>
        <div className="flex flex-col gap-4">
          <div className="cursor-pointer border-2 p-2 relative">
            <input
              type="file"
              className="opacity-0 relative z-10 cursor-pointer"
              accept=".xlsx, .xls"
              onChange={handleSecondFileUpload}
            />
            <p className="absolute top-3">
              {secondFileName ? secondFileName : "Select file"}
            </p>
          </div>
          <select
            id="dropdown"
            className="border-2 py-4 px-2"
            value={secondSelectedOption}
            onChange={(e) => setSecondSelectedOption(e.target.value)}
          >
            <option value="">Select...</option>
            {secondFileColumn.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      {firstFile.length > 0 && secondFile.length > 0 ? (
        <>
          <button
            className="p-2 px-4 border-2 border-purple-500 rounded-md float-end disabled:border-gray-300"
            onClick={handleAddList}
            disabled={btnDisabled}
          >
            +
          </button>
          <List
            lists={list}
            firstColumns={firstFileColumn}
            secondColumns={secondFileColumn}
            mergedData={mergedData}
            listRows={listRows}
            setListRows={setListRows}
          />
        </>
      ) : (
        <h2 className="text-center font-bold text-lg text-red-600">
          Please select files
        </h2>
      )}
    </div>
  );
};

export default SelectFile;
