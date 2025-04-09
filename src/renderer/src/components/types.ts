export interface SearchResult {
  registrationType: string | null;
  registrationDate: string | null;
  receiveDate: string | null;
  territorialDepartment: string | null;
  district: string | null;
  organizationName: string | null;
  subdivision: string | null;
  address: string | null;
  stateNumber: string | null;
  techPassportNumber: string | null;
  expirationDate: string | null;
  submissionDate: string | null;
  stateNumberSubmissionDate: string | null;
  fullName: string | null;
  note: string | null;

  model: string | null;
  yearOfManufacture: string | null;
  color: string | null;
  vin: string | null;
  chassisNumber: string | null;
  bodyType: string | null;
  seatCount: string | null;
  fuelType: string | null;
  registrationNumber: string | null;
  vid: string | null;
  owner: string | null;
  personalNumber: string | null;
  ownerAddress: string | null;
  issuingAuthority: string | null;
  authorizedSignature: string | null;

  engineCapacity: string | null;
  enginePower: string | null;
  unladenMass: string | null;
  maxPermissibleMass: string | null;
}
