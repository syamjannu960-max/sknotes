import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

type AdminPageHeaderProps = {
  title: string;
  actionText: string;
  onActionClick: () => void;
};

export function AdminPageHeader({ title, actionText, onActionClick }: AdminPageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6 border-b pb-4">
      <h1 className="text-3xl font-bold font-headline">{title}</h1>
      <Button onClick={onActionClick}>
        <PlusCircle className="mr-2 h-4 w-4" />
        {actionText}
      </Button>
    </div>
  );
}
