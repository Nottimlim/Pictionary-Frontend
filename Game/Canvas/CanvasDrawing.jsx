import React, { useRef, useState } from 'react';

const CanvasDrawing = () => {
  const canvasRef = useRef(null); // this is our canvas element
  const contextRef = useRef(null); // this is where we'll do the drawing
  const [isDrawing, setIsDrawing] = useState(false); // are we currently drawing?

  // set up the canvas when the component loads
  const prepareCanvas = () => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.8; // make it a decent size
    canvas.height = window.innerHeight * 0.6;
    const context = canvas.getContext('2d');
    context.lineCap = 'round'; // smooth out the lines
    context.strokeStyle = 'black'; // default color for drawing
    context.lineWidth = 5; // thickness of the lines
    contextRef.current = context;
  };

  // when the mouse button is pressed, start drawing
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent; // get the position on the canvas
    contextRef.current.beginPath(); // start a new path for drawing
    contextRef.current.moveTo(offsetX, offsetY); // move to the starting point
    setIsDrawing(true); // we're drawing now
  };
  
  // clear the canvas
  const clearCanvas = () => {
    contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    contextRef.current.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  useImperativeHandle(ref, () => ({
    clearCanvas,
  }));

  React.useEffect(() => {
    prepareCanvas();
  }, [strokeColor, strokeWidth, bgColor]);

  // draw lines as the mouse moves
  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return; // if we're not drawing, do nothing
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY); // draw a line to this point
    contextRef.current.stroke(); // actually draw the line
  };

  // when the mouse button is released, stop drawing
  const stopDrawing = () => {
    contextRef.current.closePath(); // finish the current path
    setIsDrawing(false); // we're done drawing
  };

  // set up the canvas when the component mounts
  React.useEffect(() => {
    prepareCanvas();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      className="border border-gray-300" // just a simple border for visibility
    />
  );
};

export default CanvasDrawing;
