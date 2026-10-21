import { cookies } from "next/headers";
import api from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";
import type { FetchNotesResponse } from "./clientApi";

interface FetchNotesParams {
  page: number;
  perPage: number;
  searchText?: string;
  tag?: string;
}

export const fetchNotes = async ({
  page,
  perPage,
  searchText,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const cookieStore = await cookies();
  const response = await api.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      search: searchText,
      ...(tag && tag.toLowerCase() !== "all" ? { tag } : {}),
    },
    headers: { Cookie: cookieStore.toString() },
  });
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const response = await api.get<Note>("/notes/" + id, {
    headers: { Cookie: cookieStore.toString() },
  });
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const response = await api.get<User>("/users/me", {
    headers: { Cookie: cookieStore.toString() },
  });
  return response.data;
};

export const checkSession = async (cookieHeader?: string): Promise<boolean> => {
  const cookieHeaderValue = cookieHeader ?? (await cookies()).toString();
  const response = await api.get<{ success: boolean }>("/auth/session", {
    headers: { Cookie: cookieHeaderValue },
  });
  return response.data.success;
};
