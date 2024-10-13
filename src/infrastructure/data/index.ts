// Setting up elastic search client
// src/elasticClient.ts
import { Client } from '@elastic/elasticsearch';
import envConf from '../../env.conf';
import { IndicesCreateRequest } from '@elastic/elasticsearch/lib/api/types';
import logger from '../../utils/logger';

export const esClient = new Client({
  node: envConf.elasticSearch.url,
  auth: {
    ...envConf.elasticSearch,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Optionally, you can define a helper to check the health of the cluster
export const checkElasticsearchHealth = async () => {
  const health = await esClient.cluster.health({});
  logger.log('Elasticsearch Health: ', health.status);
};

export const createIndexes = async (indices: IndicesCreateRequest[]) => {
  for (const index of indices) {
    // Ensure index does not already exist
    const exists = await esClient.indices.exists({ index: index.index });

    if (exists) {
      logger.info(`Index ${index.index} already exists`);
      continue;
    }

    await esClient.indices.create(index);

    logger.info(`Index ${index.index} created`);
  }
};
