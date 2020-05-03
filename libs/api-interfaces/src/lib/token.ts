import { BoardItemBase } from './board-item-base';

export interface Token extends BoardItemBase, TokenEssentials {
  type: 'token';
  scale: number;
}

export interface TokenGroup extends TokenEssentials {
  amount: number;
}

export interface TokenEssentials {
  name: string;
  image: string;
}
