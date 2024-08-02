import React from 'react'

interface Props {
  shouldChange: string;
  children: any;
}

const FadeTransition: React.FC<Props> = ({ shouldChange, children }) => {
  const prevChildren = React.useRef<React.ReactNode>(null);
  const currentChildren = React.useRef<React.ReactNode>(null);
  const currentContainer = React.useRef<HTMLDivElement>(null);

  const [isAnimating, setIsAnimating] = React.useState<boolean>(false);

  const currentKey = React.useRef<string>('');

  if (
    currentKey?.current !== null &&
    currentKey.current !== shouldChange &&
    currentChildren?.current &&
    currentChildren.current !== children
  ) {
    currentKey.current = shouldChange;
    prevChildren.current = currentChildren.current;
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 200);
  } else {
    currentChildren.current = children;
    currentKey.current = shouldChange;
  }

  return (
    <div className="flex w-full h-full grow relative">
      <div
        className={`flex w-full h-full flex-col grow duration-200 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
        ref={currentContainer}
      >
        {isAnimating ? prevChildren.current : children}
      </div>
    </div>
  );
};

export default FadeTransition;
