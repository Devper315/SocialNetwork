package com.social.network.dto.response.friend;

import com.social.network.entity.user.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FriendRequestResponse {
    Long id;
    User requestor;
}
