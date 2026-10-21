"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

import Modal from "@/components/Modal/Modal";
import { fetchNoteById } from "@/lib/api/clientApi";
import css from "@/app/(private routes)/notes/[id]/NoteDetails.module.css";

export default function NotePreviewClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  return (
    <Modal onClose={() => router.back()}>
      {isLoading && <p>Loading, please wait...</p>}
      {(isError || (!isLoading && !note)) && <p>Something went wrong.</p>}
      {note && (
        <main className={css.main}>
          <div className={css.container}>
            <div className={css.item}>
              <div className={css.header}>
                <h2>{note.title}</h2>
              </div>
              <p className={css.tag}>{note.tag}</p>
              <p className={css.content}>{note.content}</p>
              <p className={css.date}>Created: {note.createdAt}</p>
            </div>
          </div>
        </main>
      )}
    </Modal>
  );
}
