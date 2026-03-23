import { useNavigate } from "react-router-dom";
import { GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
        <GraduationCap className="h-12 w-12" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
        Easy Grade System
      </h1>
      <p className="text-muted-foreground text-lg max-w-md mb-10">
        Enter student marks, calculate totals, means & grades — all automatically.
      </p>
      <Button
        size="lg"
        className="text-lg px-8 py-6 gap-2"
        onClick={() => navigate("/calculator")}
      >
        Start System <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default Index;
