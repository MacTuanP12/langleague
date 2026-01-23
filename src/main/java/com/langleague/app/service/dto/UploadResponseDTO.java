package com.langleague.app.service.dto;

import java.io.Serializable;

public class UploadResponseDTO implements Serializable {

    private String fileUrl;

    public UploadResponseDTO(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }
}
