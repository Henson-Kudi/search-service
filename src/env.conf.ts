import 'dotenv/config';
// Inject all your environment variables here
/* eslint-disable no-process-env */
export default {
  PORT: process.env.PORT || 9000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  elasticSearch: {
    url: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
    password: process.env.ELASTICSEARCH_PASSWORD || 'oaEd-Exqer0bN6WH7vzU',
  },
};
