package com.social.network.entity.image;

import com.social.network.entity.message.MessageCustom;
import com.social.network.entity.post.Post;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Image {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String firebasePath;
    String url;

    @ManyToOne
    Post post;

    @ManyToOne
    MessageCustom message;

}