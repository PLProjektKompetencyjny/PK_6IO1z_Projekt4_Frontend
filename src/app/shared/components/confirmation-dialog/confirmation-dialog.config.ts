import { Button, ButtonType, buttonTypeClassNames } from "./confirmation-dialog.model";

export const defaultTitle: string = 'Confirm';
export const defaultMessage: string = 'Please, confirm the operation in order to proceed';
export const defaultButtonOk: Button = {
  text: 'OK',
  type: ButtonType.PRIMARY,
};
export const defaultButtonCancel: Button = {
  text: 'Cancel',
  type: ButtonType.SECONDARY,
};

export const getButtonTypeClassName = (buttonType: ButtonType): string => {
  return `btn ${buttonTypeClassNames.get(buttonType) ?? 'btn-primary'}`;
}