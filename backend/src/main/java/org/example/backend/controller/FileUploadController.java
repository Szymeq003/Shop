package org.example.backend.controller;

import lombok.RequiredArgsConstructor;
import org.example.backend.service.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/uploads")
@RequiredArgsConstructor
public class FileUploadController {

    private final FileStorageService fileStorageService;

    @PostMapping
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        String filePath = fileStorageService.save(file);
        // Prepend host in production, but here we can use relative path or absolute if needed.
        // For local dev, returning the relative path starting with /uploads/ is enough if configured in WebConfig.
        return ResponseEntity.ok(Map.of("url", "http://localhost:8080" + filePath));
    }
}
