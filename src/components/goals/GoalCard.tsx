
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Weight, Activity } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface GoalCardProps {
  goal: Goal;
  isSelected: boolean;
  onSelect: (goalId: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, isSelected, onSelect }) => {
  const renderIcon = () => {
    switch (goal.icon) {
      case "target":
        return <Target className="h-6 w-6 text-#C9A84C" />;
      case "dumbbell":
        return <Activity className="h-6 w-6 text-#C9A84C" />;
      case "activity":
        return <Activity className="h-6 w-6 text-#C9A84C" />;
      case "weight":
        return <Weight className="h-6 w-6 text-#C9A84C" />;
      default:
        return <Target className="h-6 w-6 text-#C9A84C" />;
    }
  };

  return (
    <Card
      className={`cursor-pointer transition-all ${
        isSelected
          ? "border-2 border- [#E8C97A] shadow-md"
          : "border border-gray-200 hover:border-#C9A84C"
      }`}
      onClick={() => onSelect(goal.id)}
    >
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="mr-4 p-2 bg-healthGray rounded-full">
            {renderIcon()}
          </div>
          <h3 className="text-xl font-medium">{goal.title}</h3>
        </div>
        <p className="text-white">{goal.description}</p>
        <div className="mt-4 flex justify-end">
          <div
            className={`w-6 h-6 rounded-full border-2 ${
              isSelected
                ? "bg- [#E8C97A] border- [#E8C97A]"
                : "border-gray-300"
            } flex items-center justify-center`}
          >
            {isSelected && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 text-white"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalCard;
