import type { PortfolioData } from '../../types/portfolio';

export interface StepProps {
  data: PortfolioData;
  setData: (update: (d: PortfolioData) => PortfolioData) => void;
  errors: Record<string, string>;
}
