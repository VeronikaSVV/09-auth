import axios from "axios";
import type { NewNoteData, Note } from "@/types/note";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const noteApi = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

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
  const res = await noteApi.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      search: searchText,
      ...(tag && tag !== "all" ? { tag } : {}),
    },
  });

  return res.data;
};

export const createNote = async (newNoteData: NewNoteData) => {
  const res = await noteApi.post<Note>("/notes", newNoteData);
  return res.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const res = await noteApi.delete<Note>(`/notes/${id}`);
  return res.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const res = await noteApi.get<Note>(`/notes/${id}`);
  return res.data;
};
