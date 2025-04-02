package com.insurance.app.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entity class representing an insurance policy for a vehicle
 * Contains details like policy number, provider, coverage details, start and end date, premium amount, etc.
 */
@Entity
@Table(name = "insurance_policies")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InsurancePolicy {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "policy_number", nullable = false, unique = true)
    private String policyNumber;
    
    @Column(name = "provider", nullable = false)
    private String provider;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;
    
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;
    
    @Column(name = "premium_amount", nullable = false)
    private BigDecimal premiumAmount;
    
    @Column(name = "coverage_type", nullable = false)
    private String coverageType;
    
    @Column(name = "deductible_amount")
    private BigDecimal deductibleAmount;
    
    @Column(name = "liability_coverage_amount")
    private BigDecimal liabilityCoverageAmount;
    
    @Column(name = "comprehensive_coverage_amount")
    private BigDecimal comprehensiveCoverageAmount;
    
    @Column(name = "collision_coverage_amount")
    private BigDecimal collisionCoverageAmount;
    
    @Column(name = "status", nullable = false)
    private String status;
    
    @Column(name = "notes")
    private String notes;
    
    // Vehicle Image at time of policy creation
    @Lob
    @Column(name = "vehicle_image", columnDefinition = "LONGTEXT")
    private String vehicleImage;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
} 