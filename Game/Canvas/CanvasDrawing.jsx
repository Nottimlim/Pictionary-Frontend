import React, {
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useCallback,
} from "react";

const CanvasDrawing = forwardRef(
  ({ strokeWidth, strokeColor, disabled, onImageUpdate }, ref) => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    const normalizeCanvas = useCallback(() => {
      if (!canvasRef.current) return null;

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = 224;
      tempCanvas.height = 224;
      const tempCtx = tempCanvas.getContext("2d");

      tempCtx.fillStyle = "#FFFFFF";
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      tempCtx.drawImage(
        canvasRef.current,
        0,
        0,
        tempCanvas.width,
        tempCanvas.height
      );

      return tempCanvas;
    }, []);

    const updateImageData = useCallback(() => {
      if (!canvasRef.current || !onImageUpdate) return;

      try {
        const normalizedCanvas = normalizeCanvas();
        if (!normalizedCanvas) return;

        const imageData = normalizedCanvas.toDataURL("image/png");
        console.log(imageData)
        // console.log("Canvas output:", {
        //   isBase64: imageData.startsWith("data:image/png;base64,"),
        //   length: imageData.length,
        //   preview: imageData.substring(0, 100),
        //   dimensions: {
        //     original: {
        //       width: canvasRef.current.width,
        //       height: canvasRef.current.height,
        //     },
        //     normalized: {
        //       width: normalizedCanvas.width,
        //       height: normalizedCanvas.height,
        //     },
        //   },
        // });
        onImageUpdate(imageData);
      } catch (error) {
        console.error("Error getting canvas data:", error);
      }
    }, [normalizeCanvas, onImageUpdate]);

    const prepareCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const container = canvas.parentElement;
      const rect = container.getBoundingClientRect();

      const displayWidth = rect.width * 4;
      const displayHeight = rect.height * 4;

      canvas.width = displayWidth;
      canvas.height = displayHeight;
      canvas.style.width = `100%`;
      canvas.style.height = `100%`;

      const context = canvas.getContext("2d", { willReadFrequently: true });
      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineWidth = strokeWidth;
      context.strokeStyle = strokeColor;

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, displayWidth, displayHeight);

      contextRef.current = context;
      setCanvasSize({ width: displayWidth, height: displayHeight });
    }, [strokeWidth, strokeColor]);

    const updateDrawingContext = useCallback(() => {
      if (!contextRef.current) return;
      contextRef.current.lineWidth = strokeWidth;
      contextRef.current.strokeStyle = strokeColor;
    }, [strokeWidth, strokeColor]);

    const getCoordinates = useCallback((event) => {
      if (!canvasRef.current) return { x: 0, y: 0 };

      const rect = canvasRef.current.getBoundingClientRect();
      const scaleX = canvasRef.current.width / rect.width;
      const scaleY = canvasRef.current.height / rect.height;

      if (event.touches && event.touches[0]) {
        const touch = event.touches[0];
        return {
          x: (touch.clientX - rect.left) * scaleX,
          y: (touch.clientY - rect.top) * scaleY,
        };
      }

      return {
        x: event.offsetX * scaleX,
        y: event.offsetY * scaleY,
      };
    }, []);

    const startDrawing = useCallback(
      (event) => {
        if (disabled) return;
        const coords = getCoordinates(event);
        contextRef.current?.beginPath();
        contextRef.current?.moveTo(coords.x, coords.y);
        setIsDrawing(true);
      },
      [disabled, getCoordinates]
    );

    const draw = useCallback(
      (event) => {
        if (!isDrawing || !contextRef.current) return;
        const coords = getCoordinates(event);
        contextRef.current.lineTo(coords.x, coords.y);
        contextRef.current.stroke();
      },
      [isDrawing, getCoordinates]
    );

    const stopDrawing = useCallback(() => {
      if (!isDrawing || !contextRef.current) return;
      contextRef.current.closePath();
      setIsDrawing(false);
      updateImageData();
    }, [isDrawing, updateImageData]);

    const clearCanvas = useCallback(() => {
      if (!contextRef.current) return;
      contextRef.current.fillStyle = "#ffffff";
      contextRef.current.fillRect(0, 0, canvasSize.width, canvasSize.height);
      updateImageData();
    }, [canvasSize.width, canvasSize.height, updateImageData]);

    useImperativeHandle(
      ref,
      () => ({
        clearCanvas,
        getImageData: () => {
          const normalizedCanvas = normalizeCanvas();
          return normalizedCanvas?.toDataURL("image/png");
        },
      }),
      [clearCanvas, normalizeCanvas]
    );

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const preventScroll = (e) => {
        e.preventDefault();
      };

      const options = { passive: false };

      canvas.addEventListener("touchstart", preventScroll, options);
      canvas.addEventListener("touchmove", preventScroll, options);
      canvas.addEventListener("touchend", preventScroll, options);

      return () => {
        canvas.removeEventListener("touchstart", preventScroll);
        canvas.removeEventListener("touchmove", preventScroll);
        canvas.removeEventListener("touchend", preventScroll);
      };
    }, []);

    useEffect(() => {
      const handleResize = () => {
        prepareCanvas();
        updateImageData();
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, [prepareCanvas, updateImageData]);

    useEffect(() => {
      prepareCanvas();
    }, [prepareCanvas]);

    useEffect(() => {
      updateDrawingContext();
    }, [updateDrawingContext]);

    return (
      <div className="w-full h-full overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full bg-white cursor-crosshair"
          style={{
            touchAction: "none",
            WebkitTouchCallout: "none",
            WebkitUserSelect: "none",
            KhtmlUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
            userSelect: "none",
          }}
        />
      </div>
    );
  }
);

CanvasDrawing.displayName = "CanvasDrawing";

export default CanvasDrawing;
