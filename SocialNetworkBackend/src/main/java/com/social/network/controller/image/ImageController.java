package com.social.network.controller.image;

import com.social.network.dto.response.ApiResponse;
import com.social.network.service.image.ImageService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/user/image")
public class ImageController {
    ImageService imageService;


    @DeleteMapping
    public ApiResponse<String> deleteById(@RequestParam Long id){
        return ApiResponse.<String>builder()
                .result(imageService.deleteById(id))
                .build();
    }
}
