"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import NoteList from "../../../../components/NoteList/NoteList";
import Modal from "../../../../components/Modal/Modal";
import NoteForm from "../../../../components/NoteForm/NoteForm";
import Pagination from "../../../../components/Pagination/Pagination";
import SearchBox from "../../../../components/SearchBox/SearchBox";
import { fetchNotes } from "@/lib/api";

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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => setIsModalOpen(false);

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

        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {data && !isLoading && data.notes.length > 0 && (
        <NoteList notes={data.notes} />
      )}

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onCancel={closeModal} />
        </Modal>
      )}
    </div>
  );
}

export default NotesClient;
