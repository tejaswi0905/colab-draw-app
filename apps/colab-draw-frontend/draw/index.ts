import { HTTP_BACKEND } from "@/config";
import { axiosObj } from "@repo/common/fetch";

type Shape =
  | { type: "rect"; x: number; y: number; width: number; height: number }
  | { type: "circle"; centerX: number; centerY: number; radius: number };

export async function initDraw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
) {
  const ctx = canvas.getContext("2d");

  // const existingShapes: Shape[] = await getExistingShapes(roomId);
  const existingShapes: Shape[] = [];
  let clicked = false;
  let startX = 0;
  let startY = 0;

  if (!ctx) return;
  socket.onmessage = (event) => {
    const parsedData = JSON.parse(event.data);
    if (parsedData.type === "chat") {
      const parsedShape = JSON.parse(parsedData.message);
      existingShapes.push(parsedShape);
      clearCanvas(existingShapes, canvas, ctx);
    }
  };

  clearCanvas(existingShapes, canvas, ctx);

  const handleMouseDown = (e: MouseEvent) => {
    clicked = true;
    startX = e.offsetX; // Local canvas coordinates
    startY = e.offsetY;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!clicked) return;

    const currentX = e.offsetX;
    const currentY = e.offsetY;
    const width = currentX - startX;
    const height = currentY - startY;

    clearCanvas(existingShapes, canvas, ctx);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, width, height);
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!clicked) return;
    clicked = false;

    // To get correct offset on the window-level event,
    // we calculate relative to the canvas bounding box
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
        message: JSON.stringify({
          shape,
        }),
      }),
    );

    clearCanvas(existingShapes, canvas, ctx);
  };

  // Attach listeners
  canvas.addEventListener("mousedown", handleMouseDown);
  canvas.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseup", handleMouseUp); // Window prevents "sticky" mouse

  // // Return a cleanup function to be used by React
  // return () => {
  //   canvas.removeEventListener("mousedown", handleMouseDown);
  //   canvas.removeEventListener("mousemove", handleMouseMove);
  //   window.removeEventListener("mouseup", handleMouseUp);
  // };
}

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
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
  });
}

async function getExistingShapes(roomId: string) {
  const resp = await axiosObj.get(`${HTTP_BACKEND}/chats/${roomId}`);
  const data = resp.data;
  const messages = data.messages;

  const shapes = messages.map((x: { message: string }) => {
    const messageData = JSON.parse(x.message);
    return messageData;
  });

  return shapes;
}
