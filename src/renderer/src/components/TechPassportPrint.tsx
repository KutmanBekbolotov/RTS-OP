import React from "react";
import { SearchResult } from "@/pages/registration";

interface TechPassportProps {
  searchResult: SearchResult;
}

const TechPassportPrint: React.FC<TechPassportProps> = ({ searchResult }) => {
  return (
    <div className="tech-passport-print relative bg-white text-xs">
      <style>
        {`
          @media print {
            @page {
              size: 15cm 10cm;
              margin: 0;
            }
            .tech-passport-print {
              width: 15cm;
              height: 10cm;
              overflow: hidden;
              page-break-inside: avoid;
              font-family: Arial, sans-serif;
            }
          }
        `}
      </style>

      {/* Сетка документа */}
      <div className="absolute inset-0 border border-black p-4">

        {/* Верх */}
        <div className="flex justify-between mb-2">
          <div>
            <p><strong>Кыргыз Республикасы</strong></p>
            <p>Свидетельство о регистрации</p>
          </div>
          <div className="text-right">
            <p><strong>KG</strong></p>
          </div>
        </div>

        {/* Основная информация */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p><strong>Госномер:</strong> {searchResult.stateNumber}</p>
            <p><strong>Номер техпаспорта:</strong> {searchResult.techPassportNumber}</p>
            <p><strong>Тип регистрации:</strong> {searchResult.registrationType}</p>
          </div>
          <div>
            <p><strong>Дата регистрации:</strong> {searchResult.registrationDate}</p>
            <p><strong>Дата получения:</strong> {searchResult.receiveDate}</p>
            <p><strong>Отдел:</strong> {searchResult.territorialDepartment}</p>
          </div>
        </div>

        <div className="absolute bottom-4 left-4">
          <p>Подпись: __________________</p>
        </div>

        <div className="absolute bottom-4 right-4">
          <div className="w-20 h-20 border border-black rounded-full flex items-center justify-center text-center text-[10px]">
            Печать
          </div>
        </div>

      </div>
    </div>
  );
};

export default TechPassportPrint;
