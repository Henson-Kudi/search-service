import { Message } from 'node-rdkafka';
import { esClient } from '../../../infrastructure/data';
import { esIndexes } from '../../../domain/value-objects/constants';

export async function handleCategoryCreatedEvent(
  event: Message
): Promise<void> {
  const { value: data } = event;

  if (!data) {
    return;
  }

  await esClient.index({
    index: esIndexes.categories,
    body: JSON.parse(data.toString()),
  });
}

export async function handleCategoryUpdatedEvent(
  event: Message
): Promise<void> {
  const { value: data } = event;

  if (!data) {
    return;
  }

  await esClient.update({
    id: JSON.parse(data.toString()).id,
    index: esIndexes.categories,
    doc: JSON.parse(data.toString()),
  });
}

export async function handleCategoryDeletedEvent(
  event: Message
): Promise<void> {
  const { value: data } = event;

  if (!data) {
    return;
  }

  await esClient.delete({
    id: JSON.parse(data.toString()).id,
    index: esIndexes.categories,
  });
}

export async function handleManyCategoriesDeletedEvent(
  event: Message
): Promise<void> {
  const { value: data } = event;

  if (!data) {
    return;
  }

  const operations = JSON.parse(data.toString())?.ids?.flatMap((id: string) => [
    { _index: esIndexes.categories, _id: id },
  ]);

  await esClient.bulk({ refresh: true, operations });
}
