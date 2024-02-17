import { ChangeEvent } from "react";
import { DataItem, ListRow, ListType } from "../types/types";
import * as XLSX from "xlsx";

type Props = {
  lists: ListType[];
  firstColumns: string[];
  secondColumns: string[];
  mergedData: DataItem[];
  listRows: ListRow[];
  setListRows: (data: (state: ListRow[]) => ListRow[]) => void;
};

const List = ({
  lists,
  firstColumns,
  secondColumns,
  mergedData,
  listRows,
  setListRows,
}: Props) => {
  const handleSaveAsExcel = () => {
    const updatedMergedData = listRows
      .map((row) => {
        const {
          selectedColumns,
          selectedTypes,
          additionalText,
          targetColumnNames,
        } = row;
        return mergedData.map((item) => {
          if (selectedColumns in item) {
            const { [selectedColumns]: value, ...rest } = item;

            return {
              [targetColumnNames]:
                selectedTypes === "Formel"
                  ? +value + +additionalText
                  : `${value} ${additionalText}`,
              ...rest,
            };
          }
        });
      })
      .flat();

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(updatedMergedData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    XLSX.writeFile(workbook, "updated_data.xlsx");
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number,
    field: keyof ListRow
  ) => {
    const newValue = e.target.value;
    setListRows((prev: ListRow[]) => {
      const newListRows = [...prev];
      newListRows[index][field] = newValue;
      return newListRows;
    });
  };

  if (lists.length === 0) {
    return null;
  }

  const isButtonDisabled = listRows.some((row) =>
    Object.values(row).some((value) => value === "")
  );

  return (
    <>
      <table className="flex-1 w-full mb-10">
        <thead>
          <tr>
            <th align="left">Source</th>
            <th align="left">Column name from source</th>
            <th align="left">Type</th>
            <th align="left">additional text or formel</th>
            <th align="left">target column Name</th>
          </tr>
        </thead>
        <tbody>
          {listRows.map((row, index) => (
            <tr key={index}>
              <td className="w-64">
                <select
                  name="selectedFiles"
                  className="cursor-pointer border-2 p-2 w-11/12"
                  onChange={(e) => handleChange(e, index, "selectedFiles")}
                  value={row.selectedFiles}
                >
                  <option value="" disabled>
                    Select source
                  </option>
                  {lists[index].source.map((file, j) => (
                    <option key={j} value={j}>
                      {file}
                    </option>
                  ))}
                </select>
              </td>
              <td className="w-64">
                <select
                  name="selectedColumns"
                  className="cursor-pointer border-2 p-2 w-11/12"
                  onChange={(e) => handleChange(e, index, "selectedColumns")}
                  value={row.selectedColumns}
                >
                  <option value="" disabled>
                    Select column name
                  </option>
                  {row.selectedFiles === "1"
                    ? secondColumns.map((item, j) => (
                        <option key={j} value={item}>
                          {item}
                        </option>
                      ))
                    : firstColumns.map((item, j) => (
                        <option key={j} value={item}>
                          {item}
                        </option>
                      ))}
                </select>
              </td>
              <td className="w-64">
                <select
                  name="selectedTypes"
                  className="cursor-pointer border-2 p-2 w-11/12"
                  onChange={(e) => handleChange(e, index, "selectedTypes")}
                  value={row.selectedTypes}
                >
                  <option value="" disabled>
                    Select type
                  </option>
                  {lists[index].types.map((type, j) => (
                    <option key={j} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </td>
              <td className="w-64">
                <input
                  type={row.selectedTypes === "Formel" ? "number" : "text"}
                  name="additionalText"
                  className="border-2 p-2 w-11/12"
                  onChange={(e) => handleChange(e, index, "additionalText")}
                  value={row.additionalText}
                />
              </td>
              <td className="w-64">
                <input
                  type="text"
                  name="targetColumnNames"
                  className="border-2 p-2 w-11/12"
                  onChange={(e) => handleChange(e, index, "targetColumnNames")}
                  value={row.targetColumnNames}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleSaveAsExcel}
        disabled={isButtonDisabled}
        className="bg-blue-500 text-white px-6 py-2 float-right rounded-md hover:bg-blue-600 disabled:bg-gray-300"
      >
        Save as exel
      </button>
    </>
  );
};

export default List;
