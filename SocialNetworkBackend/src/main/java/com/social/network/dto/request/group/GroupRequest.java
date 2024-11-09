package com.social.network.dto.request.group;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GroupRequest {
    Long id;
    String name;
    String imageUrl;
}
