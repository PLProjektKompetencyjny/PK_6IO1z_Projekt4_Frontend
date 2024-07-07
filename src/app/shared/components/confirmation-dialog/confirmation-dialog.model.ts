
export type Button = {
  text: string;
  type: ButtonType;
}

export enum ButtonType {
  PRIMARY = 0,
  SECONDARY,
  SUCCESS,
  INFO,
  DANGER,
}

export const buttonTypeClassNames: Map<ButtonType, string> = new Map([
  [ButtonType.PRIMARY, 'btn-primary'],
  [ButtonType.SECONDARY, 'btn-secondary'],
  [ButtonType.SUCCESS, 'btn-success'],
  [ButtonType.INFO, 'btn-info'],
  [ButtonType.DANGER, 'btn-danger'],
]);
