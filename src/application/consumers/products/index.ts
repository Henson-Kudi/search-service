import { Message } from 'node-rdkafka';
import { esClient } from '../../../infrastructure/data';
import { esIndexes } from '../../../domain/value-objects/constants';
import { ProductIndex } from '../../../domain/dtos';

export async function handleProductCreatedEvent(event: Message): Promise<void> {
  const { value: data } = event;

  if (!data) {
    return;
  }

  await esClient.index({
    index: esIndexes.products,
    body: JSON.parse(data.toString()),
  });
}

export async function handleProductUpdatedEvent(event: Message): Promise<void> {
  const { value: data } = event;

  if (!data) {
    return;
  }

  await esClient.update<ProductIndex>({
    id: JSON.parse(data.toString()).id,
    index: esIndexes.products,
    body: {
      doc: JSON.parse(data.toString()),
    },
  });
}

export async function handleProductDeletedEvent(event: Message): Promise<void> {
  const { value: data } = event;

  if (!data) {
    return;
  }

  await esClient.delete({
    id: JSON.parse(data.toString()).id,
    index: esIndexes.products,
  });
}

export async function handleManyProductsDeletedEvent(
  event: Message
): Promise<void> {
  const { value: data } = event;

  if (!data) {
    return;
  }

  const operations = JSON.parse(data.toString())?.ids?.flatMap((id: string) => [
    { _index: esIndexes.products, _id: id },
  ]);

  await esClient.bulk({ refresh: true, operations });
}
