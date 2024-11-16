import React, {
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";

const CanvasDrawing = forwardRef(
  ({ strokeWidth, strokeColor, bgColor, disabled }, ref) => {
    const canvasRef = useRef(null); // this is our canvas element
    const contextRef = useRef(null); // this is where we'll be drawing
    const [isDrawing, setIsDrawing] = useState(false); // are we currently drawing?

    // set up the canvas when the component loads
    const prepareCanvas = () => {
      const canvas = canvasRef.current;
      const container = canvas.parentElement;

      canvas.width = container.clientWidth - 32; // subtract padding (16px * 2)
      canvas.height = 400; // fixed height or you can make this dynamic too

      const context = canvas.getContext("2d");
      context.lineCap = "round"; // make the lines smooth and round at the ends
      context.lineWidth = strokeWidth; // set the initial brush size
      context.strokeStyle = strokeColor; // set the initial brush color
      context.fillStyle = bgColor; // set the background color
      context.fillRect(0, 0, canvas.width, canvas.height); // fill the canvas with the background color
      contextRef.current = context;
    };

    // update the drawing context when color or brush size changes
    const updateDrawingContext = () => {
      const context = contextRef.current;
      context.strokeStyle = strokeColor; // update the brush color
      context.lineWidth = strokeWidth; // update the brush size
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
      const { offsetX, offsetY } = nativeEvent;
      contextRef.current.lineTo(offsetX, offsetY); // draw a line to this point
      contextRef.current.stroke(); // actually draw the line
    };

    // stop drawing when the mouse is released
    const stopDrawing = () => {
      contextRef.current.closePath(); // finish the current path
      setIsDrawing(false); // we're done drawing
    };

    // clear the canvas
    const clearCanvas = () => {
      const canvas = canvasRef.current;
      if (contextRef.current) {
        contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
        contextRef.current.fillRect(0, 0, canvas.width, canvas.height); // fill with background color
      }
    };

    useImperativeHandle(ref, () => ({
      clearCanvas, // expose the clearCanvas function to the parent component
    }));

    // handle window resize
    React.useEffect(() => {
      const handleResize = () => {
        prepareCanvas();
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    // run once when the component mounts to set up the canvas
    React.useEffect(() => {
      prepareCanvas();
    }, []);

    // update the drawing context whenever brush color or size changes
    React.useEffect(() => {
      updateDrawingContext();
    }, [strokeColor, strokeWidth]);

    return (
      <div className="w-full flex justify-center">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="border border-eerie-black-300" // just a simple border for visibility
        />
      </div>
    );
  }
);

export default CanvasDrawing;
