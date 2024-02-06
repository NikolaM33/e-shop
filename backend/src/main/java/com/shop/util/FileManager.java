package com.shop.util;

import com.shop.config.error.BadRequestException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.Base64;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;

import static com.shop.config.error.ErrorMessageConstants.FILE_UPLOAD_ERROR;

@RequiredArgsConstructor(onConstructor = @__(@Autowired), access = AccessLevel.PRIVATE)
@Service
@Slf4j
public class FileManager {

    @Value("${document.category.path}")
    public String CATEGORY_FILES_PATH;

    @Value("${document.subcategory.path}")
    public String SUBCATEGORY_FILES_PATH;

    @Value("${document.product.path}")
    public String PRODUCT_IMAGES_FILES_PATH;

    public String uploadFileToSystem(byte[] data, String filePath)  {
        String systemIdentifier = UUID.randomUUID().toString();

        Path path = Paths.get(filePath + "/" + systemIdentifier);
        try {
            Files.write(path, data, StandardOpenOption.CREATE_NEW);
        } catch (IOException e) {
            log.error("Error uploading file", e);
            throw new BadRequestException(FILE_UPLOAD_ERROR);
        }
        return systemIdentifier;
    }

    public String saveFileToSystem(byte[] data, String filePath, String fileName)  {

        Path path = Paths.get(filePath + "/" + fileName);
        try {
            Files.write(path, data, StandardOpenOption.CREATE_NEW);
        } catch (IOException e) {
            log.error("Error uploading file", e);
            throw new BadRequestException(FILE_UPLOAD_ERROR);
        }
        return fileName;
    }

    public byte[] downloadFile(String folder, String fileSystemIdentifer) {
        Path folderPath = Paths.get(folder);
        Path path = folderPath.resolve(fileSystemIdentifer);
        byte[] bytes = null;
        try {
            bytes = Files.readAllBytes(path);
        } catch (IOException e) {
            return null;
            //throw new BadRequestException(CAN_NOT_READ_FILE);
        }
        return bytes;
    }

    public String convertToBase64StringImage(byte[] image, String format){
        // Encode the image byte array to Base64
        String base64Image = Base64.getEncoder().encodeToString(image);

        // Create the data URL with the appropriate format
        String dataUrl = "data:" + format + ";base64," + base64Image;

        return dataUrl;

    }

    public String saveFileToSystem(byte[] file, String fileDestination) {
        if (Variables.springEnv.equals("dev") || Variables.springEnv.equals("docker-local")) {
            return uploadFileToSystem(file, fileDestination);
        } else {
            //TODO implement for production environment
            return null;
        }

    }
    public byte[] getFileFromSystem(String fileSystemIdentifer, String fileDestination ) {
        if (Variables.springEnv.equals("dev") || Variables.springEnv.equals("docker-local")) {
            return downloadFile(fileDestination, fileSystemIdentifer);

        } else {
            //TODO implement for production environment
            return null;
        }
    }

}
