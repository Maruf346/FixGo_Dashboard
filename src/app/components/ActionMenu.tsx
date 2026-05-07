import { useState, useRef, useEffect } from "react";
import { MoreVertical } from "lucide-react";

interface ActionMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  className?: string;
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  onOpenChange?: (isOpen: boolean) => void;
}

export function ActionMenu({ items, onOpenChange }: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        onOpenChange?.(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onOpenChange]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = !isOpen;
    setIsOpen(newState);
    onOpenChange?.(newState);
  };

  const handleItemClick = (e: React.MouseEvent, onClick: () => void) => {
    e.stopPropagation();
    onClick();
    setIsOpen(false);
    onOpenChange?.(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleToggle}
        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-44 bg-card rounded-xl border border-border shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={(e) => handleItemClick(e, item.onClick)}
              className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted transition-colors text-left ${
                item.className || "text-foreground"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
