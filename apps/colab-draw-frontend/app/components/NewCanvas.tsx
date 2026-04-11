"use client";

import { useEffect, useRef, useState } from "react";
import { WS_URL, HTTP_BACKEND } from "@/config";
import { axiosObj } from "@repo/common/fetch";
import { useDrawStore, Shape, Tool } from "../../store/useDrawStore";
import { Stage, Layer, Rect, Ellipse, Line } from "react-konva";
import { v4 as uuidv4 } from "uuid";
import { 
  MousePointer2, 
  Square, 
  Circle as CircleIcon, 
  Pencil, 
  Minus, 
  Eraser, 
  Undo2, 
  Hand
} from "lucide-react";

export default function NewCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [authToken, setAuthToken] = useState("");
  
  const { shapes, tool, camera, setTool, setCamera, setInitialShapes, addShape, deleteShape, undo } = useDrawStore();
  
  // Local state for the "draft" shape currently being drawn
  const [isDrawing, setIsDrawing] = useState(false);
  const [draftShape, setDraftShape] = useState<Shape | null>(null);

  // 1. Fetch shapes FIRST
  useEffect(() => {
    const fetchShapes = async () => {
      try {
        const authResp = await axiosObj.get(`${HTTP_BACKEND}/auth/me`, { withCredentials: true });
        if (authResp.data?.token) setAuthToken(authResp.data.token);

        const resp = await axiosObj.get(`${HTTP_BACKEND}/room/${roomId}/messages`, {
          withCredentials: true,
        });

        const messages = resp.data.data;
        const parsedShapes: Shape[] = [];

        // Reduce events (like Redux)
        messages.forEach((x: { id: number; message: string }) => {
          try {
            const data = JSON.parse(x.message);
            // Support backward compatibility (if no 'event' field, assume it's a raw shape)
            if (data.event === "delete" && data.shapeId) {
                // We actually want to reduce this by stripping it from parsedShapes, 
                // but since we are just hydrating, let's keep it simple: rebuild a map.
            } else if (data.event === "add" && data.shape) {
                parsedShapes.push(data.shape);
            } else {
                // Legacy support
                parsedShapes.push(data);
            }
          } catch(e) {}
        });

        // If there were deletes, we need a smarter hydration. 
        // For now, we will reset the store state.
        const shapesMap: Record<string, Shape> = {};
        messages.forEach((x: { id: number; message: string }) => {
          try {
            const data = JSON.parse(x.message);
            if (data.event === "add" && data.shape) {
               shapesMap[data.shape.id] = data.shape;
            } else if (data.event === "delete" && data.shapeId) {
               delete shapesMap[data.shapeId];
            } else if (!data.event) { // Legacy
               const fakeId = `legacy-${x.id}`;
               shapesMap[fakeId] = { ...data, id: fakeId } as Shape;
            }
          } catch(e) {}
        });

        setInitialShapes(Object.values(shapesMap));
        setIsLoaded(true);
      } catch (err) {
        console.error("Failed to fetch shapes:", err);
        setIsLoaded(true);
      }
    };

    fetchShapes();
  }, [roomId, setInitialShapes]);

  // 2. Connect WS AFTER shapes loaded
  useEffect(() => {
    if (!isLoaded || !authToken) return;

    const ws = new WebSocket(`${WS_URL}?token=${authToken}`);

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "join_room", roomId }));
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      if (parsedData.type === "chat") {
        try {
           const data = JSON.parse(parsedData.message);
           if (data.event === "add") {
             addShape(data.shape);
           } else if (data.event === "delete") {
             deleteShape(data.shapeId);
           } else {
             // Legacy
             addShape({ ...data, id: uuidv4() });
           }
        } catch(e){}
      }
    };

    return () => {
      ws.close();
    };
  }, [isLoaded, authToken, roomId, addShape, deleteShape]);

  // --- Handlers ---
  const getPointerPos = (e: any) => {
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    return {
      x: (pointer.x - camera.x) / camera.scale,
      y: (pointer.y - camera.y) / camera.scale,
    };
  };

  const handleMouseDown = (e: any) => {
    if (tool === "hand") return; // Hand tool dragging is handled natively by draggable Stage

    if (tool === "eraser") {
      const shapeId = e.target.id();
      if (shapeId) {
        deleteShape(shapeId);
        socket?.send(JSON.stringify({ type: "chat", roomId, message: JSON.stringify({ event: "delete", shapeId }) }));
      }
      return;
    }

    setIsDrawing(true);
    const pos = getPointerPos(e);
    const id = uuidv4();

    let newShape: Shape;
    if (tool === "pencil" || tool === "line") {
      newShape = { id, type: tool, x: 0, y: 0, points: [pos.x, pos.y], strokeColor: "white", strokeWidth: 2 };
    } else if (tool === "ellipse") {
      // Initialize mathematically identical to rect so bounding box rules apply
      newShape = { id, type: tool, x: pos.x, y: pos.y, width: 0, height: 0 };
    } else {
      // Default rect
      newShape = { id, type: "rect", x: pos.x, y: pos.y, width: 0, height: 0 };
    }
    
    setDraftShape(newShape);
  };

  const handleMouseMove = (e: any) => {
    if (tool === "hand") return;
    
    // Eraser dragging over shapes
    if (tool === "eraser" && e.evt.buttons === 1) { // 1 is left click held
       const shapeId = e.target.id();
       if (shapeId && shapeId !== "bg-rect") { // ignore background
         deleteShape(shapeId);
         socket?.send(JSON.stringify({ type: "chat", roomId, message: JSON.stringify({ event: "delete", shapeId }) }));
       }
       return;
    }

    if (!isDrawing || !draftShape) return;

    const pos = getPointerPos(e);

    if (draftShape.type === "pencil") {
      setDraftShape({
        ...draftShape,
        points: [...(draftShape.points || []), pos.x, pos.y]
      });
    } else if (draftShape.type === "line") {
      const startX = draftShape.points![0];
      const startY = draftShape.points![1];
      setDraftShape({ ...draftShape, points: [startX, startY, pos.x, pos.y] });
    } else if (draftShape.type === "ellipse" || draftShape.type === "rect") {
      setDraftShape({
        ...draftShape,
        width: pos.x - draftShape.x,
        height: pos.y - draftShape.y
      });
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing || !draftShape || tool === "hand" || tool === "eraser") {
      setIsDrawing(false);
      return;
    }

    // Commit shape
    addShape(draftShape);
    socket?.send(JSON.stringify({ type: "chat", roomId, message: JSON.stringify({ event: "add", shape: draftShape }) }));
    
    setIsDrawing(false);
    setDraftShape(null);
  };

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    const scale =  Math.max(0.1, Math.min(newScale, 10));

    setCamera({
      x: pointer.x - mousePointTo.x * scale,
      y: pointer.y - mousePointTo.y * scale,
      scale
    });
  };

  const handleDragEnd = (e: any) => {
    // Only care about the stage being dragged, not individual shapes
    if (e.target === e.target.getStage()) {
      setCamera({
        x: e.target.x(),
        y: e.target.y(),
        scale: camera.scale
      });
    }
  };

  if (!isLoaded || !socket) return <div className="flex h-screen items-center justify-center text-white">Loading...</div>;

  const shapesArray = Object.values(shapes);

  const drawShape = (shape: Shape, isDraft = false) => {
    const props = {
      id: shape.id,
      stroke: shape.strokeColor || "white",
      strokeWidth: shape.strokeWidth || 2,
      opacity: isDraft ? 0.6 : 1,
      hitStrokeWidth: 10 // easier to hover/erase
    };

    switch (shape.type) {
      case "rect":
        return <Rect key={shape.id} x={shape.x} y={shape.y} width={shape.width} height={shape.height} {...props} />;
      case "ellipse":
        return (
          <Ellipse 
            key={shape.id} 
            x={shape.x + (shape.width || 0) / 2} 
            y={shape.y + (shape.height || 0) / 2} 
            radiusX={Math.abs(shape.width || 0) / 2} 
            radiusY={Math.abs(shape.height || 0) / 2} 
            {...props} 
          />
        );
      case "pencil":
      case "line":
        return <Line key={shape.id} points={shape.points || []} {...props} lineCap="round" lineJoin="round" />;
      default:
        return null;
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-zinc-950">
      
      {/* TOOLBAR */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex gap-2 p-2 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl">
        <ToolButton active={tool === "hand"} onClick={() => setTool("hand")} icon={<Hand size={20} />} />
        <ToolButton active={tool === "pencil"} onClick={() => setTool("pencil")} icon={<Pencil size={20} />} />
        <ToolButton active={tool === "line"} onClick={() => setTool("line")} icon={<Minus size={20} />} />
        <ToolButton active={tool === "rect"} onClick={() => setTool("rect")} icon={<Square size={20} />} />
        <ToolButton active={tool === "ellipse"} onClick={() => setTool("ellipse")} icon={<CircleIcon size={20} />} />
        <ToolButton active={tool === "eraser"} onClick={() => setTool("eraser")} icon={<Eraser size={20} />} />
        
        <div className="w-[1px] h-8 bg-zinc-700 mx-1" />
        
        <button onClick={undo} className="p-2 rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
          <Undo2 size={20} />
        </button>
      </div>

      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDragEnd={handleDragEnd}
        draggable={tool === "hand"}
        x={camera.x}
        y={camera.y}
        scaleX={camera.scale}
        scaleY={camera.scale}
        style={{ cursor: tool === "hand" ? "grab" : tool === "eraser" ? "cell" : "crosshair" }}
      >
        <Layer>
            {/* Background Rect to catch events when clicking empty space */}
            <Rect 
              id="bg-rect"
              x={-window.innerWidth * 10} 
              y={-window.innerHeight * 10} 
              width={window.innerWidth * 20} 
              height={window.innerHeight * 20} 
              fill="transparent" 
            />
            {shapesArray.map((shape) => drawShape(shape))}
            {draftShape && drawShape(draftShape, true)}
        </Layer>
      </Stage>
    </div>
  );
}

const ToolButton = ({ active, onClick, icon }: { active: boolean; onClick: () => void; icon: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-md transition-colors ${
      active ? "bg-blue-600 text-white" : "hover:bg-zinc-800 text-zinc-400 hover:text-white"
    }`}
  >
    {icon}
  </button>
);
