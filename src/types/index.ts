export type UserRole = 'USER' | 'VIP' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole | string;
  balance: number;
  bonusBalance: number;
  currency: string;
  referralCode?: string | null;
  createdAt: string | Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'BET_PLACED' | 'BET_WIN' | 'CASINO_WIN' | 'BONUS_CLAIM' | string;
  amount: number;
  fee: number;
  method: string;
  accountNumber?: string | null;
  txId?: string | null;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED' | string;
  note?: string | null;
  createdAt: string | Date;
}

export interface SportMatch {
  id: string;
  sport: 'CRICKET' | 'FOOTBALL' | string;
  tournament: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamCode: string;
  awayTeamCode: string;
  homeScore: string;
  awayScore: string;
  status: 'LIVE' | 'UPCOMING' | 'FINISHED' | 'CANCELLED' | string;
  matchTime: string;
  venue: string;
  liveMinute?: string | null;
  liveSummary?: string | null;
  isHot: boolean;
  markets: Market[];
  createdAt: string | Date;
}

export interface Market {
  id: string;
  matchId: string;
  name: string;
  category: 'MAIN' | 'TOTALS' | 'SCORES' | 'HANDICAP' | 'PROPS' | string;
  status: 'OPEN' | 'SUSPENDED' | 'SETTLED' | string;
  outcomes: Outcome[];
}

export interface Outcome {
  id: string;
  marketId: string;
  name: string;
  odds: number;
  isWinner?: boolean | null;
}

export interface Bet {
  id: string;
  userId: string;
  type: 'SINGLE' | 'ACCUMULATOR' | string;
  totalOdds: number;
  stake: number;
  potentialPayout: number;
  returnAmount: number;
  status: 'PENDING' | 'WON' | 'LOST' | 'CASHED_OUT' | string;
  isCashedOut: boolean;
  cashoutValue?: number | null;
  items: BetItem[];
  createdAt: string | Date;
}

export interface BetItem {
  id: string;
  betId: string;
  matchId?: string | null;
  outcomeId?: string | null;
  matchName: string;
  marketName: string;
  outcomeName: string;
  odds: number;
  status: 'PENDING' | 'WON' | 'LOST' | string;
}

export interface CasinoRound {
  id: string;
  userId: string;
  game: 'AVIATOR' | 'CARROM' | 'ROULETTE' | 'DICE' | 'COINFLIP' | string;
  betAmount: number;
  multiplier: number;
  payout: number;
  isWin: boolean;
  details?: string | null;
  createdAt: string | Date;
}
