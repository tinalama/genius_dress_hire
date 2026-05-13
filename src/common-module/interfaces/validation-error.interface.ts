export interface ValidationErrorInterface {
  field: string;
  message: Array<string>;
}

export interface ValidationPayloadInterface {
  property: string;
  constraints: Record<string, string>;
}
