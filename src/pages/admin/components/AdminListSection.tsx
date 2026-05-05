import React from 'react';
import { IconType } from 'react-icons';
import { RiAddLine, RiDeleteBinLine, RiEditLine } from 'react-icons/ri';
import { Button } from '../../../Lib/Button';
import { Card } from '../../../Lib/Card';
import { Subheading } from '../../../Lib/Subheading';
import { Text } from '../../../Lib/Text';

interface IAdminListSectionProps<T> {
  title: string;
  icon: IconType;
  addButtonLabel: string;
  items: T[];
  emptyMessage: string;
  onAdd: () => void;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  renderItemTitle: (item: T) => React.ReactNode;
  renderItemSubtitle?: (item: T) => React.ReactNode;
  deleteConfirmationMessage?: string;
}

export function AdminListSection<T extends { id: string | number }>({
  title,
  icon: Icon,
  addButtonLabel,
  items,
  emptyMessage,
  onAdd,
  onEdit,
  onDelete,
  renderItemTitle,
  renderItemSubtitle,
  deleteConfirmationMessage = 'Tem certeza que deseja excluir este item?',
}: IAdminListSectionProps<T>) {
  return (
    <Card variant="outline" className="space-y-6">
      <div className="flex items-center justify-between">
        <Subheading className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-zinc-400" />
          {title}
        </Subheading>
        <Button
          onClick={onAdd}
          variant="secondary"
          type="button"
          className="gap-2"
        >
          <RiAddLine size={18} />
          {addButtonLabel}
        </Button>
      </div>

      <div className="space-y-4">
        {items && items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 dark:border-zinc-700/40 bg-zinc-50/50 dark:bg-zinc-800/50"
            >
              <div className="flex-1 min-w-0 pr-4">
                <Text className="font-medium !text-zinc-950 dark:!text-white truncate">
                  {renderItemTitle(item)}
                </Text>
                {renderItemSubtitle && (
                  <Text className="text-xs">{renderItemSubtitle(item)}</Text>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  className="!p-2"
                  type="button"
                  name="edit"
                  onClick={() => onEdit(item)}
                >
                  <RiEditLine size={18} />
                </Button>
                <Button
                  variant="ghost"
                  className="!p-2"
                  type="button"
                  name="delete"
                  onClick={() =>
                    confirm(deleteConfirmationMessage) && onDelete(item)
                  }
                >
                  <RiDeleteBinLine size={20} />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-2xl">
            <Text>{emptyMessage}</Text>
          </div>
        )}
      </div>
    </Card>
  );
}
