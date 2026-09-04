package com.omniqa.db.models;

public class UserEntity {
    private int id;
    private String username;
    private String password;
    private String displayName;
    private String status;

    public UserEntity() {}

    public UserEntity(int id, String username, String password, String displayName, String status) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.displayName = displayName;
        this.status = status;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
