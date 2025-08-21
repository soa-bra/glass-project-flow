// src/features/planning/services/storage/persistence.ts
import { useCanvasStore } from '../../store/canvas.store';

export async function saveBoardLocal(){
  const data = JSON.stringify(useCanvasStore.getState().scene);
  localStorage.setItem('soabra_board', data);
}
export async function loadBoardLocal(){
  const s = localStorage.getItem('soabra_board');
  if (s){ useCanvasStore.setState({ scene: JSON.parse(s) }); }
}
