interface BackendError {
    data?: {
      error?: string;
    };
    status?: number;
  }
  
  interface BackendSuccess{
    message?: string;
  }