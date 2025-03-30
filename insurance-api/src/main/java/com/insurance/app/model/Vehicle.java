package com.insurance.app.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vehicles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // Vehicle Information
    @Column(name = "vehicle_make", nullable = false)
    private String make;
    
    @Column(name = "vehicle_model", nullable = false)
    private String model;
    
    @Column(name = "vehicle_year", nullable = false)
    private Integer year;
    
    @Column(name = "vehicle_vin")
    private String vin;
    
    @Column(name = "vehicle_registration", nullable = false)
    private String registrationNumber;
    
    @Column(name = "vehicle_color")
    private String color;
    
    // Owner Information
    @Column(name = "owner_first_name", nullable = false)
    private String ownerFirstName;
    
    @Column(name = "owner_last_name", nullable = false)
    private String ownerLastName;
    
    @Column(name = "owner_email")
    private String ownerEmail;
    
    @Column(name = "owner_phone")
    private String ownerPhone;
    
    @Column(name = "owner_address")
    private String ownerAddress;
    
    @Column(name = "owner_license_number")
    private String ownerLicenseNumber;
    
    @Column(name = "owner_dob")
    private LocalDate ownerDateOfBirth;
    
    @Column(name = "insurance_policy_number")
    private String insurancePolicyNumber;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
} 