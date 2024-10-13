import { esIndexes } from '../value-objects/constants';

// Define how data will be transfered
export type SearchIndexModule = 'users' | 'products' | 'categories' | 'brands';

const indexes = Object.values(esIndexes);

export type SearchQuery = {
  query: string;
  page?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
  modules?: (typeof indexes)[number][] | '*';
};

export type ProductIndex = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
};

export type BrandIndex = {
  id: string;
  name: string;
};

export type CategoryIndex = {
  id: string;
  name: string;
};

export type CreateIndexDTO = {
  name: string;
  fields: string[];
};
