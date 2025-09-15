import React from 'react';
import { Download } from 'lucide-react';
import * as Types from '../../types';
import styles from './TaskDownloadButtons.module.css';

interface TaskDownloadButtonsProps {
  tasks: Types.Task[];
}

const TaskDownloadButtons: React.FC<TaskDownloadButtonsProps> = ({ tasks }) => {
  const convertToCsv = (data: Types.Task[]): string => {
    if (data.length === 0) return '';

    const headers = ['ID', 'Título', 'Descripción', 'Completada', 'Prioridad', 'Fecha de Vencimiento', 'Categoría', 'Etiquetas', 'Creado En', 'Actualizado En'];
    const rows = data.map(task => [
      task.id,
      `"${task.titulo.replace(/"/g, '""')}"`,
      `"${(task.descripcion || '').replace(/"/g, '""')}"`,
      task.completada ? 'Sí' : 'No',
      Types.Priority[task.prioridad],
      task.fecha_vencimiento ? new Date(task.fecha_vencimiento).toLocaleDateString() : '',
      task.categoria?.nombre || '',
      task.etiquetas?.map(tag => tag.nombre).join('; ') || '',
      new Date(task.creado_en).toLocaleDateString(),
      new Date(task.actualizado_en).toLocaleDateString(),
    ].join(','));

    return [headers.join(','), ...rows].join('\n');
  };

  const downloadFile = (data: string, filename: string, type: string) => {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadCsv = () => {
    const csv = convertToCsv(tasks);
    downloadFile(csv, 'tareas.csv', 'text/csv;charset=utf-8;');
  };

  const handleDownloadJson = () => {
    const json = JSON.stringify(tasks, null, 2);
    downloadFile(json, 'tareas.json', 'application/json');
  };

  return (
    <div className={styles.downloadButtons}>
      <button onClick={handleDownloadCsv} disabled={tasks.length === 0}>
        <Download size={16} /> Descargar CSV
      </button>
      <button onClick={handleDownloadJson} disabled={tasks.length === 0}>
        <Download size={16} /> Descargar JSON
      </button>
    </div>
  );
};

export default TaskDownloadButtons;
