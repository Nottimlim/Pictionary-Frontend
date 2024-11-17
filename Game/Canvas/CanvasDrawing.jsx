import React, {
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect
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
                const imageData = canvasRef.current.toDataURL('image/png');
                onImageUpdate(imageData);
              } catch (error) {
                console.error('Error getting canvas data:', error);
              }
            }
          };
      
    // set up the canvas when the component loads
    const prepareCanvas = () => {
      const canvas = canvasRef.current;
      const container = canvas.parentElement;

      const rect = container.getBoundingClientRect();

      const width = rect.width * 2.05;
      const height = rect.height * 2.05;

      // update state for resize handling
      setCanvasSize({ width, height });

      // set canvas dimensions with device pixel ratio
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;

      // scale canvas back down with CSS
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      // set up drawing context
      const context = canvas.getContext("2d");
      context.scale(dpr, dpr);
      context.lineCap = "round";
      context.lineJoin = "round";
      context.lineWidth = strokeWidth;
      context.strokeStyle = strokeColor;

      // set white background
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, width, height);

      contextRef.current = context;
    };

    // update the drawing context when color or brush size changes
    const updateDrawingContext = () => {
        if (!contextRef.current) return;
        contextRef.current.lineWidth = strokeWidth; // update the brush color
        contextRef.current.strokeStyle = strokeColor; // update the brush size
    };

    // start drawing when the mouse is pressed down
    const startDrawing = ({ nativeEvent }) => {
      if (disabled) return; // don't draw if the game is over
      const { offsetX, offsetY } = nativeEvent; // get the mouse position on the canvas
      contextRef.current.beginPath(); // start a new path for drawing
      contextRef.current.moveTo(offsetX, offsetY); // move to the starting point
      setIsDrawing(true); // we're drawing now
    };

    // draw lines as the mouse moves
    const draw = ({ nativeEvent }) => {
      if (!isDrawing) return; // if we're not drawing, do nothing

      const { offsetX, offsetY } = nativeEvent; // get mouse position
      contextRef.current.lineTo(offsetX, offsetY); // draw a line to this point
      contextRef.current.stroke(); // actually draw the line
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
      if(!context) return;
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvasSize.width, canvasSize.height);
    };

    useImperativeHandle(ref, () => ({
      clearCanvas, // expose the clearCanvas function to the parent component
      getImageData: () => canvasRef.current?.toDataURL('image/png') // function to get canvas data
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
        <div className="w-full h-full">
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
