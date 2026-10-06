import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

const PDF_URL = '/manual.pdf';

export default function DocsPage() {
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [scale, setScale] = useState(1); // zoom: 1 = 100 %
  const zoomIn = () => setScale(Math.min(3, scale + 0.25)); // máximo 300 %
  const zoomOut = () => setScale(Math.max(0.5, scale - 0.25)); // mínimo 50 %
  const [pageInput, setPageInput] = useState('1'); // lo que el usuario escribe (texto)
  const goToPage = (target: number) => {
    const next = Math.min(Math.max(1, target), numPages);
    setPage(next);
    setPageInput(String(next));
  };
  const commitPageInput = () => {
    const value = Number(pageInput);
    if (Number.isInteger(value)) goToPage(value);
    else setPageInput(String(page));
  };

  return (
    <section>
      <h1>Ayuda</h1>

      <div className="flex align-items-center gap-2 mb-3">
        <Button
          icon="pi pi-chevron-left"
          outlined
          aria-label="Página anterior"
          disabled={page <= 1}
          onClick={() => goToPage(page - 1)}
        />
        <InputText
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && commitPageInput()}
          onBlur={commitPageInput}
          aria-label="Número de página"
          style={{ width: '4rem', textAlign: 'center' }}
        />
        <span>de {numPages || '–'}</span>
        <Button
          icon="pi pi-chevron-right"
          outlined
          aria-label="Página siguiente"
          disabled={page >= numPages}
          onClick={() => goToPage(page + 1)}
        />
        <Button
          icon="pi pi-search-minus"
          outlined
          aria-label="Alejar"
          disabled={scale <= 0.5}
          onClick={zoomOut}
        />
        <span>{Math.round(scale * 100)}%</span>
        <Button
          icon="pi pi-search-plus"
          outlined
          aria-label="Acercar"
          disabled={scale >= 3}
          onClick={zoomIn}
        />
      </div>
      <div style={{ overflow: 'auto' }}>
        <Document
          file={PDF_URL}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading="Cargando PDF…"
          error="No se pudo cargar el PDF."
        >
          <Page pageNumber={page} scale={scale} />
        </Document>
      </div>
    </section>
  );
}
