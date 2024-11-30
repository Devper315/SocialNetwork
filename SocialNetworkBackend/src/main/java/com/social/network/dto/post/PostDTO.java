package com.social.network.dto.post;

import com.social.network.entity.image.Image;
import com.social.network.entity.post.Post;
import com.social.network.utils.DateUtils;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PostDTO {
    Long id;
    String content;
    List<ImageDTO> images;
    List<ImageDTO> newImages;
    List<ImageDTO> deleteImages;
    String time;
    String author;
    Long groupId;
    Long approvalStatus;

    public PostDTO(Post post) {
        this.id = post.getId();
        this.content = post.getContent();
        this.images = Optional.ofNullable(post.getImageList())
                .orElseGet(ArrayList::new).stream().map(ImageDTO::new).toList();
        this.time = DateUtils.reFormatDateTime(post.getCreatedTime());
        this.groupId = post.getGroup() != null ? post.getGroup().getId() : null;
        this.author = post.getAuthor().getFullName();
        this.approvalStatus = post.getApprovalStatus();
    }
}
