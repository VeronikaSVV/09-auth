import api from "./api";
import type { NewNoteData, Note } from "@/types/note";
import type { User } from "@/types/user";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  page: number;
  perPage: number;
  searchText?: string;
  tag?: string;
}

interface Credentials {
  email: string;
  password: string;
}

export const fetchNotes = async ({
  page,
  perPage,
  searchText,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await api.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      search: searchText,
      ...(tag && tag.toLowerCase() !== "all" ? { tag } : {}),
    },
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const response = await api.get<Note>("/notes/" + id);
  return response.data;
};

export const createNote = async (data: NewNoteData): Promise<Note> => {
  const response = await api.post<Note>("/notes", data);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>("/notes/" + id);
  return response.data;
};

export const register = async (credentials: Credentials): Promise<User> => {
  const response = await api.post<User>("/auth/register", credentials);
  return response.data;
};

export const login = async (credentials: Credentials): Promise<User> => {
  const response = await api.post<User>("/auth/login", credentials);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const checkSession = async (): Promise<boolean> => {
  const response = await api.get<{ success: boolean }>("/auth/session");
  return response.data.success;
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<User>("/users/me");
  return response.data;
};

export const updateMe = async (
  updates: Pick<User, "username">,
): Promise<User> => {
  const response = await api.patch<User>("/users/me", updates);
  return response.data;
};
