import axios from 'axios';

interface ErrorResponse {
  message?: string;
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    if (error.response?.status === 401) {
      return 'Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.';
    }

    if (error.response?.status === 403) {
      return 'Du darfst auf diesen Eintrag nicht zugreifen.';
    }

    return (
      error.response?.data?.message ??
      error.message ??
      'Der Server konnte nicht erreicht werden.'
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Ein unbekannter Fehler ist aufgetreten.';
}