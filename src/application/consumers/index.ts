import { Message } from 'node-rdkafka';
import { MessageHandler } from '../../domain/dtos/messageBroker';
import {
  handleProductCreatedEvent,
  handleProductUpdatedEvent,
  handleManyProductsDeletedEvent,
  handleProductDeletedEvent,
} from './products';
import logger from '../../utils/logger';
import {
  handleBrandCreatedEvent,
  handleBrandDeletedEvent,
  handleBrandUpdatedEvent,
  handleManyBrandsDeletedEvent,
} from './brands';
import {
  handleCategoryCreatedEvent,
  handleCategoryDeletedEvent,
  handleCategoryUpdatedEvent,
  handleManyCategoriesDeletedEvent,
} from './categories';
import {
  handleManyUsersDeletedEvent,
  handleUserCreatedEvent,
  handleUserDeletedEvent,
  handleUserUpdatedEvent,
} from './users';

type Topichandlers = {
  [topic: string]: MessageHandler;
};

const topicHandlers: Topichandlers = {
  productCreated: handleProductCreatedEvent,
  productUpdated: handleProductUpdatedEvent,
  productsDeleted: handleManyProductsDeletedEvent,
  productDeleted: handleProductDeletedEvent,

  categoryCreated: handleCategoryCreatedEvent,
  categoryUpdated: handleCategoryUpdatedEvent,
  categoriesDeleted: handleManyCategoriesDeletedEvent,
  categoryDeleted: handleCategoryDeletedEvent,

  brandCreated: handleBrandCreatedEvent,
  brandUpdated: handleBrandUpdatedEvent,
  brandsDeleted: handleManyBrandsDeletedEvent,
  brandDeleted: handleBrandDeletedEvent,

  userCreated: handleUserCreatedEvent,
  userUpdated: handleUserUpdatedEvent,
  usersDeleted: handleManyUsersDeletedEvent,
  userDeleted: handleUserDeletedEvent,
};

export default async function initConsumerHandlers(
  message: Message
): Promise<void> {
  const handler = topicHandlers[message.topic];

  if (!handler) {
    logger.error(`No handler found for topic: ${message.topic}`);
    return;
  }

  await handler(message);
}
