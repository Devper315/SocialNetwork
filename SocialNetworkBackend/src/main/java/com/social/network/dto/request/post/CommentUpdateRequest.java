package com.social.network.dto.request.post;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentUpdateRequest
{
    Long id;
    private String content;
    private String imageUrl;
    LocalDateTime time;
}
