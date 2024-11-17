package com.social.network.dto.response.message;

import com.social.network.entity.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class MemberDTO {
    String username;
    String fullname;
    String avatarUrl;

    public MemberDTO(User user){
        this.username = user.getUsername();
        this.fullname = user.getFullName();
        this.avatarUrl = user.getAvatarUrl();
    }
}
