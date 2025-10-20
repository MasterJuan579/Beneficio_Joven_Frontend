import { useMemo, useState } from 'react';
import Papa from 'papaparse';
import { importBeneficiarios } from '../../../api/services/admin-api-requests/beneficiarios';



export default function ImportBeneficiariosModal({ isOpen, onClose, onImported }) {
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const required = ['primerNombre','apellidoPaterno','apellidoMaterno','curp','email','celular','fechaNacimiento'];

  const canImport = useMemo(() => rows.length > 0, [rows]);

  if (!isOpen) return null;

  const parseFile = () => {
    setErr('');
    setRows([]);
    setPreview(null);
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        const mapped = (res.data || []).map(r => ({
          primerNombre: (r.primerNombre || r.PrimerNombre || '').trim(),
          segundoNombre: (r.segundoNombre || r.SegundoNombre || '').trim(),
          apellidoPaterno: (r.apellidoPaterno || r.ApellidoPaterno || '').trim(),
          apellidoMaterno: (r.apellidoMaterno || r.ApellidoMaterno || '').trim(),
          curp: (r.curp || r.CURP || '').trim(),
          email: (r.email || r.Email || '').trim(),
          celular: (r.celular || r.Celular || '').trim(),
          fechaNacimiento: (r.fechaNacimiento || r.FechaNacimiento || '').trim(), // YYYY-MM-DD
          sexo: (r.sexo || r.Sexo || '').trim(),
          folio: (r.folio || r.Folio || '').trim()
        }));
        setRows(mapped.filter(x => Object.values(x).some(v => String(v || '').length > 0)));
      },
      error: (e) => setErr(e.message || 'No se pudo leer el archivo')
    });
  };

  const doPreview = async () => {
    if (!rows.length) return;
    setLoading(true);
    setErr('');
    const res = await importBeneficiarios({ rows, commit: false });
    setLoading(false);
    if (!res.success) { setErr(res.message || 'Error en preview'); return; }
    setPreview(res.preview || null);
  };

  const doImport = async () => {
    if (!rows.length) return;
    setLoading(true);
    setErr('');
    const res = await importBeneficiarios({ rows, commit: true });
    setLoading(false);
    if (!res.success) { setErr(res.message || 'Error al importar'); return; }
    onImported?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Importar Beneficiarios (CSV)</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Columnas requeridas: <b>{required.join(', ')}</b>.
              Acepta encabezados en minúsculas o Capitalizados.
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block"
            />
            <div className="flex gap-2 mt-3">
              <button onClick={parseFile} className="px-3 py-2 rounded-lg border">Leer archivo</button>
              <button onClick={doPreview} disabled={!canImport || loading} className="px-3 py-2 rounded-lg bg-amber-500 text-white disabled:opacity-50">
                {loading ? 'Procesando…' : 'Previsualizar'}
              </button>
            </div>
          </div>

          {rows.length > 0 && !preview && (
            <div className="rounded border bg-gray-50 p-3 text-sm">
              <b>{rows.length}</b> filas cargadas. Haz clic en <b>Previsualizar</b> para validar.
            </div>
          )}

          {preview && (
            <div className="rounded border p-3 bg-green-50">
              <div className="flex items-center justify-between">
                <div>
                  <p><b>Preview</b></p>
                  <p className="text-sm text-gray-700">
                    Total: {preview.total} &nbsp;|&nbsp; Inválidas: {preview.invalid}
                  </p>
                </div>
                <button onClick={doImport} disabled={loading || preview.invalid > 0}
                  className="px-3 py-2 rounded-lg bg-emerald-600 text-white disabled:opacity-50">
                  {loading ? 'Importando…' : 'Importar'}
                </button>
              </div>
              {Array.isArray(preview.errors) && preview.errors.length > 0 && (
                <div className="mt-3 text-sm text-amber-700">
                  <p className="font-medium">Errores:</p>
                  <ul className="list-disc ml-5">
                    {preview.errors.slice(0, 10).map((e, i) => (
                      <li key={i}>Fila #{(e.index ?? i) + 1}: {e.error}</li>
                    ))}
                    {preview.errors.length > 10 && <li>…y {preview.errors.length - 10} más</li>}
                  </ul>
                </div>
              )}
            </div>
          )}

          {err && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{err}</div>}
        </div> 
        

        <div className="p-4 border-t flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">Cerrar</button>
        </div>
      </div>
    </div>
  );
}
