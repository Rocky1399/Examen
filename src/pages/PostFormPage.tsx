import { useParams } from 'react-router-dom';

export default function PostFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== undefined;

  return <h1>{isEdit ? `Editar publicación #${id}` : 'Nueva publicación'}</h1>;
}