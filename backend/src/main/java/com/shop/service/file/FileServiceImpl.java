package com.shop.service.file;


import com.shop.util.FileManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Transactional(readOnly = true)
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Service
public class FileServiceImpl implements FileService {

    private final FileManager fileManager;

    /**
     * @param imageIdentifier
     * @return
     */
    @Override
    public byte[] getProductImage(String imageIdentifier) {

        return fileManager.getFileFromSystem(imageIdentifier, fileManager.PRODUCT_IMAGES_FILES_PATH);
    }
}
