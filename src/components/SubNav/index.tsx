import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import history from "../../services/history";

import { BsCaretRightFill } from "react-icons/bs";
import "./styles.css";
// import { Container } from './styles';

interface Props {
  isVisibleActions?: boolean;
}

const SubNav: React.FC<Props> = (props: Props) => {
  const [paths, setPaths] = useState<any[]>([]);

  function toCamelCase(str: any) {
    return str
      .toLowerCase() // Converte tudo para minúsculo primeiro
      .split(" ") // Separa a string em palavras
      .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitaliza a primeira letra de cada palavra
      .join(" ");
  }

  const loadBreadCrumb = useCallback(() => {
    const paths = window.location.pathname
      .replace("/", "")
      .split("/")
      .slice(1, 3);

    setPaths(paths);
  }, []);

  useEffect(() => {
    loadBreadCrumb();
  }, [loadBreadCrumb]);

  return (
    <div
      className="flex flex-1 w-screen !h-[52px] bg-[#005491] text-[#fff] items-center justify-between"
      style={{ height: "52px" }}
    >
      <div className="mr-4 ml-5 flex">
        <Breadcrumb>
          {paths.map((path, index) => {
            const isLast = index === paths.length - 1;
            const linkPath = `${window.location.pathname.replace(
              `/${paths[paths.length - 1]}`,
              ""
            )}`; // Gera o caminho até o item atual

            return (
              <div className="flex items-center">
                <BreadcrumbItem active key={index}>
                  {isLast ? (
                    <>
                      <span className="text-sm">{toCamelCase(path)}</span>
                    </>
                  ) : (
                    <Link
                      to={linkPath}
                      onClick={() => {
                        setTimeout(() => {
                          window.location.reload();
                        }, 500);
                      }}
                      className="text-sm hover:text-[#F9C100]"
                    >
                      {toCamelCase(path)}
                    </Link>
                  )}
                </BreadcrumbItem>
                {!isLast && (
                  <span className="breadcrumb-separator">
                    {" "}
                    <BsCaretRightFill
                      style={{
                        width: "12px",
                        marginTop: "4px",
                        marginRight: "10px",
                      }}
                      color="#abd"
                    />{" "}
                  </span>
                )}
              </div>
            );
          })}
        </Breadcrumb>

        {/* <h1 className="text-sm">{}</h1> */}
      </div>
      {props.isVisibleActions && (
        <div className="flex !mr-4 items-center">
          <h1 className="!mr-4 cursor-pointer hover:text-yellow-400 text-sm">
            Exibir
          </h1>
          <h1 className="!mr-4 cursor-pointer hover:text-yellow-400 text-sm">
            Exportar
          </h1>
          <h1 className="!mr-2 cursor-pointer hover:text-yellow-400 text-sm">
            Filtrar
          </h1>

          <div className="w-32 h-6 !ml-5">
            <button
              className="flex items-center justify-center w-20 h-6 bg-[#fff] rounded-2xl text-xs text-[#005491] hover:bg-[#edb20e] hover:text-[#fff]"
              onClick={() => {
                history.push(window.location.pathname + "/adicionar");
                window.location.reload();
              }}
            >
              Adicionar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubNav;
