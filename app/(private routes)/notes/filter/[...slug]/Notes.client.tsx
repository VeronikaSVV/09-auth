"use client";

import { useState } from "react";
import Link from "next/link";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import { fetchNotes } from "@/lib/api/clientApi";

import css from "./Notes.module.css";

interface NotesClientProps {
  tag: string;
}

function NotesClient({ tag }: NotesClientProps) {
  const [inputValue, setInputValue] = useState("");

  const [page, setPage] = useState(1);
  const perPage = 12;

  const handleSearch = useDebouncedCallback((text: string) => {
    setPage(1);
    setInputValue(text);
  }, 1000);

  const { data, isLoading } = useQuery({
    queryKey: ["notes", { search: inputValue, page, tag }],
    queryFn: () => fetchNotes({ page, perPage, searchText: inputValue, tag }),
    placeholderData: keepPreviousData,
  });

  const handlePageChange = (selectedPage: number) => {
    setPage(selectedPage);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={inputValue} onSearch={handleSearch} />

        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        )}

        <Link className={css.button} href="/notes/action/create">
          Create note +
        </Link>
      </header>

      {data && !isLoading && data.notes.length > 0 && (
        <NoteList notes={data.notes} />
      )}

    </div>
  );
}

export default NotesClient;
