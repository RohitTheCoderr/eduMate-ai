"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function whiteboard() {
  const [userId, setUserId] = useState<string | null>(null);

  const canvasRef = useRef<any>(null);
  const [isEraser, setIsEraser] = useState(false);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(3);
  const [boards, setBoards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [shapeMode, setShapeMode] = useState<
    "pen" | "rect" | "circle" | "text"
  >("pen");

  // auth user fetch
  useEffect(() => {
    const fetchUserAndMessages = async () => {
      // Fetch the user session on mount
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
      }
    };
    fetchUserAndMessages();
  }, []);

  // fetch board after fetching userID
  useEffect(() => {
    fetchBoards();
  }, [userId]);

  // Initialize canvas one-time
  const originalWidth = 900;
  const originalHeight = 400;

  useEffect(() => {
    const initCanvas = async () => {
      const fabricModule = await import("fabric");
      const fabric = fabricModule.default || fabricModule;

      const canvas = new fabric.Canvas("whiteboard", {
        backgroundColor: "#ffffff",
        width: originalWidth,
        height: originalHeight,
        preserveObjectStacking: true,
      });

      canvas.isDrawingMode = true;
      canvasRef.current = canvas;
      updateBrush(canvas);
      // Initial scale
      const scaleCanvas = () => {
        const container = document.getElementById("canvas-wrapper");
        const containerWidth = container.offsetWidth;
        const scaleRatio = containerWidth / originalWidth;

        canvas.setWidth(originalWidth * scaleRatio);
        canvas.setHeight(originalHeight * scaleRatio);
        canvas.setZoom(scaleRatio);
        canvas.renderAll();
      };

      // Scale initially
      scaleCanvas();
      // Re-scale on window resize
      window.addEventListener("resize", scaleCanvas);
      return () => {
        window.removeEventListener("resize", scaleCanvas);
        canvas.dispose();
      };
    };

    initCanvas();
  }, []);

  // Update brush when settings change
  useEffect(() => {
    if (canvasRef.current && shapeMode === "pen") {
      updateBrush(canvasRef.current);
    } else if (canvasRef.current) {
      canvasRef.current.isDrawingMode = false;
    }
  }, [isEraser, brushColor, brushSize, shapeMode]);

  /**
   * Brush Update (Fabric v6: PencilBrush is direct class)
   */
  const updateBrush = async (canvas: any) => {
    const fabricModule = await import("fabric");
    const fabricObj = fabricModule.default || fabricModule;

    if (!fabricObj.PencilBrush) {
      console.error("❌ Fabric.PencilBrush not found!");
      return;
    }

    const brush = new fabricObj.PencilBrush(canvas);
    brush.color = isEraser ? "#ffffff" : brushColor;
    brush.width = brushSize;

    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush = brush;
  };

  // Add Shapes
  const addShape = async () => {
    if (!canvasRef.current) return;
    const fabricModule = await import("fabric");
    const fabricObj = fabricModule.default || fabricModule;

    if (shapeMode === "rect") {
      canvasRef.current.add(
        new fabricObj.Rect({
          left: 100,
          top: 100,
          fill: brushColor,
          width: 120,
          height: 70,
        })
      );
    } else if (shapeMode === "circle") {
      canvasRef.current.add(
        new fabricObj.Circle({
          left: 150,
          top: 150,
          radius: 50,
          fill: brushColor,
        })
      );
    } else if (shapeMode === "text") {
      canvasRef.current.add(
        new fabricObj.IText("Enter text", {
          left: 200,
          top: 200,
          fontSize: 20,
          fill: brushColor,
        })
      );
    }
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current?.clear();
      canvasRef.current.backgroundColor = "#fff";
      canvasRef.current.renderAll();
    }
  };

  const undo = () => {
    if (!canvasRef.current) return;
    const objs = canvasRef.current.getObjects();
    if (objs.length) {
      canvasRef.current.remove(objs[objs.length - 1]);
    }
  };

  // Save
  const handleSave = async () => {
    if (!canvasRef.current) return;
    if (canvasRef.current.getObjects().length <= 0) {
      alert("please use board before saving empty");
      return;
    }

    const canvasData = canvasRef.current.toJSON();
    const thumbnail = canvasRef.current.toDataURL({
      format: "png",
      quality: 0.5,
    });

    const title = prompt("Enter title for this board") || "Untitled";
    const { error } = await supabase
      .from("whiteboards")
      .insert([{ user_id: userId, title, data: canvasData, thumbnail }]);

    if (error) alert("❌ Error saving: " + error.message);
    else {
      alert("✅ Saved!");
      fetchBoards();
    }
  };

  // Fetch Boards
  const fetchBoards = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("whiteboards")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error) setBoards(data || []);
    setLoading(false);
  };

  const loadBoard = (board: any) => {
    canvasRef.current?.loadFromJSON(board.data, () => {
      canvasRef.current.renderAll();
    });
  };

  const deleteBoard = async (id: string) => {
    if (!confirm("Delete this board?")) return;
    await supabase.from("whiteboards").delete().eq("id", id);
    fetchBoards();
  };

  return (
    <div className="max-w-6xl mx-auto ">
      <h1 className="text-3xl font-bold text-center mb-6">
        📝 Whiteboard Notes
      </h1>

      {/* Canvas */}
      <div
        id="canvas-wrapper"
        className=" flex flex-col items-center w-full max-w-full"
      >
        <canvas
          id="whiteboard"
          className="border rounded-lg shadow-md w-full"
        ></canvas>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center mt-4">
        <button
          onClick={() => setShapeMode("pen")}
          className={` px-2 sm:px-4 py-[2px] sm:py-2 rounded ${
            shapeMode === "pen"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-slate-700"
          }`}
        >
          ✏️ Pen
        </button>
        <button
          onClick={() => setIsEraser((prev) => !prev)}
          disabled={shapeMode !== "pen"}
          className={` px-2 sm:px-4 py-[2px] sm:py-2 rounded ${
            isEraser
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-slate-700"
          }`}
        >
          🩹 Eraser
        </button>

        {/* Shapes */}
        <button
          onClick={() => setShapeMode("rect")}
          className={` px-2 sm:px-4 py-[2px] sm:py-2 rounded ${
            shapeMode === "rect"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-slate-700 "
          }`}
        >
          ▭ Rectangle
        </button>
        <button
          onClick={() => setShapeMode("circle")}
          className={` px-2 sm:px-4 py-[2px] sm:py-2 rounded ${
            shapeMode === "circle"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-slate-700"
          }`}
        >
          ⭕ Circle
        </button>
        <button
          onClick={() => setShapeMode("text")}
          className={` px-2 sm:px-4 py-[2px] sm:py-2 rounded ${
            shapeMode === "text"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 dark:bg-slate-700"
          }`}
        >
          🅣 Text
        </button>
        <button
          onClick={addShape}
          disabled={shapeMode === "pen"}
          className="bg-indigo-600 text-white  px-2 sm:px-4 py-[2px] sm:py-2 rounded"
        >
          ➕ Add Shape
        </button>
        {/* Actions */}
        <button
          onClick={undo}
          className="bg-yellow-500 text-white  px-2 sm:px-4 py-[2px] sm:py-2 rounded"
        >
          ↩️ Undo
        </button>
        <button
          onClick={clearCanvas}
          className="bg-red-500 text-white  px-2 sm:px-4 py-[2px] sm:py-2 rounded"
        >
          🧹 Clear
        </button>
        <button
          onClick={handleSave}
          className="bg-green-600 text-white  px-2 sm:px-4 py-[2px] sm:py-2 rounded hover:bg-green-700"
        >
          💾 Save
        </button>

        {/* Color & Size */}
        <input
          type="color"
          value={brushColor}
          onChange={(e) => setBrushColor(e.target.value)}
          className="w-10 h-10 cursor-pointer"
          disabled={isEraser}
        />
        <select
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="border rounded px-2 py-[2px] sm:p-2 bg-white dark:bg-slate-700"
        >
          {[2, 4, 6, 8, 10, 16, 20].map((size) => (
            <option key={size} value={size}>
              {size}px
            </option>
          ))}
        </select>
      </div>

      {/* Saved Boards */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">📂 My Saved Boards</h2>
        {loading ? (
          <p>Loading...</p>
        ) : boards.length === 0 ? (
          <p className="text-gray-600">No boards saved yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[20rem] overflow-scroll">
            {boards.map((board) => (
              <div
                key={board.id}
                className="p-4 bg-gray-100 dark:bg-slate-600 dark:text-white rounded-lg shadow hover:shadow-lg relative"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    loadBoard(board);
                  }}
                >
                  {board.thumbnail && (
                    <img
                      src={board.thumbnail}
                      alt={board.title}
                      className="w-full h-52 object-contain rounded border mb-2 bg-white"
                    />
                  )}

                  <h3 className="font-semibold ">{board.title}</h3>
                  <p className="text-xs ">
                    {new Date(board.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteBoard(board.id)}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
