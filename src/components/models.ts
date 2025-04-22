export interface List {
  key: string;
  data: {
    description: string;
    quantity: number;
    total: number;
  };
}
export interface ListItem {
  key: string;
  data: {
    listKey: string;
    content: string;
    quantity: number;
    price: number;
    done: boolean;
  };
}

export interface ListItemData {
  listKey: string;
  content: string;
  quantity: number;
  price?: number;
  done?: boolean;
}

export interface MenuList {
  icon: string;
  iconColor?: string;
  label: string;
  separator: boolean;
}
