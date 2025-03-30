package com.insurance.app.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.insurance.app.model.InsurancePolicy;
import com.insurance.app.model.Vehicle;

/**
 * Repository interface for Insurance Policy entity
 * Provides methods to interact with the insurance_policies table in the database
 */
@Repository
public interface InsurancePolicyRepository extends JpaRepository<InsurancePolicy, Long> {
    
    /**
     * Find policy by policy number
     */
    Optional<InsurancePolicy> findByPolicyNumber(String policyNumber);
    
    /**
     * Find all policies for a specific vehicle
     */
    List<InsurancePolicy> findByVehicle(Vehicle vehicle);
    
    /**
     * Find all policies for a specific vehicle with pagination
     */
    Page<InsurancePolicy> findByVehicle(Vehicle vehicle, Pageable pageable);
    
    /**
     * Find all policies by provider
     */
    Page<InsurancePolicy> findByProviderContainingIgnoreCase(String provider, Pageable pageable);
    
    /**
     * Find all policies with end date between the given dates
     */
    Page<InsurancePolicy> findByEndDateBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);
    
    /**
     * Find all policies with status
     */
    Page<InsurancePolicy> findByStatus(String status, Pageable pageable);
    
    /**
     * Find all active policies (end date after current date and status is active)
     */
    Page<InsurancePolicy> findByEndDateAfterAndStatus(LocalDate currentDate, String status, Pageable pageable);
    
    /**
     * Find expired policies (end date before current date)
     */
    Page<InsurancePolicy> findByEndDateBefore(LocalDate currentDate, Pageable pageable);
    
    /**
     * Custom query to find policies by vehicle details
     */
    @Query("SELECT DISTINCT p FROM InsurancePolicy p JOIN p.vehicle v WHERE " +
           "LOWER(v.make) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(v.model) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(v.registrationNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<InsurancePolicy> findByVehicleDetails(
            @Param("searchTerm") String searchTerm,
            Pageable pageable);
    
    /**
     * Find policies by premium amount range
     */
    @Query("SELECT p FROM InsurancePolicy p WHERE p.premiumAmount BETWEEN :minAmount AND :maxAmount")
    Page<InsurancePolicy> findByPremiumAmountRange(
            @Param("minAmount") BigDecimal minAmount,
            @Param("maxAmount") BigDecimal maxAmount,
            Pageable pageable);
} 