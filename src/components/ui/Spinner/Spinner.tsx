import { Loader2 } from "lucide-react";

interface SpinnerProps {
  size?: number;
  className?: string;
}

const Spinner = ({ size = 18, className = "" }: SpinnerProps) => {
  return <Loader2 size={size} className={`animate-spin ${className}`} />;
};

export default Spinner;