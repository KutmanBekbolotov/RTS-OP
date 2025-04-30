import React from "react";
import { SearchResult } from "./types";
import "./techPassportPrint.css";


interface TechPassportProps {
  searchResult: SearchResult;
}

const TechPassportPrint: React.FC<TechPassportProps> = ({ searchResult }) => {

  console.log("TechPassportPrint props:", searchResult);
  return (
    <div className="tech-passport-print">
      <div className="container">
        <div className="main-info-left">
          <div className="model">
            <h6>МАРКА, МОДЕЛЬ</h6>
            <span>{searchResult.model || "—————"}</span>
          </div>

          <div className="yearOfManifacture">
            <h6>ГОД ВЫПУСКА</h6>
            <span>{searchResult.yearOfManufacture || "—————"}</span>
          </div>

          <div className="colour">
            <h6>ЦВЕТ</h6>
            <span>{searchResult.color || "—————"}</span>
          </div>

          <div className="vehicleNumber">
            <h6>ИДЕНТИФИКАЦИОННЫЙ НОМЕР</h6>
            <span>{searchResult.vin || "—————"}</span>
          </div>

          <div className="carBodyNum">
            <h6>№ КУЗОВА, № ШАССИ</h6>
            <span>{searchResult.chassisNumber || "—————"}</span>
          </div>

          <div className="carBodyType">
            <h6>ТИП ТС, ВИД КУЗОВА</h6>
            <span>{searchResult.bodyType || "—————"}</span>
          </div>

          <div className="quantitySeats">
            <h6>КАТЕГОРИЯ ТС, КОЛИЧЕСТВО МЕСТ</h6>
            <span>{searchResult.seatCount || "—————"}</span>
          </div>

          <div className="fuelType">
            <h6>ТИП ТОПЛИВА</h6>
            <span>{searchResult.fuelType || "—————"}</span>
          </div>

          <div className="engineCapacity">
            <h6>РАБОЧИЙ ОБЪЕМ ДВИГАТЕЛЯ</h6>
            <span>{searchResult.engineCapacity || "—————"}</span>
          </div>

          <div className="enginePower">
            <h6>МОЩНОСТЬ ДВИГАТЕЛЯ</h6>
            <span>{searchResult.enginePower || "—————"}</span>
          </div>

          <div className="unladenMass">
            <h6>МАССА БЕЗ НАГРУЗКИ</h6>
            <span>{searchResult.unladenMass || "—————"}</span>
          </div>

          <div className="maxPermissibleMass">
            <h6>МАКСИМАЛЬНАЯ РАЗРЕШЕННАЯ МАССА</h6>
            <span>{searchResult.maxPermissibleMass || "—————"}</span>
          </div>
        </div>

        <div className="main-info-right">
          <div className="main-info-right-top">
            <div className="registerNumber">
              <h6>РЕГИСТРАЦИОННЫЙ НОМЕР</h6>
              <span>{searchResult.registrationNumber || "—————"}</span>
            </div>

            <div className="vid">
              <h6>УНИКАЛЬНЫЙ ИДЕНТИФИКАТОР (VID)</h6>
              <span>{searchResult.vid || "—————"}</span>
            </div>

            <div className="owner">
              <h6>СОБСТВЕННИК</h6>
              <span>{searchResult.owner || "—————"}</span>
            </div>
            </div>
            <div className="main-info-right-bottom">
            <div className="personalNumber">
              <h6>ПИН, ИСН</h6>
              <span>{searchResult.personalNumber || "—————"}</span>
            </div>

            <div className="address">
              <h6>АДРЕС СОБСТВЕННИКА</h6>
              <span>{searchResult.ownerAddress || "—————"}</span>
            </div>

            <div className="issuingAuthority">
              <h6>ОРГАН ВЫДАЧИ</h6>
              <span>{searchResult.issuingAuthority || "—————"}</span>
            </div>

            <div className="registerDate">
              <h6>ДАТА РЕГИСТРАЦИИ</h6>
              <span>{searchResult.registrationDate || "—————"}</span>
            </div>

            <div className="signature">
              <h6>ПОДПИСЬ УПОЛНОМОЧЕННОГО ЛИЦА</h6>
              <span>{searchResult.authorizedSignature || "—————"}</span>
            </div>
            </div>
          
      
        </div>
      </div>
    </div>
  );
};


export default TechPassportPrint;
