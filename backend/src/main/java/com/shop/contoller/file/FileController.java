package com.shop.contoller.file;

import com.shop.service.file.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@RequestMapping("/local")
public class FileController {

    private final FileService fileService;

    @GetMapping("/product/{imageIdentifier}")
    public ResponseEntity<byte[]> getProductImage (@PathVariable ("imageIdentifier") String imageIdentifier){
     return new ResponseEntity<>(fileService.getProductImage(imageIdentifier), HttpStatus.OK);
    }
}
