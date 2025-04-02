export interface Policy {
  id: number;
  policyNumber: string;
  provider: string;
  vehicleId: number;
  vehicleRegistration: string;
  vehicleMake: string;
  vehicleModel: string;
  startDate: string;
  endDate: string;
  premiumAmount: number;
  coverageType: string;
  deductibleAmount: number;
  liabilityCoverageAmount: number;
  comprehensiveCoverageAmount: number;
  collisionCoverageAmount: number;
  status: string;
  notes: string;
  vehicleImage?: string;
}

export interface ApiResponse {
  policies: Policy[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

export interface PolicyFormData {
  policyNumber: string;
  provider: string;
  vehicleRegistration: string;
  vehicleMake: string;
  vehicleModel: string;
  startDate: string;
  endDate: string;
  premiumAmount: number;
  coverageType: string;
  deductibleAmount: number;
  liabilityCoverageAmount: number;
  comprehensiveCoverageAmount: number;
  collisionCoverageAmount: number;
  notes: string;
  vehicleImage?: string;
} 