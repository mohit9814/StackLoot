export interface WishlistGoal {
  id: string;
  title: string;
  targetAmount: number;
  category: 'TECH' | 'MUSIC' | 'GAMING' | 'EDUCATION' | 'LIFESTYLE' | 'EXPERIENCE';
  imageUrl?: string;
  createdAt: string;
  notes?: string;
}

export interface GoalProgressInfo {
  goal: WishlistGoal;
  currentSaved: number;
  percentageCompleted: number;
  projectedMonthsUnderCompound: number;
  projectedMonthsUnderNoCompounding: number;
  monthsSavedViaCompound: number;
  isUnlocked: boolean;
}
