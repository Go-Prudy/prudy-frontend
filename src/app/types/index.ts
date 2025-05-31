export interface ApiResponse<T> {
  success: boolean;
  message: string;
  code: number;
  returnStatus: string;
  data: T;
}

export interface ErrorResponse {
  code: number;
  // data: null;
  message: string;
  returnStatus: string;
  success: boolean;
}

export type DateValuePiece = Date | null;

export type DateValue = DateValuePiece | [DateValuePiece, DateValuePiece];
