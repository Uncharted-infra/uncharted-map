export const inventoryTypeDefs = /* GraphQL */ `
  enum InventoryKind {
    FLIGHTS
    HOTELS
    CARS
  }

  enum SearchStatus {
    READY
    STARTED
    PARTIAL
    COMPLETE
    FAILED
    EXPIRED
  }

  enum CabinClass {
    ECONOMY
    PREMIUM_ECONOMY
    BUSINESS
    FIRST
  }

  input InventorySearchInput {
    origin: String!
    destination: String!
    departDate: String!
    returnDate: String
    adults: Int!
    children: Int
    cabin: CabinClass
  }

  type Money {
    amount: Float!
    currency: String!
  }

  type ProviderRef {
    name: String!
    offerRef: String!
  }

  type SearchError {
    code: String!
    message: String!
  }

  type SearchMeta {
    fetchedAt: String!
    ttlSeconds: Int!
    providersAttempted: Int!
    providersSucceeded: Int!
  }

  type FlightOffer {
    id: ID!
    origin: String!
    destination: String!
    departAt: String
    arriveAt: String
    durationMinutes: Int
    airline: String!
    stops: Int!
    cabin: CabinClass!
    price: Money!
    deepLink: String
    provider: ProviderRef!
    expiresAt: String
  }

  type HotelOffer {
    id: ID!
    name: String!
    location: String!
    stars: Int
    price: Money!
    deepLink: String
    provider: ProviderRef!
    expiresAt: String
  }

  type CarOffer {
    id: ID!
    vendor: String!
    vehicleClass: String!
    pickupLocation: String!
    price: Money!
    deepLink: String
    provider: ProviderRef!
    expiresAt: String
  }

  type InventorySearchResponse {
    searchId: ID!
    kind: InventoryKind!
    status: SearchStatus!
    cacheHit: Boolean!
    stale: Boolean!
    flightOffers: [FlightOffer!]!
    hotelOffers: [HotelOffer!]!
    carOffers: [CarOffer!]!
    error: SearchError
    meta: SearchMeta
  }

  type Query {
    inventorySearch(kind: InventoryKind!, input: InventorySearchInput!): InventorySearchResponse!
    inventorySearchById(searchId: ID!): InventorySearchResponse
  }

  type Mutation {
    refreshInventorySearch(searchId: ID!): InventorySearchResponse
  }
`;
