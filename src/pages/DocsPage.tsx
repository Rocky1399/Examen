import { Button } from 'primereact/button';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// pdf.js lee el PDF en un "worker" (otro hilo) para no congelar la página.
// Se configura en el mismo archivo donde se usa <Document>.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const PDF_URL = '/manual.pdf'; // archivo en la carpeta public/

export default function DocsPage() {
  const [numPages, setNumPages] = useState(0); // total de páginas (se sabe al cargar)
  const [page, setPage] = useState(1); // página actual

  return (
    <section>
      <h1>Ayuda</h1>

      <div className="flex align-items-center gap-2 mb-3">
        <Button
          icon="pi pi-chevron-left"
          outlined
          aria-label="Página anterior"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        />
        <span>
          Página {page} de {numPages || '–'}
        </span>
        <Button
          icon="pi pi-chevron-right"
          outlined
          aria-label="Página siguiente"
          disabled={page >= numPages}
          onClick={() => setPage(page + 1)}
        />
      </div>

      <Document
        file={PDF_URL}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading="Cargando PDF…"
        error="No se pudo cargar el PDF."
      >
        <Page pageNumber={page} />
      </Document>
    </section>
  );
}
