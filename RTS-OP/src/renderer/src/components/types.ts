export interface SearchResult {
    // справка
    registrationType: string;
    registrationDate: string;
    receiveDate: string;
    territorialDepartment: string;
    district: string;
    organizationName: string;
    subdivision: string;
    address: string;
    stateNumber: string;
    techPassportNumber: string;
    expirationDate: string;
    submissionDate: string;
    stateNumberSubmissionDate: string;
    fullName: string;
    note: string;
  
    // техпаспорт
    model: string;
    yearOfManufacture: string;
    color: string;
    vin: string;
    chassisNumber: string;
    bodyType: string;
    seatCount: string;
    fuelType: string;
    engineCapacity: string;
    enginePower: string;
    unladenMass: string;
    maxPermissibleMass: string;
    registrationNumber: string;
    vid: string;
    owner: string;
    personalNumber: string;
    ownerAddress: string;
    issuingAuthority: string;
    authorizedSignature: string;
  }
  