package com.insurance.app.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object for Insurance Policy
 * Used to transfer insurance policy data between client and server
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InsurancePolicyDto {
    
    private Long id;
    private String policyNumber;
    private String provider;
    private Long vehicleId;
    private String vehicleRegistration;
    private String vehicleMake;
    private String vehicleModel;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal premiumAmount;
    private String coverageType;
    private BigDecimal deductibleAmount;
    private BigDecimal liabilityCoverageAmount;
    private BigDecimal comprehensiveCoverageAmount;
    private BigDecimal collisionCoverageAmount;
    private String status;
    private String notes;
} 