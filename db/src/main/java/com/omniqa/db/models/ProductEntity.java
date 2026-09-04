package com.omniqa.db.models;

public class ProductEntity {
    private int id;
    private String title;
    private String description;
    private String vendor;
    private double price;
    private String currency;
    private int installments;
    private boolean isFav;
    private String sku;
    private int stockQuantity;

    public ProductEntity() {}

    public ProductEntity(int id, String title, String description, String vendor, double price,
                         String currency, int installments, boolean isFav, String sku, int stockQuantity) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.vendor = vendor;
        this.price = price;
        this.currency = currency;
        this.installments = installments;
        this.isFav = isFav;
        this.sku = sku;
        this.stockQuantity = stockQuantity;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getVendor() { return vendor; }
    public void setVendor(String vendor) { this.vendor = vendor; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public int getInstallments() { return installments; }
    public void setInstallments(int installments) { this.installments = installments; }

    public boolean isFav() { return isFav; }
    public void setFav(boolean fav) { isFav = fav; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public int getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(int stockQuantity) { this.stockQuantity = stockQuantity; }
}
