package com.omniqa.api.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Product {
    private int id;
    private String title;
    private String description;
    private double price;
    private String currencyFormat;
    private String currencyId;
    private int installments;
    private boolean isFav;
    private List<String> availableSizes;
    private String sku;
    private String altText;

    public Product() {}

    public Product(int id, String title, String description, double price, String currencyFormat,
                   String currencyId, int installments, boolean isFav, List<String> availableSizes,
                   String sku, String altText) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.currencyFormat = currencyFormat;
        this.currencyId = currencyId;
        this.installments = installments;
        this.isFav = isFav;
        this.availableSizes = availableSizes;
        this.sku = sku;
        this.altText = altText;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getCurrencyFormat() { return currencyFormat; }
    public void setCurrencyFormat(String currencyFormat) { this.currencyFormat = currencyFormat; }

    public String getCurrencyId() { return currencyId; }
    public void setCurrencyId(String currencyId) { this.currencyId = currencyId; }

    public int getInstallments() { return installments; }
    public void setInstallments(int installments) { this.installments = installments; }

    public boolean isFav() { return isFav; }
    public void setFav(boolean fav) { isFav = fav; }

    public List<String> getAvailableSizes() { return availableSizes; }
    public void setAvailableSizes(List<String> availableSizes) { this.availableSizes = availableSizes; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getAltText() { return altText; }
    public void setAltText(String altText) { this.altText = altText; }
}
