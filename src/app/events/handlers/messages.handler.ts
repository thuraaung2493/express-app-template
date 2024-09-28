import AutoBind from '@decorators/autoBind.js';
import Logger from '@utils/logger.js';
import type { Server, Socket } from 'socket.io';

export interface SendMessage {
  msg: string;
  senderId: string;
  receiverId: string;
}

@AutoBind
export default class MessagesHandler {
  constructor(private io: Server, private socket: Socket) {}

  join(userId: number) {
    Logger.info(`The user joined ${userId}-room`);
    this.socket.join(`${userId}-room`);
  }

  async sendMessage(data: SendMessage) {
    const { msg, senderId, receiverId } = data;

    this.socket.to(`${receiverId}-room`).emit('messages:send-new', msg);
  }
}
