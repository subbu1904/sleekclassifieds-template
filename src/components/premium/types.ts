
export interface PlanFeature {
  title: string;
  basic: boolean | string;
  premium: boolean | string;
  ultra: boolean | string;
  tooltip?: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
}
