import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './GenresTable.module.scss';

interface SortableRowProps {
  id: string;
  children: React.ReactNode;
}

export default function SortableRow({ id, children }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes} className={isDragging ? styles.dragging : ''}>
      {children}
      <td className={`${styles.table__cell} ${styles.table__cell_actions}`}>
        <div
          className={styles.dragHandle}
          {...listeners}
          style={{ cursor: 'grab', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          ⋮⋮
        </div>
      </td>
    </tr>
  );
}
