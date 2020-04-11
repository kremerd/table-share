export type BoardItem =
  Token;

export interface Token extends BoardItemBase {
  type: 'token';
  name: string;
  image: string;
}

export interface BoardItemBase {
  type: string;
  id: number;
  x: number;
  y: number;
}
