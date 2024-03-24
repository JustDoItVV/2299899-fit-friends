export type FilesValidationRules = Record<string, {
  size?: number;
  formats?: Record<string, string>,
 }>
