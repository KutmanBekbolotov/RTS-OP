import React from "react";
import { SearchResult } from "./types";
import "./techPassportPrint.css";

interface TechPassportProps {
  searchResult: SearchResult;
}

const TechPassportPrint: React.FC<TechPassportProps> = ({ searchResult }) => {
  const formatPrintValue = (value: string | null): string => {
    if (!value) {
      return "";
    }

    const normalized = value.trim();
    if (!normalized || /^[-\u2014\s]+$/.test(normalized)) {
      return "";
    }

    return normalized;
  };

  const formatRegistrationValue = (): string => {
    const registrationNumber = formatPrintValue(searchResult.registrationNumber);
    const stateNumber = formatPrintValue(searchResult.stateNumber);

    if (registrationNumber && stateNumber) {
      return registrationNumber.toLowerCase() === stateNumber.toLowerCase()
        ? registrationNumber
        : `${registrationNumber} / ${stateNumber}`;
    }

    return registrationNumber || stateNumber;
  };

  const getOwnerLines = (): string[] => {
    const subdivision = formatPrintValue(searchResult.subdivision);
    const organization = formatPrintValue(searchResult.organizationName);
    const owner = formatPrintValue(searchResult.owner);
    const lines: string[] = [];

    const appendUnique = (value: string) => {
      if (!value) {
        return;
      }

      const lowerValue = value.toLowerCase();
      if (lines.some((line) => line.toLowerCase() === lowerValue)) {
        return;
      }

      lines.push(value);
    };

    appendUnique(subdivision);
    appendUnique(organization);
    appendUnique(owner);

    return lines;
  };

  const getIssuingAuthorityLines = (): string[] => {
    const authority = formatPrintValue(searchResult.issuingAuthority);
    return authority ? [authority] : [];
  };

  const getAddressLines = (): string[] => {
    const district = formatPrintValue(searchResult.district);
    const address =
      formatPrintValue(searchResult.ownerAddress) || formatPrintValue(searchResult.address);
    const lines: string[] = [];

    if (district) {
      lines.push(district);
    }

    if (address && !lines.some((line) => line.toLowerCase() === address.toLowerCase())) {
      lines.push(address);
    }

    return lines;
  };

  const formatDateToRu = (value: string | null): string => {
    const normalized = formatPrintValue(value);
    if (!normalized) {
      return "";
    }

    const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      const [, year, month, day] = match;
      return `${day}.${month}.${year}`;
    }

    return normalized;
  };

  const ownerLines = getOwnerLines();
  const issuingAuthorityLines = getIssuingAuthorityLines();
  const addressLines = getAddressLines();

  return (
    <div className="tech-passport-print">
      <div className="container">
        <div className="main-info-left">
          <div className="model">
            <h6>МАРКА, МОДЕЛЬ</h6>
            <span>{formatPrintValue(searchResult.model)}</span>
          </div>

          <div className="yearOfManifacture">
            <h6>ГОД ВЫПУСКА</h6>
            <span>{formatPrintValue(searchResult.yearOfManufacture)}</span>
          </div>

          <div className="colour">
            <h6>ЦВЕТ</h6>
            <span>{formatPrintValue(searchResult.color)}</span>
          </div>

          <div className="vehicleNumber">
            <h6>ИДЕНТИФИКАЦИОННЫЙ НОМЕР</h6>
            <span>{formatPrintValue(searchResult.vin)}</span>
          </div>

          <div className="carBodyNum">
            <h6>№ КУЗОВА, № ШАССИ</h6>
            <span>{formatPrintValue(searchResult.chassisNumber)}</span>
          </div>

          <div className="carBodyType">
            <h6>ТИП ТС, ВИД КУЗОВА</h6>
            <span>{formatPrintValue(searchResult.bodyType)}</span>
          </div>

          <div className="quantitySeats">
            <h6>КАТЕГОРИЯ ТС, КОЛИЧЕСТВО МЕСТ</h6>
            <span>{formatPrintValue(searchResult.seatCount)}</span>
          </div>

          <div className="fuelType">
            <h6>ТИП ТОПЛИВА</h6>
            <span>{formatPrintValue(searchResult.fuelType)}</span>
          </div>

          <div className="engineCapacity">
            <h6>РАБОЧИЙ ОБЪЕМ ДВИГАТЕЛЯ</h6>
            <span>{formatPrintValue(searchResult.engineCapacity)}</span>
          </div>

          <div className="enginePower">
            <h6>МОЩНОСТЬ ДВИГАТЕЛЯ</h6>
            <span>{formatPrintValue(searchResult.enginePower)}</span>
          </div>

          <div className="unladenMass">
            <h6>МАССА БЕЗ НАГРУЗКИ</h6>
            <span>{formatPrintValue(searchResult.unladenMass)}</span>
          </div>

          <div className="maxPermissibleMass">
            <h6>МАКСИМАЛЬНАЯ РАЗРЕШЕННАЯ МАССА</h6>
            <span>{formatPrintValue(searchResult.maxPermissibleMass)}</span>
          </div>
        </div>

        <div className="main-info-right">
          <div className="main-info-right-top">
            <div className="registerNumber">
              <h6>РЕГИСТРАЦИОННЫЙ НОМЕР</h6>
              <span className="number">
                {formatRegistrationValue()}
              </span>
            </div>

            <div className="vid">
              <h6>УНИКАЛЬНЫЙ ИДЕНТИФИКАТОР (VID)</h6>
              <span>{formatPrintValue(searchResult.vid)}</span>
            </div>

            <div className="owner">
              <h6>СОБСТВЕННИК</h6>
              <span>
                {ownerLines.length > 0
                  ? ownerLines.map((line, index) => (
                    <React.Fragment key={`${line}-${index}`}>
                      {line}
                      {index < ownerLines.length - 1 ? <br /> : null}
                    </React.Fragment>
                  ))
                  : ""}
              </span>
            </div>
          </div>
          <div className="main-info-right-middle">
            <div className="personalNumber">
              <h6>ПИН, ИСН</h6>
              <span>{formatPrintValue(searchResult.personalNumber)}</span>
            </div>

            <div className="address">
              <h6>АДРЕС СОБСТВЕННИКА</h6>
              <span
                // style={{ whiteSpace: "normal", wordWrap: "break-word", overflowWrap: "break-word", display: "block", maxWidth: "100%" }}
              >
                {addressLines.length > 0
                  ? addressLines.map((line, index) => (
                    <React.Fragment key={`${line}-${index}`}>
                      {line}
                      {index < addressLines.length - 1 ? <br /> : null}
                    </React.Fragment>
                  ))
                  : ""}
              </span>
            </div>
          </div>
          <div className="main-info-right-bottom">
            <div className="issuingAuthority">
              <h6>ОРГАН ВЫДАЧИ</h6>
              <span>
                {issuingAuthorityLines.length > 0
                  ? issuingAuthorityLines.map((line, index) => (
                    <React.Fragment key={`${line}-${index}`}>
                      {line}
                      {index < issuingAuthorityLines.length - 1 ? <br /> : null}
                    </React.Fragment>
                  ))
                  : ""}
              </span>
            </div>

            <div className="registerDate">
              <h6>ДАТА РЕГИСТРАЦИИ</h6>
              <span>{formatDateToRu(searchResult.registrationDate)}</span>
            </div>

            <div className="signature">
              <h6>ПОДПИСЬ УПОЛНОМОЧЕННОГО ЛИЦА</h6>
              <span>{formatPrintValue(searchResult.authorizedSignature)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechPassportPrint;
