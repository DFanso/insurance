package com.insurance.app.service.impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.insurance.app.dto.InsurancePolicyDto;
import com.insurance.app.model.InsurancePolicy;
import com.insurance.app.model.Vehicle;
import com.insurance.app.repository.InsurancePolicyRepository;
import com.insurance.app.repository.VehicleRepository;
import com.insurance.app.service.InsurancePolicyService;
import com.insurance.app.util.Constants;

/**
 * Implementation of InsurancePolicyService
 * Provides business logic for insurance policy operations
 */
@Service
public class InsurancePolicyServiceImpl implements InsurancePolicyService {

    private final InsurancePolicyRepository policyRepository;
    private final VehicleRepository vehicleRepository;
    
    @Autowired
    public InsurancePolicyServiceImpl(InsurancePolicyRepository policyRepository, VehicleRepository vehicleRepository) {
        this.policyRepository = policyRepository;
        this.vehicleRepository = vehicleRepository;
    }

    /**
     * Create a new insurance policy
     */
    @Override
    @Transactional
    public InsurancePolicyDto createPolicy(InsurancePolicyDto policyDto) {
        // Get the vehicle
        Vehicle vehicle = vehicleRepository.findById(policyDto.getVehicleId())
                .orElseThrow(() -> new RuntimeException(Constants.ERROR_VEHICLE_NOT_FOUND + policyDto.getVehicleId()));
        
        // Validate dates
        if (policyDto.getEndDate().isBefore(policyDto.getStartDate())) {
            throw new RuntimeException(Constants.ERROR_INVALID_DATE_RANGE);
        }
        
        // Create new policy
        InsurancePolicy policy = mapToEntity(policyDto, vehicle);
        policy.setStatus(Constants.POLICY_STATUS_ACTIVE);
        policy.setCreatedAt(LocalDateTime.now());
        policy.setUpdatedAt(LocalDateTime.now());
        
        // Save and return
        InsurancePolicy savedPolicy = policyRepository.save(policy);
        return mapToDto(savedPolicy);
    }

    /**
     * Get a policy by id
     */
    @Override
    public InsurancePolicyDto getPolicyById(Long id) {
        InsurancePolicy policy = policyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(Constants.ERROR_POLICY_NOT_FOUND + id));
        return mapToDto(policy);
    }

    /**
     * Get a policy by policy number
     */
    @Override
    public InsurancePolicyDto getPolicyByPolicyNumber(String policyNumber) {
        InsurancePolicy policy = policyRepository.findByPolicyNumber(policyNumber)
                .orElseThrow(() -> new RuntimeException("Insurance policy not found with number: " + policyNumber));
        return mapToDto(policy);
    }

    /**
     * Get all policies with pagination
     */
    @Override
    public Page<InsurancePolicyDto> getAllPolicies(int pageNo, int pageSize, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? 
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<InsurancePolicy> policies = policyRepository.findAll(pageable);
        
        return policies.map(this::mapToDto);
    }

    /**
     * Get policies by vehicle id with pagination
     */
    @Override
    public Page<InsurancePolicyDto> getPoliciesByVehicleId(Long vehicleId, int pageNo, int pageSize, String sortBy, String sortDir) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException(Constants.ERROR_VEHICLE_NOT_FOUND + vehicleId));
        
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? 
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<InsurancePolicy> policies = policyRepository.findByVehicle(vehicle, pageable);
        
        return policies.map(this::mapToDto);
    }

    /**
     * Get policies by provider with pagination
     */
    @Override
    public Page<InsurancePolicyDto> getPoliciesByProvider(String provider, int pageNo, int pageSize, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? 
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<InsurancePolicy> policies = policyRepository.findByProviderContainingIgnoreCase(provider, pageable);
        
        return policies.map(this::mapToDto);
    }

    /**
     * Get policies by expiry date range with pagination
     */
    @Override
    public Page<InsurancePolicyDto> getPoliciesByExpiryDateRange(LocalDate startDate, LocalDate endDate, int pageNo, int pageSize, String sortBy, String sortDir) {
        if (endDate.isBefore(startDate)) {
            throw new RuntimeException(Constants.ERROR_INVALID_DATE_RANGE);
        }
        
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? 
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<InsurancePolicy> policies = policyRepository.findByEndDateBetween(startDate, endDate, pageable);
        
        return policies.map(this::mapToDto);
    }

    /**
     * Get active policies with pagination
     */
    @Override
    public Page<InsurancePolicyDto> getActivePolicies(int pageNo, int pageSize, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? 
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<InsurancePolicy> policies = policyRepository.findByEndDateAfterAndStatus(
                LocalDate.now(), Constants.POLICY_STATUS_ACTIVE, pageable);
        
        return policies.map(this::mapToDto);
    }

    /**
     * Get expired policies with pagination
     */
    @Override
    public Page<InsurancePolicyDto> getExpiredPolicies(int pageNo, int pageSize, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? 
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<InsurancePolicy> policies = policyRepository.findByEndDateBefore(LocalDate.now(), pageable);
        
        return policies.map(this::mapToDto);
    }

    /**
     * Get policies by vehicle details with pagination
     */
    @Override
    public Page<InsurancePolicyDto> getPoliciesByVehicleDetails(String searchTerm, int pageNo, int pageSize, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? 
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<InsurancePolicy> policies = policyRepository.findByVehicleDetails(searchTerm, searchTerm, searchTerm, pageable);
        
        return policies.map(this::mapToDto);
    }

    /**
     * Get policies by premium amount range with pagination
     */
    @Override
    public Page<InsurancePolicyDto> getPoliciesByPremiumRange(BigDecimal minAmount, BigDecimal maxAmount, int pageNo, int pageSize, String sortBy, String sortDir) {
        if (minAmount.compareTo(maxAmount) > 0) {
            throw new RuntimeException("Minimum amount cannot be greater than maximum amount");
        }
        
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ? 
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        
        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<InsurancePolicy> policies = policyRepository.findByPremiumAmountRange(minAmount, maxAmount, pageable);
        
        return policies.map(this::mapToDto);
    }

    /**
     * Update an existing policy
     */
    @Override
    @Transactional
    public InsurancePolicyDto updatePolicy(Long id, InsurancePolicyDto policyDto) {
        // Get the existing policy
        InsurancePolicy policy = policyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(Constants.ERROR_POLICY_NOT_FOUND + id));
        
        // Check if policy is active
        if (!policy.getStatus().equals(Constants.POLICY_STATUS_ACTIVE)) {
            throw new RuntimeException(Constants.ERROR_EXPIRED_POLICY);
        }
        
        // Update vehicle if changed
        Vehicle vehicle = policy.getVehicle();
        if (!policy.getVehicle().getId().equals(policyDto.getVehicleId())) {
            vehicle = vehicleRepository.findById(policyDto.getVehicleId())
                    .orElseThrow(() -> new RuntimeException(Constants.ERROR_VEHICLE_NOT_FOUND + policyDto.getVehicleId()));
        }
        
        // Validate dates
        if (policyDto.getEndDate().isBefore(policyDto.getStartDate())) {
            throw new RuntimeException(Constants.ERROR_INVALID_DATE_RANGE);
        }
        
        // Update policy fields
        policy.setProvider(policyDto.getProvider());
        policy.setVehicle(vehicle);
        policy.setStartDate(policyDto.getStartDate());
        policy.setEndDate(policyDto.getEndDate());
        policy.setPremiumAmount(policyDto.getPremiumAmount());
        policy.setCoverageType(policyDto.getCoverageType());
        policy.setDeductibleAmount(policyDto.getDeductibleAmount());
        policy.setLiabilityCoverageAmount(policyDto.getLiabilityCoverageAmount());
        policy.setComprehensiveCoverageAmount(policyDto.getComprehensiveCoverageAmount());
        policy.setCollisionCoverageAmount(policyDto.getCollisionCoverageAmount());
        policy.setNotes(policyDto.getNotes());
        policy.setUpdatedAt(LocalDateTime.now());
        
        // Save and return
        InsurancePolicy updatedPolicy = policyRepository.save(policy);
        return mapToDto(updatedPolicy);
    }

    /**
     * Delete a policy by id
     */
    @Override
    @Transactional
    public void deletePolicy(Long id) {
        InsurancePolicy policy = policyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(Constants.ERROR_POLICY_NOT_FOUND + id));
        
        
        policyRepository.delete(policy);
    }
    
    /**
     * Map entity to DTO
     */
    private InsurancePolicyDto mapToDto(InsurancePolicy policy) {
        return InsurancePolicyDto.builder()
                .id(policy.getId())
                .policyNumber(policy.getPolicyNumber())
                .provider(policy.getProvider())
                .vehicleId(policy.getVehicle().getId())
                .vehicleRegistration(policy.getVehicle().getRegistrationNumber())
                .vehicleMake(policy.getVehicle().getMake())
                .vehicleModel(policy.getVehicle().getModel())
                .startDate(policy.getStartDate())
                .endDate(policy.getEndDate())
                .premiumAmount(policy.getPremiumAmount())
                .coverageType(policy.getCoverageType())
                .deductibleAmount(policy.getDeductibleAmount())
                .liabilityCoverageAmount(policy.getLiabilityCoverageAmount())
                .comprehensiveCoverageAmount(policy.getComprehensiveCoverageAmount())
                .collisionCoverageAmount(policy.getCollisionCoverageAmount())
                .status(policy.getStatus())
                .notes(policy.getNotes())
                .build();
    }
    
    /**
     * Map DTO to entity
     */
    private InsurancePolicy mapToEntity(InsurancePolicyDto dto, Vehicle vehicle) {
        return InsurancePolicy.builder()
                .policyNumber(dto.getPolicyNumber())
                .provider(dto.getProvider())
                .vehicle(vehicle)
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .premiumAmount(dto.getPremiumAmount())
                .coverageType(dto.getCoverageType())
                .deductibleAmount(dto.getDeductibleAmount())
                .liabilityCoverageAmount(dto.getLiabilityCoverageAmount())
                .comprehensiveCoverageAmount(dto.getComprehensiveCoverageAmount())
                .collisionCoverageAmount(dto.getCollisionCoverageAmount())
                .notes(dto.getNotes())
                .build();
    }
} 