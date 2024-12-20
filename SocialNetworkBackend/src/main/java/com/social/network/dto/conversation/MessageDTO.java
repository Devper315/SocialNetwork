package com.social.network.dto.conversation;

import com.social.network.entity.image.Image;
import com.social.network.entity.message.MessageCustom;
import com.social.network.entity.message.MessageStatus;
import com.social.network.utils.DateUtils;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Collections;
import java.util.List;
import java.util.Optional;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MessageDTO {
    Long id;
    String sender;
    String recipient;
    String reader;
    Long conversationId;
    ConversationDTO conversation;
    String content;
    String time;
    List<String> imageUrls;
    MessageStatus status;

    public MessageDTO(MessageCustom messageCustom) {
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
