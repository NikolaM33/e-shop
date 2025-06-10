package com.shop.service.file;

public interface FileService {

    byte[] getProductImage(String imageIdentifier);

    byte[] getCategoryImage(String imageIdentifier);

}
