type Shape =
  | { type: "rect"; x: number; y: number; width: number; height: number }
  | { type: "circle"; centerX: number; centerY: number; radius: number };

export function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
  existingShapes: Shape[],
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let clicked = false;
  let startX = 0;
  let startY = 0;

  // 🔌 WebSocket listener
  const handleMessage = (event: MessageEvent) => {
    const parsedData = JSON.parse(event.data);

    if (parsedData.type === "chat") {
      const parsedShape: Shape = JSON.parse(parsedData.message);
      existingShapes.push(parsedShape);
      clearCanvas(existingShapes, canvas, ctx);
    }
  };

  socket.addEventListener("message", handleMessage);

  clearCanvas(existingShapes, canvas, ctx);

  // 🖱️ Mouse handlers
  const handleMouseDown = (e: MouseEvent) => {
    clicked = true;
    startX = e.offsetX;
    startY = e.offsetY;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!clicked) return;

    const currentX = e.offsetX;
    const currentY = e.offsetY;

    clearCanvas(existingShapes, canvas, ctx);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, currentX - startX, currentY - startY);
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!clicked) return;
    clicked = false;

    const rect = canvas.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;

    const shape: Shape = {
      type: "rect",
      x: startX,
      y: startY,
      width: endX - startX,
      height: endY - startY,
    };

    existingShapes.push(shape);

    socket.send(
      JSON.stringify({
        type: "chat",
        roomId,
        message: JSON.stringify(shape),
      }),
    );

    clearCanvas(existingShapes, canvas, ctx);
  };

  // 🎯 Attach listeners
  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseup", handleMouseUp);

  // 🧹 Cleanup
  return () => {
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
    socket.removeEventListener("message", handleMessage);
  };
}

// 🎨 Render all shapes
function clearCanvas(
  shapes: Shape[],
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  shapes.forEach((shape) => {
    if (shape.type === "rect") {
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
  });
}
