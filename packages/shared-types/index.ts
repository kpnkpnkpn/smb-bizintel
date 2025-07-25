export interface Business {
  id: string; // UUID
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  website?: string | null;
  phoneNumber?: string | null;
  ownerName?: string | null;
  yearStarted?: number | null;
  starRating?: number | null;
  reviewCount?: number | null;
  naicsCode?: string | null;
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
} 