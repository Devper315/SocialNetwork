package com.social.network.utils;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class PageableUtils {
    public static Pageable createPageable(int page, int size, String...sortBy){
        Sort sort = Sort.by(sortBy);
        return PageRequest.of(page, size, sort);
    }
}
