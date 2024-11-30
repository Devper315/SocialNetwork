package com.social.network.dto.post;

import com.social.network.entity.image.Image;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ImageDTO {
    Long id;
    String url;
    String filePath;

    public ImageDTO(Image image){
        this.id = image.getId();
        this.url = image.getUrl();
        this.filePath = image.getFilePath();
    }
}
