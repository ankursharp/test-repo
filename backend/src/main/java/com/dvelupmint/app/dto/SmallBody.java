package com.dvelupmint.app.dto;

public class SmallBody {
    private String id;
    private String name;
    private String designation;

    public SmallBody() {
    }

    public SmallBody(String id, String name, String designation) {
        this.id = id;
        this.name = name;
        this.designation = designation;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDesignation() {
        return designation;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    @Override
    public String toString() {
        return "SmallBody{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", designation='" + designation + '\'' +
                '}';
    }
}
