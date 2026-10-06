import { Button } from 'primereact/button';
import { Chips } from 'primereact/chips';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { createPost, updatePost } from '../features/posts/postsSlice';
import { showToast } from '../features/ui/uiSlice';
import { fetchUsers, selectUserOptions } from '../features/users/usersSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import type { PostInput } from '../types';

interface FormValues {
  title: string;
  body: string;
  userId: number | null;
  tags: string[];
}

export default function PostFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== undefined;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const post = useAppSelector((state) => state.posts.items.find((p) => p.id === Number(id)));
  const userOptions = useAppSelector(selectUserOptions);
  const saving = useAppSelector((state) => state.posts.saving);

  useEffect(() => {
    void dispatch(fetchUsers());
  }, [dispatch]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: post
      ? { title: post.title, body: post.body, userId: post.userId, tags: post.tags }
      : { title: '', body: '', userId: null, tags: [] },
  });

  const onSubmit = async (values: FormValues) => {
    if (values.userId === null) return;
    const input: PostInput = {
      title: values.title.trim(),
      body: values.body.trim(),
      userId: values.userId,
      tags: values.tags,
    };
    try {
      if (isEdit && post) {
        await dispatch(updatePost({ id: post.id, changes: input })).unwrap();
        dispatch(showToast({ severity: 'success', summary: 'Publicación actualizada' }));
      } else {
        await dispatch(createPost(input)).unwrap();
        dispatch(showToast({ severity: 'success', summary: 'Publicación creada' }));
      }
      navigate('/posts');
    } catch {
    }
  };

  if (isEdit && !post) {
    return (
      <section>
        <p>No se encontró la publicación. Ábrela desde la tabla.</p>
        <Button label="Volver a la tabla" icon="pi pi-arrow-left" onClick={() => navigate('/posts')} />
      </section>
    );
  }

  return (
    <section style={{ maxWidth: '40rem' }}>
      <h1>{isEdit ? `Editar publicación #${id}` : 'Nueva publicación'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-column gap-3">
        <div className="flex flex-column gap-2">
          <label htmlFor="title">Título *</label>
          <Controller
            name="title"
            control={control}
            rules={{
              required: 'El título es obligatorio',
              minLength: { value: 5, message: 'Mínimo 5 caracteres' },
              maxLength: { value: 120, message: 'Máximo 120 caracteres' },
            }}
            render={({ field, fieldState }) => (
              <InputText
                id="title"
                {...field}
                aria-invalid={fieldState.invalid}
                className={fieldState.invalid ? 'p-invalid' : ''}
              />
            )}
          />
          {errors.title && <small className="p-error">{errors.title.message}</small>}
        </div>

        <div className="flex flex-column gap-2">
          <label htmlFor="body">Contenido *</label>
          <Controller
            name="body"
            control={control}
            rules={{
              required: 'El contenido es obligatorio',
              minLength: { value: 20, message: 'Mínimo 20 caracteres' },
            }}
            render={({ field, fieldState }) => (
              <InputTextarea
                id="body"
                {...field}
                rows={5}
                aria-invalid={fieldState.invalid}
                className={fieldState.invalid ? 'p-invalid' : ''}
              />
            )}
          />
          {errors.body && <small className="p-error">{errors.body.message}</small>}
        </div>

                <div className="flex flex-column gap-2">
          <label htmlFor="userId">Usuario *</label>
          <Controller
            name="userId"
            control={control}
            rules={{ validate: (value) => value !== null || 'Selecciona un usuario' }}
            render={({ field, fieldState }) => (
              <Dropdown
                inputId="userId"
                value={field.value}
                onChange={(e) => field.onChange(e.value ?? null)}
                onBlur={field.onBlur}
                options={userOptions}
                placeholder="Selecciona un usuario"
                filter
                className={fieldState.invalid ? 'p-invalid' : ''}
              />
            )}
          />
          {errors.userId && <small className="p-error">{errors.userId.message}</small>}
        </div>

        <div className="flex flex-column gap-2">
          <label htmlFor="tags">Tags *</label>
          <Controller
            name="tags"
            control={control}
            rules={{
              validate: (value) =>
                (value.length >= 1 && value.length <= 5) || 'Agrega entre 1 y 5 tags',
            }}
            render={({ field, fieldState }) => (
              <Chips
                inputId="tags"
                value={field.value}
                onChange={(e) => field.onChange(e.value ?? [])}
                onBlur={field.onBlur}
                separator=","
                className={fieldState.invalid ? 'p-invalid' : ''}
              />
            )}
          />
          <small>Escribe un tag y pulsa Enter o coma.</small>
          {errors.tags && <small className="p-error">{errors.tags.message}</small>}
        </div>

        <div className="flex gap-2 justify-content-end">
          <Button
            type="button"
            label="Cancelar"
            severity="secondary"
            outlined
            onClick={() => navigate('/posts')}
          />
          <Button
            type="submit"
            label={isEdit ? 'Guardar cambios' : 'Crear publicación'}
            icon="pi pi-check"
            loading={saving}
          />
        </div>
      </form>
    </section>
  );
}