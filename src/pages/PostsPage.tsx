import { Column } from 'primereact/column';
import { DataTable, type DataTablePageEvent } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import { useEffect, useState } from 'react';
import { deletePost, fetchPosts, setPage, setSearch } from '../features/posts/postsSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { Post } from '../types';
import { fetchUsers } from '../features/users/usersSlice';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { showToast } from '../features/ui/uiSlice';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

export default function PostsPage() {
  const dispatch = useAppDispatch();
  const { items, total, query, status } = useAppSelector((state) => state.posts);
  const [searchText, setSearchText] = useState(query.search);
  const debouncedSearch = useDebouncedValue(searchText, 400);

useEffect(() => {
  if (debouncedSearch !== query.search) dispatch(setSearch(debouncedSearch));
}, [debouncedSearch, query.search, dispatch]);

  useEffect(() => {
    const request = dispatch(fetchPosts(query));
    return () => request.abort();
  }, [dispatch, query]);

useEffect(() => {
  void dispatch(fetchUsers());
}, [dispatch]);

  const onPage = (event: DataTablePageEvent) => {
    const page = Math.floor(event.first / event.rows) + 1;
    dispatch(setPage({ page, rows: event.rows }));
  };

  const tagsBody = (post: Post) => (
    <div className="flex flex-wrap gap-1">
      {post.tags.map((tag) => (
        <Tag key={tag} value={tag} />
      ))}
    </div>
  );

  const reactionsBody = (post: Post) => (
    <span>
      <i className="pi pi-thumbs-up" /> {post.reactions.likes}{' '}
      <i className="pi pi-thumbs-down" /> {post.reactions.dislikes}
    </span>
  );

  const users = useAppSelector((state) => state.users.items);

  const userBody = (post: Post) => {
  const author = users.find((u) => u.id === post.userId);

  return author ? `${author.firstName} ${author.lastName}` : `Usuario #${post.userId}`;
};

const confirmDelete = (post: Post) => {
  confirmDialog({
    header: 'Eliminar publicación',
    message: `¿Eliminar "${post.title}"? Esta acción no se puede deshacer.`,
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Eliminar',
    rejectLabel: 'Cancelar',
    acceptClassName: 'p-button-danger',
    defaultFocus: 'reject',             
    accept: async () => {
      try {
        await dispatch(deletePost(post)).unwrap();
        dispatch(showToast({ severity: 'success', summary: 'Publicación eliminada' }));
      } catch {

      }
    },
  });
};

const actionsBody = (post: Post) => (
  <Button
    icon="pi pi-trash"
    rounded
    text
    severity="danger"
    aria-label={`Eliminar ${post.title}`}
    onClick={() => confirmDelete(post)}
  />
);

  return (
    <section>
      <h1>Publicaciones</h1>
      <Toolbar
  className="mb-3"
  start={
    <IconField iconPosition="left">
      <InputIcon className="pi pi-search" />
      <InputText
        type="search"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Buscar por texto…"
        aria-label="Buscar publicaciones"
      />
    </IconField>
  }
/>
      <DataTable
        value={items}
        dataKey="id"
        lazy
        paginator
        first={(query.page - 1) * query.rows}
        rows={query.rows}
        totalRecords={total}
        onPage={onPage}
        rowsPerPageOptions={[5, 10, 20]}
        loading={status === 'loading'}
        emptyMessage="No hay publicaciones."
      >
        <Column field="id" header="ID" />
        <Column field="title" header="Título" />
        <Column header="Usuario" body={userBody} />
        <Column header="Tags" body={tagsBody} />
        <Column header="Reacciones" body={reactionsBody} />
        <Column header="Acciones" body={actionsBody} />
      </DataTable>
    </section>
  );
}