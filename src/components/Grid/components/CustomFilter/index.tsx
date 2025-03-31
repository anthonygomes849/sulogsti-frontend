import { IFilterReactComp } from "ag-grid-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import DeleteIcon from "../../../../assets/images/deleteIcon.svg";
import SelectCustom from "../../../SelectCustom";

export interface CustomTextFilterModel {
  value: string;
}

const CustomFilter = forwardRef<IFilterReactComp, any>((props: any, ref) => {
  const [filterValue, setFilterValue] = useState<string | number | boolean>("");
  const [initialDate, setInitialDate] = useState<string>("");
  const [finalDate, setFinalDate] = useState<string>("");

  // Implementação da interface de filtro
  useImperativeHandle(ref, () => ({
    doesFilterPass(params) {
      return params.data[props.colDef.field]?.toString().toLowerCase();
      // .includes(filterValue.toLowerCase());
    },
    isFilterActive() {
      if (props.dateBetween) {
        return initialDate.length > 0 && finalDate.length > 0;
      }
      return filterValue !== "";
    },
    getModel(): any | null {
      if (!filterValue && !initialDate && !finalDate) {
        return null; // Remove o filtro do AG Grid
      }

      let value: any = String(filterValue).length > 0 ? filterValue : null;
      if (props.dateBetween) {
        value = [initialDate, finalDate];
      }

      const fieldName = props.colDef.fieldName || props.colDef.field;

      console.log(value);

      return { value, field: fieldName };
    },
    setModel(model: CustomTextFilterModel | null) {
      console.log(model);
      if (!model) {
        setFilterValue("");
        setInitialDate("");
        setFinalDate("");
      } else {
        setFilterValue(model.value || "");
      }
    },
  }));

  useEffect(() => {
    if (
      (filterValue && String(filterValue).length > 0) ||
      (initialDate.length > 0 && finalDate.length > 0)
    ) {
      props.filterChangedCallback();
    }
  }, [filterValue, initialDate, finalDate]);

  console.log(props);

  return (
    <div className="w-full h-full rounded-sm p-4 relative">
      <div className="flex justify-end mr-2 mb-4">
        <button
          className="flex items-center justify-center border-none bg-transparent text-[#EA004C] text-sm font-bold"
          onClick={() => {
            setFilterValue("");
            setInitialDate("");
            setFinalDate("");

            if (props.api) {
              props.api.onFilterChanged();
            }
            // setSelected(undefined);
          }}
        >
          <img src={DeleteIcon} alt="" className="mr-2" />
          Limpar Filtros
        </button>
      </div>
      {props.selected ? (
        <SelectCustom
          data={props.selected.data}
          isMulti={props.selected.isMultiple}
          onChange={(selectedOption: any) => {
            if (
              !window.location.pathname.includes("triagens") &&
              props.colDef.fieldName === "tipo_carga"
            ) {
              console.log(selectedOption);
              // setSelected(selectedOption);
              let dataCargoTypes = "{";
              selectedOption.map((item: any) => {
                dataCargoTypes = dataCargoTypes.concat(item.value) + ",";
              });
              let value = dataCargoTypes.replace(/,$/, "");
              value = value.concat("}");
              setFilterValue(value);
            } else {
              console.log("entrou select", selectedOption);
              setFilterValue(selectedOption.value);
            }
          }}
          title=""
          // value={selected}
        />
      ) : props.dateBetween ? (
        <div className="flex items-center justify-center">
          <input
            onChange={(e: any) => {
              const dateColumn = format(e.target.value, "yyyy-MM-dd HH:mm", {
                locale: ptBR,
              });

              setInitialDate(dateColumn);
            }}
            value={initialDate}
            placeholder="Pesquisar..."
            type="datetime-local"
            className="w-full h-8 rounded-full p-2 shadow-lg border-[#DBDEDF] border-2 mr-2"
          />
          <input
            onChange={(e: any) => {
              const dateColumn = format(e.target.value, "yyyy-MM-dd HH:mm", {
                locale: ptBR,
              });

              setFinalDate(dateColumn);
            }}
            value={finalDate}
            placeholder="Pesquisar..."
            type="datetime-local"
            className="w-full h-8 rounded-full p-2 shadow-lg border-[#DBDEDF] border-2"
          />
        </div>
      ) : (
        <input
          onChange={(e: any) => {
            if (props.colDef.type === "dateColumn") {
              const dateColumn = format(e.target.value, "yyyy-MM-dd HH:mm", {
                locale: ptBR,
              });

              setFilterValue(dateColumn);
            } else {
              console.log(e.target.value.length);
              if (e.target.value.length == 0) {
                setFilterValue("");
                setTimeout(() => {
                  props.filterChangedCallback();
                }, 0);
              } else {
                let value = "";
                console.log(props);

                if (props.colDef.fieldName === "identificadores_conteineres") {
                  console.log("entrou8");
                  value += "{";
                  value += e.target.value;
                  value += "}";
                } else {
                  value = String(e.target.value).toUpperCase();
                }

                setFilterValue(value);
                setTimeout(() => {
                  props.filterChangedCallback();
                }, 0);
              }
            }
          }}
          placeholder="Pesquisar..."
          type={
            props.colDef.type === "dateColumn"
              ? "datetime-local"
              : props.colDef.type === "numberColumn"
              ? "number"
              : "text"
          }
          className="w-full h-8 rounded-full p-2 shadow-lg border-[#DBDEDF] border-2"
        />
      )}

      {/* <Listbox
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
      </Listbox> */}
    </div>
  );
});

export default CustomFilter;
