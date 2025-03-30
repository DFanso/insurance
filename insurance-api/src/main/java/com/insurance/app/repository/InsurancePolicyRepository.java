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
     * @param policyNumber the policy number to search
     * @return optional containing the policy if found
     */
    Optional<InsurancePolicy> findByPolicyNumber(String policyNumber);
    
    /**
     * Find all policies for a specific vehicle
     * @param vehicle the vehicle
     * @return list of policies
     */
    List<InsurancePolicy> findByVehicle(Vehicle vehicle);
    
    /**
     * Find all policies for a specific vehicle with pagination
     * @param vehicle the vehicle
     * @param pageable pagination information
     * @return page of policies
     */
    Page<InsurancePolicy> findByVehicle(Vehicle vehicle, Pageable pageable);
    
    /**
     * Find all policies by provider
     * @param provider the insurance provider
     * @param pageable pagination information
     * @return page of policies
     */
    Page<InsurancePolicy> findByProviderContainingIgnoreCase(String provider, Pageable pageable);
    
    /**
     * Find all policies with end date between the given dates
     * @param startDate the start date
     * @param endDate the end date
     * @param pageable pagination information
     * @return page of policies
     */
    Page<InsurancePolicy> findByEndDateBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);
    
    /**
     * Find all policies with status
     * @param status the policy status
     * @param pageable pagination information
     * @return page of policies
     */
    Page<InsurancePolicy> findByStatus(String status, Pageable pageable);
    
    /**
     * Find all active policies (end date after current date and status is active)
     * @param currentDate the current date
     * @param status the policy status
     * @param pageable pagination information
     * @return page of active policies
     */
    Page<InsurancePolicy> findByEndDateAfterAndStatus(LocalDate currentDate, String status, Pageable pageable);
    
    /**
     * Find expired policies (end date before current date)
     * @param currentDate the current date
     * @param pageable pagination information
     * @return page of expired policies
     */
    Page<InsurancePolicy> findByEndDateBefore(LocalDate currentDate, Pageable pageable);
    
    /**
     * Custom query to find policies by vehicle details
     * @param make the vehicle make
     * @param model the vehicle model
     * @param registrationNumber the vehicle registration number
     * @param pageable pagination information
     * @return page of policies
     */
    @Query("SELECT p FROM InsurancePolicy p JOIN p.vehicle v WHERE " +
           "v.make LIKE %:make% OR " +
           "v.model LIKE %:model% OR " +
           "v.registrationNumber LIKE %:registrationNumber%")
    Page<InsurancePolicy> findByVehicleDetails(
            @Param("make") String make,
            @Param("model") String model,
            @Param("registrationNumber") String registrationNumber,
            Pageable pageable);
    
    /**
     * Find policies by premium amount range
     * @param minAmount the minimum premium amount
     * @param maxAmount the maximum premium amount
     * @param pageable pagination information
     * @return page of policies
     */
    @Query("SELECT p FROM InsurancePolicy p WHERE p.premiumAmount BETWEEN :minAmount AND :maxAmount")
    Page<InsurancePolicy> findByPremiumAmountRange(
            @Param("minAmount") BigDecimal minAmount,
            @Param("maxAmount") BigDecimal maxAmount,
            Pageable pageable);
} 