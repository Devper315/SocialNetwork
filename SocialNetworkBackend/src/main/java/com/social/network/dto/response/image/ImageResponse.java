package com.social.network.dto.response.image;

import com.social.network.entity.image.Image;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ImageResponse {
    Long id;
    String url;


    public ImageResponse(Image image){
        this.id = image.getId();
        this.url = image.getUrl();
    }
}
