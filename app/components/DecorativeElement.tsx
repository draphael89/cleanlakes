import React from 'react';
import { motion } from 'framer-motion';

interface DecorativeElementProps {
  type: 'circle' | 'square' | 'triangle';
  color?: string;
  size?: number;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

const DecorativeElement: React.FC<DecorativeElementProps> = ({
  type,
  color = 'accent',
  size = 50,
  top,
  left,
  right,
  bottom,
}) => {
  const shapeStyles: React.CSSProperties = {
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    top: top !== undefined ? `${top}%` : undefined,
    left: left !== undefined ? `${left}%` : undefined,
    right: right !== undefined ? `${right}%` : undefined,
    bottom: bottom !== undefined ? `${bottom}%` : undefined,
  };

  const shapes = {
    circle: <div className={`rounded-full bg-${color}`} style={shapeStyles} />,
    square: <div className={`bg-${color}`} style={shapeStyles} />,
    triangle: (
      <div
        className={`border-l-[${size}px] border-l-transparent border-b-[${size}px] border-b-${color} border-r-[${size}px] border-r-transparent`}
        style={shapeStyles}
      />
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 0.2, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {shapes[type]}
    </motion.div>
  );
};

export default DecorativeElement;