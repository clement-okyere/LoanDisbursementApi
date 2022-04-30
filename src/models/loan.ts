import { Status } from '../utils/enums';

export interface Loan {
  id: string;
  amount: number;
  status: Status;
  company?: Company;
}

export interface Locatie {
  lon: string;
  lat: string;
}

export interface Self {
  href: string;
}

export interface Links {
  self: Self;
}

export interface Company {
  vestigingsnummer: string;
  vestiging: number;
  type: string;
  pand_id: string;
  omschrijving: string;
  lei: string;
  statutairehandelsnaam: string[];
  rsin: string;
  updated_at: string;
  straat: string;
  actief: boolean;
  bestaandehandelsnaam: string[];
  website?: any;
  vbo_id: string;
  locatie: Locatie;
  btw: string;
  plaats: string;
  datum_oprichting: string;
  postcode: string;
  dossiernummer: string;
  non_mailing_indicatie: boolean;
  subdossiernummer: string;
  huisnummer: string;
  sbi: number[];
  soort_onderneming: string;
  handelsnaam: string;
  _links: Links;
}
