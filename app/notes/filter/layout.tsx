import css from "./LayoutNotes.module.css";
import { ReactNode } from "react";

interface NotesFilterLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
}

const NotesFilterLayout = ({ children, sidebar }: NotesFilterLayoutProps) => {
  return (
    <section>
      <section className={css.container}>
        <aside className={css.sidebar}>{sidebar}</aside>
        <div className={css.notesWrapper}>{children}</div>
      </section>
    </section>
  );
};

export default NotesFilterLayout;
