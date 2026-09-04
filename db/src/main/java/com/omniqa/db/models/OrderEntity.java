package com.omniqa.db.models;

import java.sql.Timestamp;

public class OrderEntity {
    private String orderId;
    private String username;
    private String firstName;
    private String lastName;
    private String address;
    private String state;
    private String postalCode;
    private double totalAmount;
    private String status;
    private Timestamp createdAt;

    public OrderEntity() {}

    public OrderEntity(String orderId, String username, String firstName, String lastName,
                       String address, String state, String postalCode, double totalAmount,
                       String status, Timestamp createdAt) {
        this.orderId = orderId;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.state = state;
        this.postalCode = postalCode;
        this.totalAmount = totalAmount;
        this.status = status;
        this.createdAt = createdAt;
    }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}
