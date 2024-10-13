package com.social.network.service.message;

import com.social.network.dto.request.MessageCreateRequest;
import com.social.network.entity.message.Conversation;
import com.social.network.entity.message.MessageCustom;
import com.social.network.entity.message.MessageStatus;
import com.social.network.repository.message.MessageRepo;
import com.social.network.service.user.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MessageService {
    MessageRepo messageRepo;
    UserService userService;
    public void createMessage(MessageCreateRequest request, Conversation conversation){
        MessageCustom newMessageCustom = new MessageCustom();
        newMessageCustom.setContent(request.getContent());
        newMessageCustom.setSender(userService.getByUsername(request.getSender()));
        newMessageCustom.setStatus(MessageStatus.SENT);
        LocalDateTime currentTime = LocalDateTime.now();
        newMessageCustom.setTime(currentTime);
        newMessageCustom.setConversation(conversation);
        messageRepo.save(newMessageCustom);
    }

    public List<MessageCustom> getByConversation(Conversation conversation){
        Sort sort = Sort.by("time");
        return messageRepo.findByConversation(conversation, sort);
    }
}
