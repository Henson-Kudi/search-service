import { Client } from '@elastic/elasticsearch';
import IUseCase from '.';
import {
  BrandIndex,
  CategoryIndex,
  ProductIndex,
  SearchQuery,
} from '../../domain/dtos';
import {
  QueryDslQueryContainer,
  SearchHit,
} from '@elastic/elasticsearch/lib/api/types';
import { esIndexes, esIndexFields } from '../../domain/value-objects/constants';
import { ReturnValue } from '../../domain/value-objects/returnValue';
import AppError from '../../domain/value-objects/appError';
import { ResponseCodes } from '../../domain/enums/responseCode';

export default class SearchUseCase
  implements
    IUseCase<
      [SearchQuery],
      ReturnValue<SearchHit<ProductIndex | CategoryIndex | BrandIndex>[] | null>
    >
{
  constructor(private readonly esClient: Client) {}

  async execute(
    params: SearchQuery
  ): Promise<
    ReturnValue<SearchHit<ProductIndex | CategoryIndex | BrandIndex>[] | null>
  > {
    let { query, page, limit, sort, modules } = params;

    if (!modules) {
      modules = '*';
    }

    // Validate modules
    const validModules = esIndexes;

    const isValidModule =
      modules === '*' ||
      (Array.isArray(modules) &&
        modules.every((module) => validModules[module]));

    if (!isValidModule) {
      return new ReturnValue(
        false,
        'Invalid modules provided',
        null,
        new AppError('Invalid modules provided', ResponseCodes.BadRequest)
      );
    }

    const pageNum = page && +page && !isNaN(+page) && +page > 0 ? +page : 1;
    const limitNum =
      limit && +limit && !isNaN(+limit) && +limit > 0 ? +limit : 10;
    const from = (pageNum - 1) * limitNum;
    const sortOption = sort === 'asc' ? 'asc' : 'desc';

    const queryParams = {
      type: 'best_fields',
      fuzziness: 'AUTO',
      prefix_length: 2,
    };

    const indexes = modules === '*' ? Object.values(validModules) : modules;

    const searchQuery: QueryDslQueryContainer[] = indexes.map(
      (ind) =>
        ({
          multi_match: {
            query: query,
            fields: esIndexFields[ind] as unknown as string[],
            ...queryParams,
          },
        }) as QueryDslQueryContainer
    );

    const response = await this.esClient.search<
      ProductIndex | CategoryIndex | BrandIndex
    >({
      index: indexes.join(','),
      size: limit,
      from,
      sort: {
        _score: {
          order: sortOption,
        },
      },
      body: {
        query: {
          bool: {
            should: searchQuery,
          },
        },
      },
    });

    return new ReturnValue(true, 'Search successful', response.hits.hits);
  }
}
