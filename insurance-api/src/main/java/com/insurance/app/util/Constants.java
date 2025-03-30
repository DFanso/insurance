package com.insurance.app.util;

/**
 * Constants class containing all hardcoded values used throughout the application
 */
public class Constants {
    
    // API URLs
    public static final String API_BASE_URL = "/api";
    public static final String HEALTH_URL = API_BASE_URL + "/health";
    public static final String VEHICLE_URL = API_BASE_URL + "/vehicles";
    public static final String INSURANCE_URL = API_BASE_URL + "/insurance";
    
    // Pagination defaults
    public static final String DEFAULT_PAGE_NUMBER = "0";
    public static final String DEFAULT_PAGE_SIZE = "10";
    public static final String DEFAULT_SORT_BY = "id";
    public static final String DEFAULT_SORT_DIRECTION = "asc";
    
    // Insurance policy status
    public static final String POLICY_STATUS_ACTIVE = "ACTIVE";
    public static final String POLICY_STATUS_EXPIRED = "EXPIRED";
    public static final String POLICY_STATUS_CANCELLED = "CANCELLED";
    
    // Date format
    public static final String DATE_FORMAT = "yyyy-MM-dd";
    
    // Error messages
    public static final String ERROR_POLICY_NOT_FOUND = "Insurance policy not found with id: ";
    public static final String ERROR_VEHICLE_NOT_FOUND = "Vehicle not found with id: ";
    public static final String ERROR_EXPIRED_POLICY = "Cannot update expired or cancelled policy";
    public static final String ERROR_INVALID_DATE_RANGE = "End date must be after start date";
} 