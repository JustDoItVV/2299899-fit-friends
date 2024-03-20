export enum NotificationTextLimit {
  Min = 10,
  Max = 140,
}

export const NOTIFICATIONS_LIMIT = 5;

export enum NotificationErrorMessage {
  NotFound = 'Notification not found',
  Forbidden = 'User does not own this notification',
}
