import {
  MessageKey,
  MessageHeader,
  NumberNullUndefined,
  SubscribeTopicList,
  Message,
} from 'node-rdkafka';

export type MessageHandler = (data: Message) => Promise<void>;
export type MessageSubscriptionParams = SubscribeTopicList;

export type PublishMessageParams = {
  topic: string;
  message: string;
  partition?: NumberNullUndefined;
  key?: MessageKey;
  headers?: MessageHeader[];
};
