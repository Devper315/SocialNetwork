package com.social.network.service.message;

import com.social.network.dto.conversation.MessageDTO;
import com.social.network.entity.image.Image;
import com.social.network.entity.message.Conversation;
import com.social.network.entity.message.MessageCustom;
import com.social.network.entity.message.MessageStatus;
import com.social.network.repository.message.MessageRepo;
import com.social.network.service.image.ImageService;
import com.social.network.service.user.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MessageService {
    MessageRepo messageRepo;
    UserService userService;
    ImageService imageService;
    public MessageCustom createMessage(MessageDTO request, Conversation conversation){
        LocalDateTime currentTime = LocalDateTime.now();
        MessageCustom newMessageCustom = MessageCustom.builder()
                .content(request.getContent()).sender(userService.getByUsername(request.getSender()))
                .status(MessageStatus.SENT).time(currentTime).conversation(conversation).isRead(false)
                .build();
        return messageRepo.save(newMessageCustom);
    }

    public List<MessageCustom> getByConversation(Conversation conversation, Long lastId){
        Pageable pageable = PageRequest.of(0, 10);
        List<MessageCustom> messages = messageRepo.findByConversation(conversation, lastId, pageable);
        for (MessageCustom message: messages){
            message.setImageList(imageService.getByMessage(message));
        }
        return messages;
    }


    public void markAsRead(MessageDTO message) {
        messageRepo.markAsRead(message.getId(), message.getConversationId());
    }

    private MessageCustom getById(Long id) {
        return messageRepo.findById(id).orElse(null);
    }

    public void updateMessageImage(MessageDTO request) {
        MessageCustom message = getById(request.getId());
        List<Image> images = request.getImageUrls().stream().map(url ->
                Image.builder().message(message).url(url)
                     .build()).toList();
        imageService.saveAll(images);
    }
}
