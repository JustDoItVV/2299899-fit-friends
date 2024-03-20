export interface MailNotification {
  id?: string;
  authorId: string;
  targetId: string;
  text: string;
  createdAt?: Date;
}
