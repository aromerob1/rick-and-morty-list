import axios, { AxiosInstance } from 'axios';
import { ENV } from '../config/environments';

const apiClient: AxiosInstance = axios.create({
  baseURL: ENV.RICKMORTY_API_BASE_URL,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Fetch a character by ID from the external Rick and Morty API.
 * @param id - The ID of the character to fetch.
 * @returns The character data or null if not found.
 * @throws Error if an HTTP or network error occurs.
 */
export const fetchCharacterById = async (
  id: string | number
): Promise<any | null> => {
  const url = `/character/${id}`;
  console.log(`[API Client] GET ${apiClient.defaults.baseURL}${url}`);
  try {
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    if (
      axios.isAxiosError(error as any) &&
      (error as any).response?.status === 404
    ) {
      console.warn(`[API Client] Character ${id} not found.`);
      return null;
    }
    if (error instanceof Error) {
      console.error(
        `[API Client] Error fetching character ${id}:`,
        error.message
      );
    } else {
      console.error(`[API Client] Error fetching character ${id}:`, error);
    }
    throw error;
  }
};

/**
 * Fetch a list of characters from the external Rick and Morty API.
 * @param page - The page number to fetch (default is 1).
 * @returns The list of characters or null if not found.
 * @throws Error if an HTTP or network error occurs.
 */
export const fetchCharacters = async (
  page: number = 1
): Promise<any | null> => {
  const url = `/character`;
  console.log(
    `[API Client] GET ${apiClient.defaults.baseURL}${url}?page=${page}`
  );
  try {
    const response = await apiClient.get(url, { params: { page } });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        `[API Client] Error fetching characters page ${page}:`,
        error.message
      );
    } else {
      console.error(
        `[API Client] Error fetching characters page ${page}:`,
        error
      );
    }
    throw error;
  }
};
