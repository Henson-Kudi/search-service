import initConsumerHandlers from './application/consumers';
import MessageBroker from './infrastructure/providers';
import startExpressServer from './presentation/express';
import kafkaTopics from './utils/kafkaTopics.json';

export default async function startServer() {
  startExpressServer();

  // Initialise consumers
  MessageBroker.subscribe(kafkaTopics.consumers, initConsumerHandlers);
}
