package com.insurance.app.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.insurance.app.dto.InsurancePolicyDto;
import com.insurance.app.service.InsurancePolicyService;
import com.insurance.app.util.Constants;

/**
 * Controller for handling insurance policy related API requests
 * Provides endpoints for CRUD operations and other insurance policy operations
 */
@RestController
@RequestMapping(Constants.INSURANCE_URL)
public class InsurancePolicyController {

    private final InsurancePolicyService policyService;
    
    @Autowired
    public InsurancePolicyController(InsurancePolicyService policyService) {
        this.policyService = policyService;
    }
    
    /**
     * Create a new insurance policy
     * @param policyDto the policy dto
     * @return response entity with created policy
     */
    @PostMapping
    public ResponseEntity<InsurancePolicyDto> createPolicy(@RequestBody InsurancePolicyDto policyDto) {
        InsurancePolicyDto createdPolicy = policyService.createPolicy(policyDto);
        return new ResponseEntity<>(createdPolicy, HttpStatus.CREATED);
    }
    
    /**
     * Get a policy by id
     * @param id the policy id
     * @return response entity with policy
     */
    @GetMapping("/{id}")
    public ResponseEntity<InsurancePolicyDto> getPolicyById(@PathVariable Long id) {
        InsurancePolicyDto policy = policyService.getPolicyById(id);
        return ResponseEntity.ok(policy);
    }
    
    /**
     * Get a policy by policy number
     * @param policyNumber the policy number
     * @return response entity with policy
     */
    @GetMapping("/number/{policyNumber}")
    public ResponseEntity<InsurancePolicyDto> getPolicyByNumber(@PathVariable String policyNumber) {
        InsurancePolicyDto policy = policyService.getPolicyByPolicyNumber(policyNumber);
        return ResponseEntity.ok(policy);
    }
    
    /**
     * Get all policies with pagination
     * @param pageNo the page number
     * @param pageSize the page size
     * @param sortBy the field to sort by
     * @param sortDir the sort direction
     * @return response entity with policies
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllPolicies(
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_NUMBER) int pageNo,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_SIZE) int pageSize,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_BY) String sortBy,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_DIRECTION) String sortDir) {
        
        Page<InsurancePolicyDto> policies = policyService.getAllPolicies(pageNo, pageSize, sortBy, sortDir);
        return createPageResponse(policies);
    }
    
    /**
     * Get policies by vehicle id with pagination
     * @param vehicleId the vehicle id
     * @param pageNo the page number
     * @param pageSize the page size
     * @param sortBy the field to sort by
     * @param sortDir the sort direction
     * @return response entity with policies
     */
    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<Map<String, Object>> getPoliciesByVehicleId(
            @PathVariable Long vehicleId,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_NUMBER) int pageNo,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_SIZE) int pageSize,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_BY) String sortBy,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_DIRECTION) String sortDir) {
        
        Page<InsurancePolicyDto> policies = policyService.getPoliciesByVehicleId(vehicleId, pageNo, pageSize, sortBy, sortDir);
        return createPageResponse(policies);
    }
    
    /**
     * Get policies by provider with pagination
     * @param provider the provider name
     * @param pageNo the page number
     * @param pageSize the page size
     * @param sortBy the field to sort by
     * @param sortDir the sort direction
     * @return response entity with policies
     */
    @GetMapping("/provider")
    public ResponseEntity<Map<String, Object>> getPoliciesByProvider(
            @RequestParam String provider,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_NUMBER) int pageNo,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_SIZE) int pageSize,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_BY) String sortBy,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_DIRECTION) String sortDir) {
        
        Page<InsurancePolicyDto> policies = policyService.getPoliciesByProvider(provider, pageNo, pageSize, sortBy, sortDir);
        return createPageResponse(policies);
    }
    
    /**
     * Get policies by expiry date range with pagination
     * @param startDate the start date
     * @param endDate the end date
     * @param pageNo the page number
     * @param pageSize the page size
     * @param sortBy the field to sort by
     * @param sortDir the sort direction
     * @return response entity with policies
     */
    @GetMapping("/expiry-range")
    public ResponseEntity<Map<String, Object>> getPoliciesByExpiryDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_NUMBER) int pageNo,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_SIZE) int pageSize,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_BY) String sortBy,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_DIRECTION) String sortDir) {
        
        Page<InsurancePolicyDto> policies = policyService.getPoliciesByExpiryDateRange(startDate, endDate, pageNo, pageSize, sortBy, sortDir);
        return createPageResponse(policies);
    }
    
    /**
     * Get active policies with pagination
     * @param pageNo the page number
     * @param pageSize the page size
     * @param sortBy the field to sort by
     * @param sortDir the sort direction
     * @return response entity with policies
     */
    @GetMapping("/active")
    public ResponseEntity<Map<String, Object>> getActivePolicies(
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_NUMBER) int pageNo,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_SIZE) int pageSize,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_BY) String sortBy,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_DIRECTION) String sortDir) {
        
        Page<InsurancePolicyDto> policies = policyService.getActivePolicies(pageNo, pageSize, sortBy, sortDir);
        return createPageResponse(policies);
    }
    
    /**
     * Get expired policies with pagination
     * @param pageNo the page number
     * @param pageSize the page size
     * @param sortBy the field to sort by
     * @param sortDir the sort direction
     * @return response entity with policies
     */
    @GetMapping("/expired")
    public ResponseEntity<Map<String, Object>> getExpiredPolicies(
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_NUMBER) int pageNo,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_SIZE) int pageSize,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_BY) String sortBy,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_DIRECTION) String sortDir) {
        
        Page<InsurancePolicyDto> policies = policyService.getExpiredPolicies(pageNo, pageSize, sortBy, sortDir);
        return createPageResponse(policies);
    }
    
    /**
     * Get policies by vehicle details with pagination
     * @param searchTerm the search term
     * @param pageNo the page number
     * @param pageSize the page size
     * @param sortBy the field to sort by
     * @param sortDir the sort direction
     * @return response entity with policies
     */
    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> getPoliciesByVehicleDetails(
            @RequestParam String searchTerm,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_NUMBER) int pageNo,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_SIZE) int pageSize,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_BY) String sortBy,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_DIRECTION) String sortDir) {
        
        Page<InsurancePolicyDto> policies = policyService.getPoliciesByVehicleDetails(searchTerm, pageNo, pageSize, sortBy, sortDir);
        return createPageResponse(policies);
    }
    
    /**
     * Get policies by premium amount range with pagination
     * @param minAmount the minimum premium amount
     * @param maxAmount the maximum premium amount
     * @param pageNo the page number
     * @param pageSize the page size
     * @param sortBy the field to sort by
     * @param sortDir the sort direction
     * @return response entity with policies
     */
    @GetMapping("/premium-range")
    public ResponseEntity<Map<String, Object>> getPoliciesByPremiumRange(
            @RequestParam BigDecimal minAmount,
            @RequestParam BigDecimal maxAmount,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_NUMBER) int pageNo,
            @RequestParam(defaultValue = Constants.DEFAULT_PAGE_SIZE) int pageSize,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_BY) String sortBy,
            @RequestParam(defaultValue = Constants.DEFAULT_SORT_DIRECTION) String sortDir) {
        
        Page<InsurancePolicyDto> policies = policyService.getPoliciesByPremiumRange(minAmount, maxAmount, pageNo, pageSize, sortBy, sortDir);
        return createPageResponse(policies);
    }
    
    /**
     * Update an existing policy
     * @param id the policy id
     * @param policyDto the updated policy dto
     * @return response entity with updated policy
     */
    @PutMapping("/{id}")
    public ResponseEntity<InsurancePolicyDto> updatePolicy(
            @PathVariable Long id,
            @RequestBody InsurancePolicyDto policyDto) {
        
        InsurancePolicyDto updatedPolicy = policyService.updatePolicy(id, policyDto);
        return ResponseEntity.ok(updatedPolicy);
    }
    
    /**
     * Delete a policy by id
     * @param id the policy id
     * @return response entity with success message
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletePolicy(@PathVariable Long id) {
        policyService.deletePolicy(id);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Insurance policy deleted successfully with id: " + id);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Create a paginated response from a page of policies
     * @param page the page of policies
     * @return map with page data
     */
    private ResponseEntity<Map<String, Object>> createPageResponse(Page<InsurancePolicyDto> page) {
        Map<String, Object> response = new HashMap<>();
        response.put("policies", page.getContent());
        response.put("currentPage", page.getNumber());
        response.put("totalItems", page.getTotalElements());
        response.put("totalPages", page.getTotalPages());
        
        return ResponseEntity.ok(response);
    }
} 