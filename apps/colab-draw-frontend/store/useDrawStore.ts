import { create } from "zustand";

export type Shape = {
  id: string;
  type: "rect" | "ellipse" | "pencil" | "line";
  x: number;
  y: number;
  width?: number;   // For rect
  height?: number;  // For rect
  radiusX?: number; // For ellipse
  radiusY?: number; // For ellipse
  points?: number[]; // For pencil / line
  strokeColor?: string;
  strokeWidth?: number;
};

export type Tool = "rect" | "ellipse" | "pencil" | "line" | "eraser" | "hand";

type DrawState = {
  shapes: Record<string, Shape>;
  history: Record<string, Shape>[];
  tool: Tool;
  camera: { x: number; y: number; scale: number };
  
  // Actions
  setTool: (tool: Tool) => void;
  setCamera: (camera: { x: number; y: number; scale: number }) => void;
  
  // Shape Actions
  setInitialShapes: (shapes: Shape[]) => void;
  addShape: (shape: Shape) => void;
  deleteShape: (id: string) => void;
  
  // Undo
  undo: () => void;
};

export const useDrawStore = create<DrawState>((set, get) => ({
  shapes: {},
  history: [],
  tool: "pencil",
  camera: { x: 0, y: 0, scale: 1 },

  setTool: (tool) => set({ tool }),
  setCamera: (camera) => set({ camera }),

  setInitialShapes: (shapesArray) => {
    const shapesMap: Record<string, Shape> = {};
    shapesArray.forEach((s) => {
      if (s.id) {
        shapesMap[s.id] = s;
      } else {
        // Fallback for old database rows without IDs
        const fakeId = Math.random().toString(36).substring(7);
        shapesMap[fakeId] = { ...s, id: fakeId }; 
      }
    });
    set({ shapes: shapesMap, history: [] });
  },

  addShape: (shape) => 
    set((state) => {
      const newShapes = { ...state.shapes, [shape.id]: shape };
      return {
        shapes: newShapes,
        history: [...state.history, state.shapes], // Push previous state to history
      };
    }),

  deleteShape: (id) =>
    set((state) => {
      if (!state.shapes[id]) return state; // Do nothing if it doesn't exist
      const { [id]: _, ...newShapes } = state.shapes;
      return {
        shapes: newShapes,
        history: [...state.history, state.shapes],
      };
    }),

  undo: () =>
    set((state) => {
      if (state.history.length === 0) return state;
      const previousShapes = state.history[state.history.length - 1];
      const newHistory = state.history.slice(0, state.history.length - 1);
      return {
        shapes: previousShapes,
        history: newHistory,
      };
    }),
}));
