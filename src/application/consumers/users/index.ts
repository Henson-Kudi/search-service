import { Message } from 'node-rdkafka';
import { esClient } from '../../../infrastructure/data';
import { esIndexes } from '../../../domain/value-objects/constants';

export async function handleUserCreatedEvent(event: Message): Promise<void> {
  const { value: data } = event;

  if (!data) {
    return;
  }

  await esClient.index({
    index: esIndexes.users,
    body: JSON.parse(data.toString()),
  });
}

export async function handleUserUpdatedEvent(event: Message): Promise<void> {
  const { value: data } = event;

  if (!data) {
    return;
  }

  await esClient.update({
    id: JSON.parse(data.toString()).id,
    index: esIndexes.users,
    body: {
      doc: JSON.parse(data.toString()),
    },
  });
}

export async function handleUserDeletedEvent(event: Message): Promise<void> {
  const { value: data } = event;

  if (!data) {
    return;
  }

  await esClient.delete({
    id: JSON.parse(data.toString()).id,
    index: esIndexes.users,
  });
}

export async function handleManyUsersDeletedEvent(
  event: Message
): Promise<void> {
  const { value: data } = event;

  if (!data) {
    return;
  }

  const operations = JSON.parse(data.toString())?.ids?.flatMap((id: string) => [
    { _index: esIndexes.users, _id: id },
  ]);

  await esClient.bulk({ refresh: true, operations });
}
