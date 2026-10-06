import { Column } from 'primereact/column';
import { DataTable, type DataTablePageEvent } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import { useEffect } from 'react';
import { fetchPosts, setPage } from '../features/posts/postsSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { Post } from '../types';
import { fetchUsers } from '../features/users/usersSlice';

export default function PostsPage() {
  const dispatch = useAppDispatch();
  const { items, total, query, status } = useAppSelector((state) => state.posts);

  useEffect(() => {
    const request = dispatch(fetchPosts(query));
    return () => request.abort();
  }, [dispatch, query]);

  // Los usuarios se piden una sola vez al entrar
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
  // TODO: usa .find() para buscar en `users` el usuario cuyo id sea igual a post.userId
  const author = users.find((u) => u.id === post.userId);

  return author ? `${author.firstName} ${author.lastName}` : `Usuario #${post.userId}`;
};

  return (
    <section>
      <h1>Publicaciones</h1>
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
      </DataTable>
    </section>
  );
}