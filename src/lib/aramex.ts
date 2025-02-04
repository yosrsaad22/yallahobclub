export type ShipmentParams = {
  ref1: string;
  ref2: string;
  supplierCode: string;
  supplierAddress: string;
  supplierCity: string;
  supplierFullname: string;
  supplierNumber: string;
  clientAddress: string;
  clientCity: string;
  clientFullName: string;
  clientNumber: string;
  orderTotal: number;
  descriptionOfGoods: string;
  products: {
    Quantity: number;
    PackageType: string;
    Reference: string;
    Comments: string;
    Weight: { Unit: string; Value: number };
  }[];
};

export const createShipment = ({
  ref1,
  ref2,
  supplierCode,
  supplierAddress,
  supplierCity,
  supplierFullname,
  supplierNumber,
  clientAddress,
  clientCity,
  clientFullName,
  clientNumber,
  orderTotal,
  products,
  descriptionOfGoods,
}: ShipmentParams) => ({
  Reference1: ref1,
  Reference2: ref2,
  Reference3: '',
  Shipper: {
    Reference1: supplierCode,
    Reference2: '',
    AccountNumber: process.env.ARAMEX_ACCOUNT_NUMBER,
    PartyAddress: {
      Line1: supplierAddress,
      Line2: '',
      Line3: '',
      City: supplierCity,
      StateOrProvinceCode: '',
      PostCode: '',
      CountryCode: 'TN',
      Longitude: 0,
      Latitude: 0,
      BuildingNumber: null,
      BuildingName: null,
      Floor: null,
      Apartment: null,
      POBox: null,
      Description: null,
    },
    Contact: {
      Department: '',
      PersonName: supplierFullname,
      Title: '',
      CompanyName: '',
      PhoneNumber1: supplierNumber,
      PhoneNumber1Ext: '',
      PhoneNumber2: '',
      PhoneNumber2Ext: '',
      FaxNumber: '',
      CellPhone: supplierNumber,
      EmailAddress: '',
      Type: '',
    },
  },
  Consignee: {
    Reference1: '',
    Reference2: '',
    AccountNumber: process.env.ARAMEX_ACCOUNT_NUMBER || '',
    PartyAddress: {
      Line1: clientAddress,
      Line2: '',
      Line3: '',
      City: clientCity,
      StateOrProvinceCode: '',
      PostCode: '',
      CountryCode: 'TN',
      Longitude: 0,
      Latitude: 0,
      BuildingNumber: '',
      BuildingName: '',
      Floor: '',
      Apartment: '',
      POBox: null,
      Description: '',
    },
    Contact: {
      Department: '',
      PersonName: clientFullName,
      Title: '',
      CompanyName: '',
      PhoneNumber1: clientNumber,
      PhoneNumber1Ext: '',
      PhoneNumber2: '',
      PhoneNumber2Ext: '',
      FaxNumber: '',
      CellPhone: clientNumber,
      EmailAddress: '',
      Type: '',
    },
  },
  ThirdParty: {
    Reference1: '',
    Reference2: '',
    AccountNumber: '',
    PartyAddress: {
      Line1: '',
      Line2: '',
      Line3: '',
      City: '',
      StateOrProvinceCode: '',
      PostCode: '',
      CountryCode: '',
      Longitude: 0,
      Latitude: 0,
      BuildingNumber: null,
      BuildingName: null,
      Floor: null,
      Apartment: null,
      POBox: null,
      Description: null,
    },
    Contact: {
      Department: '',
      PersonName: '',
      Title: '',
      CompanyName: '',
      PhoneNumber1: '',
      PhoneNumber1Ext: '',
      PhoneNumber2: '',
      PhoneNumber2Ext: '',
      FaxNumber: '',
      CellPhone: '',
      EmailAddress: '',
      Type: '',
    },
  },

  ShippingDateTime: `/\Date(${new Date().getTime()}-0500)\/`,
  DueDate: `/\Date(${new Date().getTime()}-0500)\/`,
  Comments: '',
  PickupLocation: '',
  OperationsInstructions: '',
  AccountingInstrcutions: '',
  Details: {
    Dimensions: null,
    ActualWeight: {
      Unit: 'KG',
      Value: 0.5,
    },
    ChargeableWeight: null,
    DescriptionOfGoods: descriptionOfGoods,
    GoodsOriginCountry: 'TN',
    NumberOfPieces: 1,
    ProductGroup: 'DOM',
    ProductType: 'ONP',
    PaymentType: 'P',
    PaymentOptions: '',
    CustomsValueAmount: null,
    CashOnDeliveryAmount: {
      CurrencyCode: 'TND',
      Value: orderTotal,
    },
    InsuranceAmount: null,
    CashAdditionalAmount: null,
    CashAdditionalAmountDescription: '',
    CollectAmount: null,
    Services: 'CODS',
    Items: products,
  },
  Attachments: [],
  ForeignHAWB: '',
  TransportType: 0,
  PickupGUID: '',
  Number: null,
  ScheduledDelivery: null,
});

export const createPickupRequest = ({
  supplierAddress,
  supplierCity,
  supplierFullName,
  supplierNumber,
  shipments,
  pickUpReference,
}: {
  supplierAddress: string;
  supplierCity: string;
  supplierFullName: string;
  supplierNumber: string;
  shipments: ShipmentParams[];
  pickUpReference: string;
}) => {
  const version = process.env.ARAMEX_VERSION || '1.0';
  const password = process.env.ARAMEX_PASSWORD || '';
  const userName = process.env.ARAMEX_USERNAME || '';
  const accountPin = process.env.ARAMEX_PIN || '';
  const accountEntity = process.env.ARAMEX_ACCOUNT_ENTITY || '';
  const accountNumber = process.env.ARAMEX_ACCOUNT_NUMBER || '';
  const accountCountryCode = process.env.ARAMEX_ACCOUNT_COUNTRY_CODE || '';

  const clientInfo = {
    Version: version,
    Password: password + '$r',
    UserName: userName,
    AccountPin: accountPin,
    AccountEntity: accountEntity,
    AccountNumber: accountNumber,
    AccountCountryCode: accountCountryCode,
  };

  const labelInfo = {
    ReportID: 9201,
    ReportType: 'URL',
  };

  const pickupAddress = {
    Line1: supplierAddress,
    Line2: '',
    Line3: '',
    City: supplierCity,
    StateOrProvinceCode: '',
    PostCode: '',
    CountryCode: 'TN',
    Longitude: 0,
    Latitude: 0,
  };

  const pickupContact = {
    Department: '',
    PersonName: supplierFullName,
    Title: '',
    CompanyName: '',
    PhoneNumber1: supplierNumber,
    PhoneNumber1Ext: '',
    PhoneNumber2: '',
    PhoneNumber2Ext: '',
    FaxNumber: '',
    CellPhone: supplierNumber,
    EmailAddress: '',
    Type: '',
  };

  const pickupItems = [
    {
      ProductGroup: 'EXP',
      ProductType: 'PDX',
      NumberOfShipments: shipments.length,
      PackageType: '',
      Payment: 'P',
      ShipmentWeight: {
        Unit: 'KG',
        Value: 0,
      },
      ShipmentVolume: null,
      NumberOfPieces: 1,
      CashAmount: null,
      ExtraCharges: null,
      ShipmentDimensions: {
        Length: 0,
        Width: 0,
        Height: 0,
        Unit: '',
      },
      Comments: '',
    },
  ];

  const now = new Date();
  let pickupDate = new Date(now);
  let readyTime = new Date(now);
  let lastPickupTime = new Date(now);
  let closingTime = new Date(now);

  if (now.getHours() < 12) {
    // Set to today if current time is before 12 PM
    pickupDate.setHours(13, 0, 0, 0); // 13:00 today
    readyTime.setHours(13, 0, 0, 0); // 13:00 today
    lastPickupTime.setHours(17, 0, 0, 0); // 17:00 today
    closingTime.setHours(17, 0, 0, 0); // 17:00 today
  } else {
    // Set to tomorrow if current time is after 12 PM
    pickupDate.setDate(now.getDate() + 1);
    pickupDate.setHours(13, 0, 0, 0); // 13:00 tomorrow
    readyTime.setDate(now.getDate() + 1);
    readyTime.setHours(13, 0, 0, 0); // 13:00 tomorrow
    lastPickupTime.setDate(now.getDate() + 1);
    lastPickupTime.setHours(17, 0, 0, 0); // 17:00 tomorrow
    closingTime.setDate(now.getDate() + 1);
    closingTime.setHours(17, 0, 0, 0); // 17:00 tomorrow
  }

  const formatDateToAramex = (date: Date) => `\/Date(${date.getTime()}-0500)\/`;

  const pickup = {
    PickupAddress: pickupAddress,
    PickupContact: pickupContact,
    PickupLocation: 'Reception',
    PickupDate: formatDateToAramex(pickupDate),
    ReadyTime: formatDateToAramex(readyTime),
    LastPickupTime: formatDateToAramex(lastPickupTime),
    ClosingTime: formatDateToAramex(closingTime),
    Comments: '',
    Reference1: pickUpReference,
    PickupItems: pickupItems,
    Shipments: shipments,
    Status: 'Ready',
    Branch: '',
    RouteCode: '',
    Vehicle: '',
  };

  const transaction = {
    Reference1: '',
    Reference2: '',
    Reference3: '',
    Reference4: '',
    Reference5: '',
  };

  return {
    ClientInfo: clientInfo,
    LabelInfo: labelInfo,
    Pickup: pickup,
    Transaction: transaction,
  };
};

export const trackShipmentsRequest = ({ deliveryIds }: { deliveryIds: string[] }) => {
  const version = process.env.ARAMEX_VERSION || '1.0';
  const password = process.env.ARAMEX_PASSWORD || '';
  const userName = process.env.ARAMEX_USERNAME || '';
  const accountPin = process.env.ARAMEX_PIN || '';
  const accountEntity = process.env.ARAMEX_ACCOUNT_ENTITY || '';
  const accountNumber = process.env.ARAMEX_ACCOUNT_NUMBER || '';
  const accountCountryCode = process.env.ARAMEX_ACCOUNT_COUNTRY_CODE || '';

  const clientInfo = {
    Version: version,
    Password: password + '$r',
    UserName: userName,
    AccountPin: accountPin,
    AccountEntity: accountEntity,
    AccountNumber: accountNumber,
    AccountCountryCode: accountCountryCode,
  };

  return {
    ClientInfo: clientInfo,
    Shipments: deliveryIds,
  };
};

export const printLabelRequest = ({ deliveryId }: { deliveryId: string }) => {
  const version = process.env.ARAMEX_VERSION || '1.0';
  const password = process.env.ARAMEX_PASSWORD || '';
  const userName = process.env.ARAMEX_USERNAME || '';
  const accountPin = process.env.ARAMEX_PIN || '';
  const accountEntity = process.env.ARAMEX_ACCOUNT_ENTITY || '';
  const accountNumber = process.env.ARAMEX_ACCOUNT_NUMBER || '';
  const accountCountryCode = process.env.ARAMEX_ACCOUNT_COUNTRY_CODE || '';

  const clientInfo = {
    Version: version,
    Password: password + '$r',
    UserName: userName,
    AccountPin: accountPin,
    AccountEntity: accountEntity,
    AccountNumber: accountNumber,
    AccountCountryCode: accountCountryCode,
  };

  return {
    ClientInfo: clientInfo,
    ShipmentNumber: deliveryId,
    ProductGroup: 'DOM',
    OriginEntity: 'AMM',
    LabelInfo: {
      ReportID: 9729,
      ReportType: 'URL',
    },
  };
};
