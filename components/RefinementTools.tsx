import React from 'react';
import { Shovel, Flag, Leaf, Waves } from 'lucide-react';

export const REFINEMENT_TOOLS = [
  { 
    id: 'bunkering', 
    label: 'Bunkering', 
    icon: Shovel,
    options: ['Deep pot bunkers', 'Frayed edges', 'Geometric shape', 'Grass hollows', 'Add waste area'] 
  },
  { 
    id: 'greens', 
    label: 'Green Design', 
    icon: Flag,
    options: ['Tiered levels', 'Island green', 'Punchbowl shape', 'Infinity edge', 'False front'] 
  },
  { 
    id: 'vegetation', 
    label: 'Vegetation', 
    icon: Leaf,
    options: ['More trees', 'Clear brush', 'Native grasses', 'Lush fairways', 'Pine straw base'] 
  },
  {
    id: 'hazards',
    label: 'Hazards',
    icon: Waves,
    options: ['Add pond', 'Winding stream', 'Rock outcropping', 'Deep rough', 'Stone bridge']
  }
];

interface RefinementToolsProps {
  selectedOptions: string[];
  onToggle: (option: string) => void;
  disabled?: boolean;
}

export const RefinementTools: React.FC<RefinementToolsProps> = ({ selectedOptions, onToggle, disabled }) => {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {REFINEMENT_TOOLS.map((tool) => (
        <div key={tool.id} className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
            <tool.icon size={12} /> {tool.label}
          </div>
          <div className="flex flex-wrap md:flex-wrap gap-1.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0 -mx-2 md:mx-0 px-2 md:px-0 snap-x hide-scrollbar">
            {tool.options.map((option) => (
              <div key={option} className="snap-start shrink-0 md:shrink">
                <button
                  onClick={() => onToggle(option)}
                  disabled={disabled}
                  className={`
                    text-left text-xs px-2.5 py-1.5 rounded-lg border transition-all whitespace-nowrap
                    ${selectedOptions.includes(option)
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-300'}
                  `}
                >
                  {option}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
