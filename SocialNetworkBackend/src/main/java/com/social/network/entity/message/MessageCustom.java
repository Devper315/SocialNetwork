package com.social.network.entity.message;

import com.social.network.entity.image.Image;
import com.social.network.entity.user.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.jetbrains.annotations.NotNull;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class MessageCustom implements Comparable<MessageCustom>{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String content;

    @ManyToOne
    Conversation conversation;

    @Transient
    List<Image> imageList;

    @ManyToOne
    User sender;
    LocalDateTime time;
    MessageStatus status;


    @Override
    public int compareTo(@NotNull MessageCustom m) {
        return this.getTime().compareTo(m.getTime());
    }
}
