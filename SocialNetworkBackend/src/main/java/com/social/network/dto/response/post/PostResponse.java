package com.social.network.dto.response.post;

import com.social.network.entity.image.Image;
import com.social.network.entity.post.Post;
import com.social.network.utils.DateUtils;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostResponse {
    Long id;
    String content;
    List<String> imageUrls;
    String time;
    private Long groupId;

    public PostResponse(Post post) {
        this.id = post.getId();
        this.content = post.getContent();
        this.imageUrls = (post.getImageList() != null) ?
                post.getImageList().stream()
                        .map(Image::getUrl)
                        .collect(Collectors.toList())
                : new ArrayList<>();

        this.time = DateUtils.reFormatDateTime(post.getCreatedTime());
        this.groupId = post.getGroup() != null ? post.getGroup().getId() : null;
    }

}
