import { Listbox } from "@headlessui/react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { IFilterReactComp } from "ag-grid-react";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import DeleteIcon from "../../../../assets/images/deleteIcon.svg";

export interface CustomTextFilterModel {
  value: string;
}

const CustomStatusFilter = forwardRef<IFilterReactComp, any>(
  (props: any, ref) => {
    const [filterValue, setFilterValue] = useState<string>("");
    const [selected, setSelected] = useState<any>();

    console.log(props.status);

    // Implementação da interface de filtro
    useImperativeHandle(ref, () => ({
      doesFilterPass(params) {
        return params.data[props.colDef.field]
          ?.toString()
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      },
      isFilterActive() {
        return filterValue.trim() !== "";
      },
      getModel(): any | null {
        return filterValue ? { value: filterValue, field: "status" } : null;
      },
      setModel(model: CustomTextFilterModel | null) {
        setFilterValue(model?.value || "");
      },
    }));

    useEffect(() => {
      if (filterValue.length > 0) {
        props.filterChangedCallback(); // Notifica o AG Grid que o filtro mudou
      } else {
        props.filterChangedCallback();
      }
    }, [filterValue]);

    return (
      <div className="relaw-full h-full rounded-sm p-4 relative">
        <Listbox
          value={filterValue}
          onChange={(value: any) => {
            setFilterValue(String(value.id));
            setSelected(value);
          }}
        >
          <Listbox.Button className="w-[275px] h-9 rounded-[32px] border-[#DBDEDF] border-2 shadow-lg pl-2">
            <div className="flex items-center gap-2">
              {selected ? (
                <>
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: selected?.icon }}
                  />
                  {selected?.label}
                </>
              ) : (
                <>Selecione uma opção</>
              )}
              <div className="absolute right-7">
                <KeyboardArrowDownIcon />
              </div>
            </div>
          </Listbox.Button>
          <Listbox.Options className="w-full mt-1 bg-white border rounded-md shadow-lg h-[220px] overflow-scroll">
            {props.status.map((item: any) => (
              <Listbox.Option
                // key={item.value}
                value={item}
                className="flex items-center gap-2 px-4 p-2 py-2 cursor-pointer hover:bg-gray-100 "
              >
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.icon }}
                />
                {item.label}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
        <div className="flex justify-end mt-4 mr-2">
          <button
            className="flex items-center justify-center border-none bg-transparent text-[#EA004C] text-sm font-bold"
            onClick={() => {
              
              setFilterValue("");
              props.filterChangedCallback();
              setSelected(undefined);
            }}
          >
            <img src={DeleteIcon} alt="" className="mr-2" />
            Limpar Filtros
          </button>
        </div>
      </div>
    );
  }
);

export default CustomStatusFilter;
