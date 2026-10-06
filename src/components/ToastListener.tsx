import { Toast } from 'primereact/toast';
import { useEffect, useRef } from 'react';
import { dismissToast } from '../features/ui/uiSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export function ToastListener() {
  const toasts = useAppSelector((state) => state.ui.toasts);
  const dispatch = useAppDispatch();
  const toastRef = useRef<Toast>(null);

  useEffect(() => {
    if (toasts.length === 0) return;
    toastRef.current?.show(
      toasts.map((t) => ({ severity: t.severity, summary: t.summary, detail: t.detail })),
    );
    toasts.forEach((t) => dispatch(dismissToast(t.id)));
  }, [toasts, dispatch]);

  return <Toast ref={toastRef} position="top-right" />;
}
