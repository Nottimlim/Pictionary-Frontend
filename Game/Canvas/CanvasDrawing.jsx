import React, {
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
} from "react";

const CanvasDrawing = forwardRef(
  ({ strokeWidth, strokeColor, disabled, onImageUpdate }, ref) => {
    const canvasRef = useRef(null); // this is our canvas element
    const contextRef = useRef(null); // this is where we'll be drawing
    const [isDrawing, setIsDrawing] = useState(false); // are we currently drawing?
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

    // capture and send canvas data to parent component
    const updateImageData = () => {
      if (canvasRef.current && onImageUpdate) {
        try {
          const imageData = canvasRef.current.toDataURL("image/png");
          console.log('Canvas output:', {
            isBase64: imageData.startsWith('data:image/png;base64,'),
            length: imageData.length,
            preview: imageData.substring(0, 100)
          });
          onImageUpdate(imageData);
        } catch (error) {
          console.error("Error getting canvas data:", error);
        }
      }
    };

    // set up the canvas when the component loads
    const prepareCanvas = () => {
      const canvas = canvasRef.current;
      const container = canvas.parentElement;
      const rect = container.getBoundingClientRect();
      // Using container dimensions for display size
      const displayWidth = rect.width * 4;
      const displayHeight = rect.height * 4;

      // set canvas dimensions
      canvas.width = displayWidth;
      canvas.height = displayHeight;

      // scale canvas back down with CSS
      canvas.style.width = `100%`;
      canvas.style.height = `100%`;

      // set up drawing context
      const context = canvas.getContext("2d");
      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineWidth = strokeWidth;
      context.strokeStyle = strokeColor;

      // set white background
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, displayWidth, displayHeight);

      contextRef.current = context;
      setCanvasSize({ width: displayWidth, height: displayHeight });
    };

    // update the drawing context when color or brush size changes
    const updateDrawingContext = () => {
      if (!contextRef.current) return;
      contextRef.current.lineWidth = strokeWidth; // update the brush color
      contextRef.current.strokeStyle = strokeColor; // update the brush size
    };

    // start drawing when the mouse is pressed down
    const startDrawing = ({ nativeEvent }) => {
        if (disabled) return;
        const { offsetX, offsetY } = nativeEvent;
        const scaleX = canvasRef.current.width / canvasRef.current.offsetWidth;
        const scaleY = canvasRef.current.height / canvasRef.current.offsetHeight;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX * scaleX, offsetY * scaleY);
        setIsDrawing(true);
    };
    

    // draw lines as the mouse moves
    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = nativeEvent;
        const scaleX = canvasRef.current.width / canvasRef.current.offsetWidth;
        const scaleY = canvasRef.current.height / canvasRef.current.offsetHeight;
        contextRef.current.lineTo(offsetX * scaleX, offsetY * scaleY);
        contextRef.current.stroke();
    };

    // stop drawing when the mouse is released
    const stopDrawing = () => {
      if (!isDrawing) return; // if we're not drawing, do nothing
      contextRef.current.closePath(); // finish the current path
      setIsDrawing(false); // we're done drawing
    };

    // clear the canvas
    const clearCanvas = () => {
      const context = contextRef.current;
      if (!context) return;
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvasSize.width, canvasSize.height);
    };

    useImperativeHandle(ref, () => ({
      clearCanvas, // expose the clearCanvas function to the parent component
      getImageData: () => canvasRef.current?.toDataURL("image/png"), // function to get canvas data
    }));

    // handle window resize
    React.useEffect(() => {
      const handleResize = () => {
        prepareCanvas();
        updateImageData();
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    // run once when the component mounts to set up the canvas
    useEffect(() => {
      prepareCanvas();
    }, []);

    // update the drawing context whenever brush color or size changes
    useEffect(() => {
      updateDrawingContext();
    }, [strokeColor, strokeWidth]);

    return (
      <div className="w-full h-full overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="w-full h-full bg-white cursor-crosshair"
          style={{
            touchAction: "none",
          }}
        />
      </div>
    );
  }
);
CanvasDrawing.displayName = "CanvasDrawing";

export default CanvasDrawing;
