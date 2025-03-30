package com.insurance.app.service;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.data.domain.Page;

import com.insurance.app.dto.InsurancePolicyDto;

/**
 * Service interface for Insurance Policy operations
 * Defines methods for CRUD operations and other business logic related to insurance policies
 */
public interface InsurancePolicyService {
    
    /**
     * Create a new insurance policy
     */
    InsurancePolicyDto createPolicy(InsurancePolicyDto policyDto);
    
    /**
     * Get a policy by id
     */
    InsurancePolicyDto getPolicyById(Long id);
    
    /**
     * Get a policy by policy number
     */
    InsurancePolicyDto getPolicyByPolicyNumber(String policyNumber);
    
    /**
     * Get all policies with pagination
     */
    Page<InsurancePolicyDto> getAllPolicies(int pageNo, int pageSize, String sortBy, String sortDir);
    
    /**
     * Get policies by vehicle id with pagination
     */
    Page<InsurancePolicyDto> getPoliciesByVehicleId(Long vehicleId, int pageNo, int pageSize, String sortBy, String sortDir);
    
    /**
     * Get policies by provider with pagination
     */
    Page<InsurancePolicyDto> getPoliciesByProvider(String provider, int pageNo, int pageSize, String sortBy, String sortDir);
    
    /**
     * Get policies by expiry date range with pagination
     */
    Page<InsurancePolicyDto> getPoliciesByExpiryDateRange(LocalDate startDate, LocalDate endDate, int pageNo, int pageSize, String sortBy, String sortDir);
    
    /**
     * Get active policies with pagination
     */
    Page<InsurancePolicyDto> getActivePolicies(int pageNo, int pageSize, String sortBy, String sortDir);
    
    /**
     * Get expired policies with pagination
     */
    Page<InsurancePolicyDto> getExpiredPolicies(int pageNo, int pageSize, String sortBy, String sortDir);
    
    /**
     * Get policies by vehicle details (make, model, registration) with pagination
     */
    Page<InsurancePolicyDto> getPoliciesByVehicleDetails(String searchTerm, int pageNo, int pageSize, String sortBy, String sortDir);
    
    /**
     * Get policies by premium amount range with pagination
     */
    Page<InsurancePolicyDto> getPoliciesByPremiumRange(BigDecimal minAmount, BigDecimal maxAmount, int pageNo, int pageSize, String sortBy, String sortDir);
    
    /**
     * Update an existing policy
     */
    InsurancePolicyDto updatePolicy(Long id, InsurancePolicyDto policyDto);
    
    /**
     * Delete a policy by id
     */
    void deletePolicy(Long id);
} 