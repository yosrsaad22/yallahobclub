export type ShipmentParams = {
  ref1: string;
  products: string;
  price: number;
  postalCode: string;
  city: string;
  number: string;
  address: string;
  name: string;
  pickupId: number;
  openParcel: string;
  fragile: string;
  exchangeContent: string;
};

export const createShipment = ({
  ref1,
  products,
  price,
  postalCode,
  city,
  number,
  address,
  name,
  pickupId,
  openParcel,
  fragile,
  exchangeContent,
}: ShipmentParams) => {
  const login = process.env.MASSAR_LOGIN || '';
  const password = process.env.MASSAR_PASSWORD || '';

  return {
    login: login,
    password: password,
    reference: ref1,
    designation: products,
    montant_reception: price,
    modalite: '2',
    contenuEchange: exchangeContent,
    code: postalCode,
    ville: city,
    tel: number,
    adresse: address,
    nom: name,
    nombre_piece: '1',
    pickup_id: pickupId,
    open_parcel: openParcel,
    fragile: fragile,
  };
};
