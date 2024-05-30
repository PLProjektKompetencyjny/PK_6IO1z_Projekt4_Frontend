export type ApiResponse<T> = {
  code: number;
  code_message: CodeMessage;
  data: T[];
}

export type CodeMessage = {
  code: string; // Most of the time it will be number in string
  message: string;
  type: string;
}