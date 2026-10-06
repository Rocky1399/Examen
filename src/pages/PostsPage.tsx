import { Column } from 'primereact/column';
import { DataTable, type DataTablePageEvent } from 'primereact/datatable';
import { Tag } from 'primereact/tag';
import { useEffect } from 'react';
import { fetchPosts, setPage } from '../features/posts/postsSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { Post } from '../types';

export default function PostsPage() {
  const dispatch = useAppDispatch();
  const { items, total, query, status } = useAppSelector((state) => state.posts);

  useEffect(() => {
    const request = dispatch(fetchPosts(query));
    return () => request.abort();
  }, [dispatch, query]);

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
        <Column header="Tags" body={tagsBody} />
        <Column header="Reacciones" body={reactionsBody} />
      </DataTable>
    </section>
  );
}