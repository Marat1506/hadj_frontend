import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import FilterPanel from './FilterPanel';

interface FilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: any) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ open, onOpenChange, onApply }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Фильтры</DialogTitle>
        </DialogHeader>
        <FilterPanel
          onApply={(filters) => {
            onApply(filters); 
            onOpenChange(false); 
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default FilterModal;
