export interface Policy {
  id: number;
  policyNumber: string;
  provider: string;
  vehicleRegistration?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  premiumAmount: number;
  endDate: string;
  status: string;
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
  premiumAmount: number;
  startDate: string;
  endDate: string;
  coverageType: string;
  deductibleAmount: number;
  liabilityCoverageAmount: number;
  comprehensiveCoverageAmount: number;
  collisionCoverageAmount: number;
  notes: string;
} 