package com.social.network.dto.group;

import com.social.network.dto.user.UserDTO;
import com.social.network.entity.group.GroupRequest;
import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class GroupRequestDTO {
    Long id;
    LocalDateTime time;
    UserDTO requestor;

    public GroupRequestDTO(GroupRequest groupRequest) {
        this.id = groupRequest.getId();
        this.requestor = new UserDTO(groupRequest.getRequestor());
        this.time = groupRequest.getTime();
    }
}
