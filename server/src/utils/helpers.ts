/**
 * Success response helper
 */
export function successResponse<T>(data: T, message?: string) {
  return {
    success: true,
    data,
    ...(message && { message }),
  };
}

/**
 * Error response helper
 */
export function errorResponse(message: string, statusCode: number) {
  return {
    success: false,
    error: {
      message,
      statusCode,
    },
  };
}
