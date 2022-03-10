export interface ContextMenuItem {
  type: 'item' | 'seperator';
  key?: string;
  icon?: string;
  display?: string;
}

export const ContextMenu: { [key: string]: ContextMenuItem[] } = {
  Edit: [{ type: 'item', key: 'edit', icon: 'edit_note', display: 'Edit' }],
};
