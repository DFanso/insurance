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
     * @param policyDto the policy dto containing policy details
     * @return the created policy dto
     */
    InsurancePolicyDto createPolicy(InsurancePolicyDto policyDto);
    
    /**
     * Get a policy by id
     * @param id the policy id
     * @return the policy dto
     */
    InsurancePolicyDto getPolicyById(Long id);
    
    /**
     * Get a policy by policy number
     * @param policyNumber the policy number
     * @return the policy dto
     */
    InsurancePolicyDto getPolicyByPolicyNumber(String policyNumber);
    
    /**
     * Get all policies with pagination
     * @param pageNo the page number
     * @param pageSize the page size
     * @param sortBy the field to sort by
     * @param sortDir the sort direction
     * @return page of policy dtos
     */
    Page<InsurancePolicyDto> getAllPolicies(int pageNo, int pageSize, String sortBy, String sortDir);
    
    /**
     * Get policies by vehicle id with pagination
     * @param vehicleId the vehicle id
     * @param pageNo the page number
     * @param pageSize the page size
     * @param sortBy the field to sort by
     * @param sortDir the sort direction
     * @return page of policy dtos
     */
    Page<InsurancePolicyDto> getPoliciesByVehicleId(Long vehicleId, int pageNo, int pageSize, String sortBy, String sortDir);
    
    /**
     * Get policies by provider with pagination
     * @param provider the provider name
     * @param pageNo the page number
     * @param pageSize the page size
     * @param sortBy the field to sort by
     * @param sortDir the sort direction
     * @return page of policy dtos
     */
    Page<InsurancePolicyDto> getPoliciesByProvider(String provider, int pageNo, int pageSize, String sortBy, String sortDir);
    
    /**
     * Get policies by expiry date range with pagination
     * @param startDate the start date
     * @param endDate the end date
     * @param pageNo the page number
     * @param pageSize the page size
     * @param sortBy the field to sort by
     * @param sortDir the sort direction
     * @return page of policy dtos
     */
    Page<InsurancePolicyDto> getPoliciesByExpiryDateRange(LocalDate startDate, LocalDate endDate, int pageNo, int pageSize, String sortBy, String sortDir);
    
    /**
     * Get active policies with pagination
     * @param pageNo the page number
     * @param pageSize the page size
     * @param sortBy the field to sort by
     * @param sortDir the sort direction
     * @return page of policy dtos
     */
    Page<InsurancePolicyDto> getActivePolicies(int pageNo, int pageSize, String sortBy, String sortDir);
    
    /**
     * Get expired policies with pagination
     * @param pageNo the page number
     * @param pageSize the page size
     * @param sortBy the field to sort by
     * @param sortDir the sort direction
     * @return page of policy dtos
     */
    Page<InsurancePolicyDto> getExpiredPolicies(int pageNo, int pageSize, String sortBy, String sortDir);
    
    /**
     * Get policies by vehicle details (make, model, registration) with pagination
     * @param searchTerm the search term
     * @param pageNo the page number
     * @param pageSize the page size
     * @param sortBy the field to sort by
     * @param sortDir the sort direction
     * @return page of policy dtos
     */
    Page<InsurancePolicyDto> getPoliciesByVehicleDetails(String searchTerm, int pageNo, int pageSize, String sortBy, String sortDir);
    
    /**
     * Get policies by premium amount range with pagination
     * @param minAmount the minimum premium amount
     * @param maxAmount the maximum premium amount
     * @param pageNo the page number
     * @param pageSize the page size
     * @param sortBy the field to sort by
     * @param sortDir the sort direction
     * @return page of policy dtos
     */
    Page<InsurancePolicyDto> getPoliciesByPremiumRange(BigDecimal minAmount, BigDecimal maxAmount, int pageNo, int pageSize, String sortBy, String sortDir);
    
    /**
     * Update an existing policy
     * @param id the policy id
     * @param policyDto the updated policy dto
     * @return the updated policy dto
     */
    InsurancePolicyDto updatePolicy(Long id, InsurancePolicyDto policyDto);
    
    /**
     * Delete a policy by id
     * @param id the policy id
     */
    void deletePolicy(Long id);
} 