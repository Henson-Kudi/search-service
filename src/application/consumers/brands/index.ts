import { Message } from 'node-rdkafka';
import { esClient } from '../../../infrastructure/data';
import { esIndexes } from '../../../domain/value-objects/constants';

export async function handleBrandCreatedEvent(event: Message): Promise<void> {
  const { value: data } = event;

  if (!data) {
    return;
  }

  await esClient.index({
    index: esIndexes.brands,
    body: JSON.parse(data.toString()),
  });
}

export async function handleBrandUpdatedEvent(event: Message): Promise<void> {
  const { value: data } = event;

  if (!data) {
    return;
  }

  await esClient.update({
    id: JSON.parse(data.toString()).id,
    index: esIndexes.brands,
    body: {
      doc: JSON.parse(data.toString()),
    },
  });
}

export async function handleBrandDeletedEvent(event: Message): Promise<void> {
  const { value: data } = event;

  if (!data) {
    return;
  }

  await esClient.delete({
    id: JSON.parse(data.toString()).id,
    index: esIndexes.brands,
  });
}

export async function handleManyBrandsDeletedEvent(
  event: Message
): Promise<void> {
  const { value: data } = event;

  if (!data) {
    return;
  }

  const operations = JSON.parse(data.toString())?.ids?.flatMap((id: string) => [
    { _index: esIndexes.brands, _id: id },
  ]);

  await esClient.bulk({ refresh: true, operations });
}
