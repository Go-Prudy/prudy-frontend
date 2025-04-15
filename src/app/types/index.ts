export interface ApiResponse<T> {
  success: boolean;
  message: string;
  code: number;
  returnStatus: string;
  data: T;
}
