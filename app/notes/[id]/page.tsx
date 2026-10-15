import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isAxiosError } from "axios";
import { fetchNoteById } from "@/lib/api";
import NoteDetailsClient from "./NoteDetails.client";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  let note;
  try {
    note = await fetchNoteById(id);
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) notFound();
    throw error;
  }

  const title = `${note.title} | NoteHub`;

  const description =
    note.content.slice(0, 160) || "Read your note in NoteHub.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub.com/notes/${id}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
    },
  };
}

interface NoteDetailsPageProps {
  params: Promise<{ id: string }>;
}
const Page = async ({ params }: NoteDetailsPageProps) => {
  const { id } = await params;
  const queryClient = new QueryClient();
  try {
    await queryClient.fetchQuery({
      queryKey: ["note", id],
      queryFn: () => fetchNoteById(id),
    });
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) notFound();
    throw error;
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
};

export default Page;
