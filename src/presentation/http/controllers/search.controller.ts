import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import IUseCase from '../../../application/use-cases';
import {
  BrandIndex,
  CategoryIndex,
  ProductIndex,
  SearchQuery,
} from '../../../domain/dtos';
import { ReturnValue } from '../../../domain/value-objects/returnValue';
import RequestObject from '../../../utils/types/requestObject';
import IContoller from './Icontroller';
import SearchUseCase from '../../../application/use-cases/searchUsecase';
import { esClient } from '../../../infrastructure/data';

export default class SearchControler implements IContoller<ReturnValue> {
  constructor(
    private readonly searchUseCase: IUseCase<
      [SearchQuery],
      ReturnValue<SearchHit<ProductIndex | CategoryIndex | BrandIndex>[] | null>
    >
  ) {}
  handle(
    request: RequestObject
  ): Promise<
    ReturnValue<SearchHit<ProductIndex | CategoryIndex | BrandIndex>[] | null>
  > {
    const { query, page, limit, sort, modules } = request.query;
    if (!query?.trim().length) {
      return Promise.resolve(
        new ReturnValue(false, 'Search query is required', null)
      );
    }

    const params: SearchQuery = {
      query: query?.trim(),
      page,
      limit,
      sort,
      modules,
    };

    return this.searchUseCase.execute(params);
  }
}

export const searchController = new SearchControler(
  new SearchUseCase(esClient)
);
