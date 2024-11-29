package com.social.network.dto.response.message;

import com.social.network.entity.message.MessageCustom;
import com.social.network.entity.message.MessageStatus;
import com.social.network.entity.image.Image;
import com.social.network.utils.DateUtils;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageResponse {
    Long id;
    Long conversationId;
    String sender;
    String content;
    String time;
    MessageStatus status;
    List<String> imageUrls;

    public MessageResponse(MessageCustom messageCustom) {
        this.id = messageCustom.getId();
        this.conversationId = messageCustom.getConversation().getId();
        this.sender = messageCustom.getSender().getUsername();
        this.content = messageCustom.getContent();
        this.time = DateUtils.reFormatDateTime(messageCustom.getTime());
        this.status = messageCustom.getStatus();
        this.imageUrls = Optional.ofNullable(messageCustom.getImageList())
                .orElse(Collections.emptyList())
                .stream().map(Image::getUrl).toList();
    }
}
