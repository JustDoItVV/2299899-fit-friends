export enum NotificationTextLimit {
  Min = 10,
  Max = 140,
}

export const NOTIFICATIONS_LIMIT = 5;

export enum NotificationErrorMessage {
  NotFound = 'Notification not found',
  Forbidden = 'User does not own this notification',
}

export enum EmailSubject {
  NewTrainings = 'New trainings from subscriptions',
}

export enum EmailTemplate {
  NewTrainings = './new-trainings.hbs',
}
